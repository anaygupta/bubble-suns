const margin = { top: 50, right: 300, bottom: 100, left: 50 };

const width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3
  .select(".radar-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const center = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const radius = Math.min(width, height) / 2 + 10;
const radiusTextSpacing = 30;
const chartColor = ["#E56020", "#1D1160"];

const parseTime = d3.timeParse("%-m/%-d/%y"),
  formatTime = d3.timeFormat("%-m/%-d/%y");

const fullCircle = 2 * Math.PI;
const dotRadius = 2;

const x = d3.scaleBand().range([0, 2 * Math.PI]);
const y = d3.scaleLinear().range([0, radius]);

const filter = svg.append("defs").append("filter").attr("id", "glow"),
  feGaussianBlur = filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "7")
    .attr("result", "coloredBlur"),
  feMerge = filter.append("feMerge"),
  feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
  feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

const lineRadial = d3
  .lineRadial()
  .angle((d) => x(d[0]))
  .radius((d) => y(d[1]))
  .curve(d3.curveLinearClosed);

let radar, labels;

let xSlider;

const fields = ["FG", "TRB", "AST", "STL", "BLK", "TOV"];
const slider = d3
  .select(".slider")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 100)
  .append("g")
  .attr("class", "g-slider")
  .attr("transform", "translate(" + margin.left + "," + 40 + ")");

d3.csv("datasets/vis1_data.csv", function (error, data) {
  if (error) throw error;

  data = data.map((e) => ({
    date: parseTime(e.date),
    FG: +e.FG,
    TRB: +e.TRB,
    AST: +e.AST,
    STL: +e.STL,
    BLK: +e.BLK,
    TOV: +e.TOV,
  }));

  xSlider = d3
    .scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 530])
    .clamp(true);

  slider.select(".track").remove();

  slider
    .append("line")
    .attr("class", "track")
    .attr("x1", xSlider.range()[0])
    .attr("x2", xSlider.range()[1])
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(
      d3
        .drag()
        .on("start.interrupt", function () {
          slider.interrupt();
        })
        .on("start drag", function () {
          updateData(xSlider.invert(d3.event.x));
        })
    );

  slider
    .insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(xSlider.ticks(10))
    .enter()
    .append("text")
    .attr("x", xSlider)
    .attr("text-anchor", "middle")
    .text((d) => formatTime(d));

  const handle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 10);
  const handleText = slider
    .insert("text", ".track-overlay-text")
    .attr("class", "handle-text") 
    .attr('text-anchor' ,'middle')
    .attr('dy', '-1em')
    .text(formatTime(data[0].date));

  function updateData(record_date) {
    handle.attr("cx", xSlider(record_date));
    handleText.attr('x', xSlider(record_date)).text(formatTime(record_date))
    const matched = data.find(
      (e) => formatTime(e.date) === formatTime(record_date)
    );
    if (matched) {
      updateRadar(matched, parseTime("7/30/20"));
    }
  }

  let yMax = 0;

  //get radius Max Value
  data.forEach((record) => {
    fields.forEach((field) => {
      if (yMax < record[field]) {
        yMax = record[field];
      }
    });
  });

  x.domain(fields);
  y.domain([0, yMax]);

  const xAxis = center.append("g").attr("text-anchor", "middle");
  const xTick = xAxis.selectAll("g").data(fields).enter().append("g");

  xTick
    .append("line")
    .attr("class", "x-tick")
    .attr("y2", radius)
    .attr("transform", (d) => `rotate(${(x(d) / fullCircle) * 360})`);

  const yAxis = center.append("g").attr("text-anchor", "middle");

  const yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5))
    .enter()
    .append("g")
    .attr("class", "y-tick");

  yTick.append("circle").attr("r", (d) => y(d));

  yTick
    .append("text")
    .attr("y", (d) => -y(d))
    .attr("dy", "0.35em")
    .text((d) => d);

  labels = xTick.append("g").attr("class", "label");

  labels
    .append("text")
    .attr("y", radius + radiusTextSpacing)
    .attr(
      "x",
      (d) => Math.cos(x(d) + Math.PI / 2) * (radius + radiusTextSpacing)
    )
    .attr(
      "y",
      (d) => Math.sin(x(d) + Math.PI / 2) * (radius + radiusTextSpacing)
    )
    .attr("dy", "0.35em")
    .text((d) => d);

  radar = center.append("g");

  updateRadar(data[0], parseTime("7/30/20"));
});

function updateRadar(record, thredhold) {
  const extent = d3.extent([record.date, thredhold]);
  let color = chartColor[0];
  // console.log("Minimum: " + formatTime(extent[0]));
  // console.log("Maximum: " + formatTime(extent[1]));
  if (extent[0] === record.date) {
    color = chartColor[0];
  } else {
    color = chartColor[1];
  }

  radar.selectAll("*").remove();
  radar
    .append("path")
    .datum(Object.entries(record).filter((e) => e[0] !== "date"))
    .attr("class", "slice")
    .attr("d", lineRadial)
    .attr("transform", "rotate(180)")
    .style("stroke", color)
    .style("stroke-opacity", 1)
    .style("stroke-width", 2)
    .style("fill", color)
    .style("fill-opacity", 0.5)
    .style("filter", "url(#glow)");

  radar
    .selectAll("circle")
    .data(Object.entries(record).filter((e) => e[0] !== "date"))
    .enter()
    .append("circle")
    .attr("cx", (d) => Math.cos(x(d[0]) + Math.PI / 2) * y(d[1]))
    .attr("cy", (d) => Math.sin(x(d[0]) + Math.PI / 2) * y(d[1]))
    .attr("r", 6)
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("fill", color)
    .on("mouseover", function (d) {
      d3.select(this.parentNode)
        .append("text")
        .attr("x", () => Math.cos(x(d[0]) + Math.PI / 2) * y(d[1]))
        .attr("y", () => Math.sin(x(d[0]) + Math.PI / 2) * y(d[1]))
        .attr("dy", "-1em")
        .attr("text-anchor", "middle")
        .text(d[1]);
    })
    .on("mouseout", function () {
      d3.select(this.parentNode).select("text").remove();
    });
}

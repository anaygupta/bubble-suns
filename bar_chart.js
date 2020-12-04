var FGMSvg;
var ASTSvg;
var REBSvg;
var STLSvg;
var BLKSvg;
var TOVSvg;
var legendSvg;

var lineMargin = {top: 50, right: 20, bottom: 30, left: 30};
const width = 350 - lineMargin.left - lineMargin.right;
const height = 300 - lineMargin.top - lineMargin.bottom;


//var teamData;

FGMSvg = d3.select('#FGM_bar').append("svg")
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + lineMargin.left + "," + lineMargin.top + ")");

ASTSvg = d3.select('#AST_bar')
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

REBSvg = d3.select('#REB_bar')
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

STLSvg = d3.select('#STL_bar')
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

BLKSvg = d3.select('#BLK_bar')
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

TOVSvg = d3.select('#TOV_bar')
    .attr("width", width + lineMargin.left + lineMargin.right)
    .attr("height", height + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

// create scales
const xScale = d3.scaleBand()
    .domain(['Pre-Bubble', 'In-Bubble'])
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .range([height, 0]);

var colorscale = d3.scaleOrdinal()
    .domain(['In-Bubble', 'Pre-Bubble'])
    .range(["#1D1160", "#E56020"]);

drawBars();

function drawBars() {
    //removes any current bars before drawing new bars

    d3.selectAll(".bar").remove();
    d3.selectAll("text").remove();

    var selectedTeam = d3.select('#teamselect').property('value');

    d3.csv('datasets/vis2_dataset.csv', function(error, data) {
        if (error) throw error;
        //console.log(data);

        //data.filter(function(d) { return d.Team == selectedTeam});
        
        //FGM bar
        yScale.domain([0, 50]);

        // add axes
        FGMSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(5));

        FGMSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        FGMSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.FGM);})
            .attr("height", function(d) {return height - yScale(d.FGM);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        FGMSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Field Goals Made");

        //AST bar
        yScale.domain([0, 35]);

        // add axes
        ASTSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(3));

        ASTSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        ASTSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.AST);})
            .attr("height", function(d) {return height - yScale(d.AST);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        ASTSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Assists");

        //REB bar
        yScale.domain([0, 55]);

        // add axes
        REBSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(5));

        REBSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        REBSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.REB);})
            .attr("height", function(d) {return height - yScale(d.REB);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        REBSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Rebounds");

        //STL bar
        yScale.domain([0, 15]);

        // add axes
        STLSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(3));

        STLSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        STLSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.STL);})
            .attr("height", function(d) {return height - yScale(d.STL);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        STLSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Steals");

        //BLK bar
        yScale.domain([0, 8]);

        // add axes
        BLKSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(3));

        BLKSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        BLKSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.BLK);})
            .attr("height", function(d) {return height - yScale(d.BLK);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        BLKSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Blocks");

        //TOV bar
        yScale.domain([0, 20]);

        // add axes
        TOVSvg.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(5));

        TOVSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // append rectangles to bar chart
        TOVSvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .filter(function(d) {return d.Team == selectedTeam;})
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.Bubble);})
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) {return yScale(d.TOV);})
            .attr("height", function(d) {return height - yScale(d.TOV);})
            .attr("fill", function(d) {return colorscale(d.Bubble)});

        TOVSvg.append("text")
            .attr("x", 150)
            .attr("y", -25)
            .attr("font-family", "sans-serif")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .style("font-weight", 10)
            .text("Turnovers");

    });
}
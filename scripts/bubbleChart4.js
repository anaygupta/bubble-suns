// Resources Used
// - Referred to consistently to understand circle packing and data structure: https://observablehq.com/@d3/circle-packing, https://bl.ocks.org/jiankuang/93dba6fac49222458b3b35e7c233bace
// - Referred to for ending function: https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
// - Referred to for data structure, circle packing understanding, animations and rotation text: https://www.visualcinnamon.com/blog/, https://www.visualcinnamon.com/2015/11/learnings-from-a-d3-js-addict-on-starting-with-canvas
// - Referred to for hierarchy: https://github.com/d3/d3-hierarchy
// - Referred to for pack layout: https://d3-wiki.readthedocs.io/zh_CN/master/Pack-Layout/
// - Referred to for d3 version clashes: https://kristinhenry.medium.com/migrating-to-version-4-of-d3-part1-6a5e83ce8e31, https://iros.github.io/d3-v4-whats-new/#1, https://stackoverflow.com/questions/47032051/d3-js-v3-and-v4-enter-and-update-differences

function createBubbleChart(gameNumber) {
    d3.selectAll("svg").remove()
        .style('margin', '0');

    var topParent,
        allGames = [],
        IDdict = {},
        diameter,
        focus,
        oldFocus,
        k0,
        scaleFactor,
        curvedText = [0, 4, 23, -18, -10.5, -20, 20, 20, 46, -30, -25, -20, 20, 15, -30, -15, -45, 12, -15, -16, 15, 15, 5, 18, 5, 15, 20, -20, -25];

    setTimeout(drawMain, 250);

    function drawMain() {

        var width = Math.max($("#chart").width(), 350) - 20,
            height = (window.innerWidth < 768 ? width : window.innerHeight - 90);

        // really tablet size
        var mobileSize = (window.innerWidth < 768 ? true : false);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var colorCircle = d3.scale.ordinal()
            .domain([0, 1, 2, 3])
            .range(['#bfbfbf', '#838383', '#4c4c4c', '#1c1c1c']);

        diameter = Math.min(width * 0.9, height * 0.9);
        var pack = d3.layout.pack()
            .padding(1)
            .size([diameter, diameter])
            .value(function (d) {
                return d.size;
            })
            .sort(function (d) {
                return d.ID;
            });

        // var pack = d3.layout.pack()
        //     .padding(1)
        //     .size([diameter, diameter])
        //     // (d3.hierarchy(data)
        //     //     .sum(d => d.size)
        //     //     .sort(function (d) { return d.ID; }))
        // .value(function (d) { return d.size; });
        // .sort(function (d) { return d.ID; });
        // pack = data => d3.pack()
        //     .size([width - 2, height - 2])
        //     .padding(3)
        //     (d3.hierarchy(data)
        //         .sum(d => d.value)
        //         .sort((a, b) => b.value - a.value))


        // call focus on function
        function startPacking() {
            // console.log(oldFocus);
            oldFocus = topParent;
            // console.log(topParent.children[0]);
            k0 = 1;
            // console.log('LAKSJDHF');
            focusOn(topParent.children[0]);
            // focusOn(topParent);
        };

        // add tooltip on mouseover
        function addTooltip(d) {
            console.log(d.name);
            d3.select('#tooltip h1')
                .text(d.name)
                .style('font-size', '3em')
                .style('color', '#E56020');
            d3.select('#tooltip p')
                .text(d.size + ' ' + d.parent.name)
                .style('font-size', '3em')
                .style('color', '#1d1160');

            d3.select('#tooltip')
                // .style('left', d3.select(this).attr("cx") + "px")
                // .style('top', d3.select(this).attr("cx") + "px")
                .style('opacity', 1);
        }
        // hide tooltip on mouseout
        function removeTooltip() {
            d3.select('#tooltip').style('opacity', 0)
        }

        d3.csv("../datasets/viz3/ID" + gameNumber + ".csv", function (error, csv) {
            csv.forEach(function (d, i) {
                IDdict[d.name] = d.ID;
            });
        });

        d3.json("../datasets/viz3/game" + gameNumber + ".json", function (error, dataset) {
            var nodes = pack.nodes(dataset);
            topParent = dataset;
            // console.log(topParent);
            focus = dataset;
            // console.log(topParent);
            // console.log(focus);

            var chartWrapper = svg.selectAll("g")
                .data(nodes)
                .enter().append("g")
                .attr("class", "chartWrapper")
                .attr("id", function (d, i) {
                    // console.log(d.ID);
                    allGames[i] = d.name;
                    if (d.ID != undefined) {
                        // console.log("chartWrapper_" + d.ID);
                        return "chartWrapper_" + d.ID;
                    }
                    else {
                        return "chartWrapper_node";
                    }
                });
            // console.log(nodes);
            if (!mobileSize) {
                // d3.select('#tooltip')
                //     .attr('style', 'position: absolute; opacity: 0;');
                //Mouseover only on leaf nodes
                chartWrapper.filter(function (d) {
                    return typeof d.children === "undefined";
                })
                    .on("mouseover", addTooltip)
                    .on("mouseout", removeTooltip);
            }

            var circle = chartWrapper.append("circle")
                .attr("id", "nodeCircle")
                .attr("class", function (d, i) {
                    // console.log(d.parent);
                    // filtering as leaf, parent, etc.
                    return d.parent ? d.children ? "node" : "node node--leaf" : "node node--topParent";
                })
                .style("fill", function (d) {
                    // console.log(d.children);
                    return d.children ? colorCircle(d.depth) : null;
                })
                .style("fill", '#E56020')
                .style('opacity', '0.2')

                .on("click", function (d) {
                    console.log(focus);
                    if (focus !== d) {
                        focusOn(d);
                        console.log(d);
                        console.log(focus);
                    }
                    else {
                        focusOn(topParent);
                        console.log(d);
                        console.log(focus);
                    };
                });

            // parent circle
            var parentNode = [];
            circle
                .filter(function (d, i) {
                    return d3.select(this).attr("class") === "node";
                })
                .each(function (d, i) {
                    parentNode[i] = {
                        name: d.name,
                        depth: d.depth,
                        r: d.r,
                        x: d.x,
                        y: d.y
                    }
                });

            // create arcs for text
            var borderWrapper = svg.append("g")
                .attr("class", "borderWrapper")
                .style("opacity", 0);

            var hiddenArcs = borderWrapper.selectAll(".circleArcWrapper")
                .data(parentNode)
                .enter().append("path")
                .attr("class", "circleArcWrapper")
                .attr("id", function (d, i) {
                    return "circleArc_" + i;
                })
                .attr("d", function (d, i) {
                    return "M " + -d.r + " 0 A " + d.r + " " + d.r + " 0 0 1 " + d.r + " 0";
                })
                .style("fill", "none");

            var borderText = borderWrapper.selectAll(".circleText")
                .data(parentNode)
                .enter().append("text")
                .attr("class", "circleText")
                .style("font-size", function (d) {
                    d.fontSize = d.r / 10;
                    return Math.round(d.fontSize) + "px";
                })
                .append("textPath")
                .attr("startOffset", "50%")
                .attr("xlink:href", function (d, i) { return "#circleArc_" + i; })
                .text(function (d) {
                    return d.name.replace(/ and /g, ' & ');
                });

            setTimeout(function () {
                startPacking()
            }, 250);

        });
    }

    // zoom in and change focus to new element (child)
    function focusOn(d) {

        focus = d;
        var v = [focus.x, focus.y, focus.r * 2.05],
            k = diameter / v[2];

        d3.selectAll(".innerCircleTitle").selectAll("textSpan").remove();

        d3.selectAll(".borderWrapper")
            .transition().duration(0)
            .style("opacity", 0)
            .call(finish, changeParent);

        function changeParent() {

            var currID = (typeof IDdict[d.name] !== "undefined" ? IDdict[d.name] : d.ID.replace(/\.([^\.]*)$/, ""));

            d3.selectAll(".borderWrapper").selectAll(".circleArcWrapper")
                .attr("d", function (d, i) {
                    return "M " + (-d.r * k) + " 0 A " + (d.r * k) + " " + (d.r * k) + " 45 0 1 " + (d.r * k) + " 0";
                })
                .attr("transform", function (d, i) {
                    return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")rotate(" + curvedText[i] + ")";
                });

            // get all children
            var childs = [d.name];
            if (typeof d.children === "undefined") {
            }
            else if (typeof d.children !== "undefined") {
                for (var i = 0; i < d.children.length; i++) {
                    childs.push(d.children[i].name)
                };
            }

            // hiding labels not close to the focus
            d3.selectAll(".borderWrapper").selectAll(".circleText")
                .style("font-size", function (d) {
                    return Math.round(d.fontSize * k) + 'px';
                })
                .style("opacity", function (d) {
                    return $.inArray(d.name, childs) >= 0 ? 1 : 0;
                });

            setTimeout(function () {
                moveToNew(d, v, k);
            }, 50);

        }

    }

    function moveToNew(d, v, k) {
        var duration = 0;

        d3.selectAll(".chartWrapper").transition().duration(duration)
            .attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });

        d3.selectAll("#nodeCircle").transition().duration(duration)
            .attr("r", function (d) {
                if (d.ID === "1.1.1") scaleFactor = d.value / (d.r * d.r * k * k);
                return d.r * k;
            });

        setTimeout(function () {
            // transition border wrappers out and back in
            d3.selectAll(".borderWrapper")
                .transition().duration(1000)
                .style("opacity", 1);

            oldFocus = focus;
            k0 = k;
        }, duration);

    }

    //helper function -- source linked above
    function finish(transition, callback) {
        var n = 0;
        transition
            .each(function () { ++n; })
            .each("end", function () {
                if (!--n) callback.apply(this, arguments);
            });
    }
}

//create for game 1 on load
createBubbleChart(66);
// var i;
// for (i = 1; i < 4; i++) {
//     setTimeout(() => {
//         createChart(i)
//     }, 5000);
//     // createChart(i);
//     // sleep(5000);
//     // setTimeout(() => { createChart(i); }, 5000);

// }

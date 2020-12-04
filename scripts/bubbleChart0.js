
function createBubbleChart(gameNumber) {
    d3.selectAll("svg").remove()
        .style('margin', '0');

    var diameter,
        IDbyName = {},
        commaFormat = d3.format(','),
        root,
        allOccupations = [],
        focus,
        focus0,
        k0,
        scaleFactor,
        barsDrawn = false,

        rotationText = [0, 4, 23, -18, -10.5, -20, 20, 20, 46, -30, -25, -20, 20, 15, -30, -15, -45, 12, -15, -16, 15, 15, 5, 18, 5, 15, 20, -20, -25]; //The rotation of each arc text


    setTimeout(drawAll, 250);
    // console.log(root);
    // drawAll();
    function drawAll() {
        //////////////////////////////////////////////////////////////
        ////////////////// Create Set-up variables  //////////////////
        //////////////////////////////////////////////////////////////

        var width = Math.max($("#chart").width(), 350) - 20,
            height = (window.innerWidth < 768 ? width : window.innerHeight - 90);

        //console.log(width);
        //console.log(height);

        var mobileSize = (window.innerWidth < 768 ? true : false);

        //////////////////////////////////////////////////////////////
        /////////////////////// Create SVG  ///////////////////////
        //////////////////////////////////////////////////////////////

        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        //////////////////////////////////////////////////////////////
        /////////////////////// Create Scales  ///////////////////////
        //////////////////////////////////////////////////////////////

        var colorCircle = d3.scale.ordinal()
            .domain([0, 1, 2, 3])
            .range(['#bfbfbf', '#838383', '#4c4c4c', '#1c1c1c']);

        var colorBar = d3.scale.ordinal()
            .domain(["16 to 19", "20 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65+"])
            .range(["#EFB605", "#E3690B", "#CF003E", "#991C71", "#4F54A8", "#07997E", "#7EB852"]);

        diameter = Math.min(width * 0.9, height * 0.9);
        var pack = d3.layout.pack()
            .padding(1)
            .size([diameter, diameter])
            .value(function (d) { return d.size; })
            .sort(function (d) { return d.ID; });
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


        //Call to the zoom function to move everything into place
        function runAfterCompletion() {
            // createLegend(scaleFactor);
            // console.log(focus0);
            focus0 = root;
            // console.log(root.children[0]);
            k0 = 1;
            // d3.select("#loadText").remove();
            // console.log('LAKSJDHF');
            zoomTo(root.children[0]);
            // zoomTo(root);
        };

        //Hide the tooltip when the mouse moves away
        function removeTooltip() {
            d3.select('#tooltip').style('opacity', 0)
        }
        //Show the tooltip on the hovered over slice
        function showTooltip(d) {
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

        //////////////////////////////////////////////////////////////
        ///////////////// Data | Read in Age data ////////////////////
        //////////////////////////////////////////////////////////////

        //Global variables
        var data,
            dataMax,
            dataById = {};

        d3.csv("../datasets/viz3/ID" + gameNumber + ".csv", function (error, csv) {
            csv.forEach(function (d, i) {
                IDbyName[d.name] = d.ID;
            });
        });

        // console.log(IDbyName);
        //////////////////////////////////////////////////////////////
        /////////// Read in Occupation Circle data ///////////////////
        //////////////////////////////////////////////////////////////

        d3.json("../datasets/viz3/game" + gameNumber + ".json", function (error, dataset) {
            var nodes = pack.nodes(dataset);
            root = dataset;
            // console.log(root);
            focus = dataset;
            // console.log(root);
            // console.log(focus);
            //////////////////////////////////////////////////////////////
            /////////// Create a wrappers for each occupation ////////////
            //////////////////////////////////////////////////////////////
            var plotWrapper = svg.selectAll("g")
                .data(nodes)
                .enter().append("g")
                .attr("class", "plotWrapper")
                .attr("id", function (d, i) {
                    // console.log(d.ID);
                    allOccupations[i] = d.name;
                    if (d.ID != undefined) {
                        // console.log("plotWrapper_" + d.ID);
                        return "plotWrapper_" + d.ID;
                    }
                    else {
                        return "plotWrapper_node";
                    }
                });
            // console.log(nodes);
            if (!mobileSize) {
                // d3.select('#tooltip')
                //     .attr('style', 'position: absolute; opacity: 0;');
                //Mouseover only on leaf nodes
                plotWrapper.filter(function (d) { return typeof d.children === "undefined"; })
                    .on("mouseover", showTooltip)
                    .on("mouseout", removeTooltip);
            }//if

            //////////////////////////////////////////////////////////////
            ///////////////////// Draw the circles ///////////////////////
            //////////////////////////////////////////////////////////////
            var circle = plotWrapper.append("circle")
                .attr("id", "nodeCircle")
                .attr("class", function (d, i) {
                    // console.log(d.parent);
                    return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
                })
                .style("fill", function (d) {
                    // console.log(d.children);
                    return d.children ? colorCircle(d.depth) : null;
                })
                .style("fill", '#E56020')
                .style('opacity', '0.2')
                // .attr("r", function (d) {
                //     console.log(d.r);
                //     if (d.ID === "1.1.1") {
                //         scaleFactor = d.value / (d.r * d.r);
                //     }
                //     return d.r;
                // })
                .on("click", function (d) {
                    console.log(focus);
                    if (focus !== d) {
                        zoomTo(d);
                        console.log(d);
                        console.log(focus);
                    }
                    else {
                        zoomTo(root);
                        console.log(d);
                        console.log(focus);
                    };
                });

            //////////////////////////////////////////////////////////////
            //////// Draw the titles of parent circles on the Arcs ///////
            //////////////////////////////////////////////////////////////

            //Create the data for the parent circles only
            var overlapNode = [];
            circle
                .filter(function (d, i) { return d3.select(this).attr("class") === "node"; })
                .each(function (d, i) {
                    overlapNode[i] = {
                        name: d.name,
                        depth: d.depth,
                        r: d.r,
                        x: d.x,
                        y: d.y
                    }
                });

            //Create a wrapper for the arcs and text
            var hiddenArcWrapper = svg.append("g")
                .attr("class", "hiddenArcWrapper")
                .style("opacity", 0);
            //Create the arcs on which the text can be plotted - will be hidden
            var hiddenArcs = hiddenArcWrapper.selectAll(".circleArcHidden")
                .data(overlapNode)
                .enter().append("path")
                .attr("class", "circleArcHidden")
                .attr("id", function (d, i) { return "circleArc_" + i; })
                .attr("d", function (d, i) { return "M " + -d.r + " 0 A " + d.r + " " + d.r + " 0 0 1 " + d.r + " 0"; })
                .style("fill", "none");
            //Append the text to the arcs
            var arcText = hiddenArcWrapper.selectAll(".circleText")
                .data(overlapNode)
                .enter().append("text")
                .attr("class", "circleText")
                .style("font-size", function (d) {
                    //Calculate best font-size
                    d.fontSize = d.r / 10;
                    return Math.round(d.fontSize) + "px";
                })
                .append("textPath")
                .attr("startOffset", "50%")
                .attr("xlink:href", function (d, i) { return "#circleArc_" + i; })
                .text(function (d) {
                    return d.name.replace(/ and /g, ' & ');
                });

            // call runCreateBars and use the `done` method
            // with `runAfterCompletion` as it's parameter
            setTimeout(function () { runAfterCompletion() }, 250);

        });
    }//drawAll

    //////////////////////////////////////////////////////////////
    //////////////////// The zoom function ///////////////////////
    //////////////////////////////////////////////////////////////

    //The zoom function
    //Change the sizes of everything inside the circle and the arc texts
    function zoomTo(d) {

        focus = d;
        var v = [focus.x, focus.y, focus.r * 2.05],
            k = diameter / v[2];

        //Remove the tspans of all the titles
        d3.selectAll(".innerCircleTitle").selectAll("tspan").remove();

        //Hide the node titles, update them
        d3.selectAll(".hiddenArcWrapper")
            .transition().duration(0)
            .style("opacity", 0)
            .call(endall, changeReset);

        function changeReset() {

            //Save the current ID of the clicked on circle
            //If the clicked on circle is a leaf, strip off the last ID number so it becomes its parent ID
            // console.log(IDbyName[d.name]);
            var currentID = (typeof IDbyName[d.name] !== "undefined" ? IDbyName[d.name] : d.ID.replace(/\.([^\.]*)$/, ""));
            //////////////////////////////////////////////////////////////
            /////////////// Change titles on the arcs ////////////////////
            //////////////////////////////////////////////////////////////

            //Update the arcs with the new radii
            d3.selectAll(".hiddenArcWrapper").selectAll(".circleArcHidden")
                .attr("d", function (d, i) { return "M " + (-d.r * k) + " 0 A " + (d.r * k) + " " + (d.r * k) + " 45 0 1 " + (d.r * k) + " 0"; })
                .attr("transform", function (d, i) {
                    return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")rotate(" + rotationText[i] + ")";
                });

            //Save the names of the circle itself and first children
            var kids = [d.name];
            if (typeof d.children !== "undefined") {
                for (var i = 0; i < d.children.length; i++) {
                    kids.push(d.children[i].name)
                };
            }//if

            //Update the font sizes and hide those not close the the parent
            d3.selectAll(".hiddenArcWrapper").selectAll(".circleText")
                .style("font-size", function (d) { return Math.round(d.fontSize * k) + 'px'; })
                .style("opacity", function (d) { return $.inArray(d.name, kids) >= 0 ? 1 : 0; });

            setTimeout(function () {
                changeLocation(d, v, k);
            }, 50);

        }//changeReset

    }//zoomTo

    //Move to the new location - called by zoom
    function changeLocation(d, v, k) {


        //////////////////////////////////////////////////////////////
        //////////////// Overal transform and resize /////////////////
        //////////////////////////////////////////////////////////////
        //Calculate the duration
        //If they are far apart, take longer
        //If it's a big zoom in/out, take longer
        //var distance = Math.sqrt(Math.pow(d.x - focus0.x,2) + Math.pow(d.y - focus0.y,2)),
        //	distancePerc = distance/diameter,
        //	scalePerc = Math.min(Math.max(k,k0)/Math.min(k,k0), 50)/50;
        //	duration = Math.max(1500*distancePerc + 1500, 1500*scalePerc + 1500);
        var duration = 0;

        //Transition the circles to their new location
        d3.selectAll(".plotWrapper").transition().duration(duration)
            .attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });

        //Transition the circles to their new size
        d3.selectAll("#nodeCircle").transition().duration(duration)
            .attr("r", function (d) {
                //Found on http://stackoverflow.com/questions/24293249/access-scale-factor-in-d3s-pack-layout
                if (d.ID === "1.1.1.1") scaleFactor = d.value / (d.r * d.r * k * k);
                return d.r * k;
            });

        setTimeout(function () {
            //Hide the node titles, update them at once and them show them again
            d3.selectAll(".hiddenArcWrapper")
                .transition().duration(1000)
                .style("opacity", 1);

            //Hide the bar charts, then update them at once and show the magain

            focus0 = focus;
            k0 = k;
        }, duration);

    }//changeSizes

    //////////////////////////////////////////////////////////////
    ///////////////////// Helper Functions ///////////////////////
    //////////////////////////////////////////////////////////////

    //Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
    function wrap(text, width) {
        //console.log(d3.select(text));
        var text = d3.select(text),
            words = text.text().split(/\s+/).reverse(),
            currentSize = +(text.style("font-size")).replace("px", ""),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.2, // ems
            extraHeight = 0.2,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            //First span is different - smaller font
            tspan = text.text(null)
                .append("tspan")
                .attr("class", "subTotal")
                .attr("x", 0).attr("y", y)
                .attr("dy", dy + "em")
                .style("font-size", (Math.round(currentSize * 0.5) <= 5 ? 0 : Math.round(currentSize * 0.5)) + "px");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width | word === "|") {
                if (word = "|") word = "";
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", 0).attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + extraHeight + dy + "em")
                    .text(word);
            }//if
        }//while
    }//wrap

    //Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
    //Calls a function only after the total transition ends
    function endall(transition, callback) {
        var n = 0;
        transition
            .each(function () { ++n; })
            .each("end", function () { if (!--n) callback.apply(this, arguments); });
    }//endall
}

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

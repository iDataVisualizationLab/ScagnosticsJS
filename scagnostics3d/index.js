let scag = null;
let datasets = [];
let svgWidth = 400;
let svgHeight = 400;
let duration = 1000;
let dataPointRadius = 4;
let dataPointOpacity = 0.9;
let pointColor = 'steelblue';
let binOpacity = 0.8,
    margins = {left: 5, top: 5, right: 5, bottom: 5},
    padding = 5,
    contentWidth = svgWidth - margins.left - margins.right - 2 * padding,
    contentHeight = svgHeight - margins.top - margins.bottom - 2 * padding;
let scagsvg = d3.select("#scagsvg").attr("width", svgWidth).attr("height", svgHeight);

function drawContentBound(svg) {
    let x = margins.left;
    let y = margins.top;
    let rectWidth = +svg.attr("width") - margins.left - margins.right;
    let rectHeight = +svg.attr("height") - margins.top - margins.bottom;
    // svg.append("rect").attr("x", x).attr("y", y).attr("width", rectWidth).attr("height", rectHeight).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "#ddd");
    svg.append("rect").attr("x", x + 90).attr("y", y + 90).attr("width", 300).attr("height", 300).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "#ddd");
}

//<editor-fold desc="section about animating the display">
let origPoints = null;
let bins = null;
let triangulations = null;//line
let mst = null;//line
let outlyingLinks = null;//line
let outlyingPoints = null;//circle
let noOutlyingTree = null;//path
let noOutlyingPoints = null;//circle
let runtGraph = null;
let v2Corners = null;//circle
let obtuseV2Corners = null;//path
let noOutlyingTriangulations = null;//path
let convexHull = null;//path
let concaveHull = null;//path
let v1s = null;//circle
let animateTime = 10;
//Choose one scag options for all data points.
let scagOptions = {
    startBinGridSize: 10,
    minBins: 10,
    maxBins: 250
}

function selectElements() {
    origPoints = scagsvg.selectAll('circle.origPoints');
    bins = scagsvg.selectAll('circle.bins');
    triangulations = scagsvg.selectAll('line.graphLines');//line
    mst = scagsvg.selectAll('line.mstLines');//line
    outlyingLinks = scagsvg.selectAll('line.outlyingLines');//line
    v2Corners = scagsvg.selectAll('circle.v2Corners');//circle
    v1s = scagsvg.selectAll('circle.v1Corners');//circle
    convexHull = scagsvg.selectAll('line.convexHullLines');
    concaveHull = scagsvg.selectAll('path.concaveHullFaces');
}

//This method is called in string (creating the button using JS) so though it is displayed as unused => it is used.
function toggleDisplay(selection) {
    if (!selection.empty()) {
        if (+d3.select(selection.node()).style("opacity") != 10e-6) {
            selection.transition().duration(1000).style("opacity", 10e-6).style("display", "none");
        } else {
            animateNodes(selection, animateTime, 10e-6, .8);
            selection.style("display", "inline");
        }
    }

}

function animateNodes(selection, time, fromOpacity, toOpacity, onEnd) {
    recurseDisplay(selection, 0, time, fromOpacity, toOpacity, onEnd);

    function recurseDisplay(selection, i, time, fromOpacity, toOpacity) {
        let nodes = selection.nodes();
        let length = nodes.length;
        if (i < length) {
            d3.select(nodes[i]).style("opacity", fromOpacity).transition().duration(time).style("opacity", toOpacity);
            i = i + 1;
            //recurse
            setTimeout(() => {
                recurseDisplay(selection, i, time, fromOpacity, toOpacity, onEnd);
            }, time);
        } else {
            if (onEnd) {
                onEnd();
            }
        }
    }
}

let theOptions = ["origPoints", "bins", "triangulations", "mst", "outlyingLinks"
    //, "outlyingPoints", "noOutlyingTree", "noOutlyingPoints"
    , "v2Corners",
    //"obtuseV2Corners",
    // "noOutlyingTriangulations",
    "convexHull",
    "concaveHull",
    "v1s"
];

function createControlButtons(theContainer, theOptions) {
    let controlButtons = d3.select("#" + theContainer);
    theOptions.forEach(option => {
        controlButtons.append("button")
            .attr("onclick", `toggleDisplay(${option})`)
            .html("Toggle " + option);

    });
}

createControlButtons("controlButtons", theOptions);
//</editor-fold>

let scaleX = d3.scaleLinear().domain([0, 1]).range([-contentWidth / 4, contentWidth / 4]),
    scaleY = d3.scaleLinear().domain([0, 1]).range([-contentHeight / 4, contentHeight / 4]),
    scaleZ = d3.scaleLinear().domain([0, 1]).range([-contentHeight / 4, contentHeight / 4]),
    scaleR = d3.scaleLinear().domain([0, 1]).range([0, contentHeight / 4]);
let origin = [contentWidth / 2, contentHeight / 2], xLine = [], yLine = [], zLine = [], beta = 0, alpha = 0,
    // startAngle =0;
    startAngle = Math.PI / 20;

//<editor-fold desc="Section about 3d objects">
let mx, my, mouseX, mouseY;
let yScale3d = d3._3d()
    .shape('LINE_STRIP')
    .origin(origin)
    .scale(contentHeight / 2)
    .rotateY(startAngle)
    .rotateX(-startAngle);
let xScale3d = d3._3d()
    .shape('LINE_STRIP')
    .origin(origin)
    .scale(contentHeight / 2)
    .rotateY(startAngle)
    .rotateX(-startAngle);
let zScale3d = d3._3d()
    .shape('LINE_STRIP')
    .origin(origin)
    .scale(contentHeight / 2)
    .rotateY(startAngle)
    .rotateX(-startAngle);
var grid3d = d3._3d()
    .shape('GRID', 11)
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(contentHeight / 2);
let point3d = d3._3d()
    .x(d => scaleX(d[0]))
    .y(d => scaleY(d[1]))
    .z(d => scaleZ(d[2]))
    .origin(origin)
    .scale(1)
    .rotateY(startAngle)
    .rotateX(-startAngle);
let line3d = d3._3d()
    .shape('LINE')
    .x(d => scaleX(d[0]))
    .y(d => scaleY(d[1]))
    .z(d => scaleZ(d[2]))
    .origin(origin)
    .scale(1)
    .rotateY(startAngle)
    .rotateX(-startAngle);
let triangle3d = d3._3d()
    .shape('TRIANGLE')
    .x(d => scaleX(d[0]))
    .y(d => scaleY(d[1]))
    .z(d => scaleZ(d[2]))
    .origin(origin)
    .scale(1)
    .rotateY(startAngle)
    .rotateX(-startAngle);
let cube3d = d3._3d()
    .shape('CUBE')
    .x(d => scaleX(d[0]))
    .y(d => scaleY(d[1]))
    .z(d => scaleZ(d[2]))
    .origin(origin)
    .scale(1)
    .rotateY(startAngle)
    .rotateX(-startAngle);

//</editor-fold>

const random = Math.random;
const pi = Math.PI;
const sin = Math.sin;
const cos = Math.cos;

/***********OUTLYING DATA*******************/
outlyingScatterPlot();

function outlyingScatterPlot() {
    let randomX = d3.randomNormal(contentWidth / 3, 50),
        randomY = d3.randomNormal(contentHeight / 3, 50),
        randomZ = d3.randomNormal(contentHeight / 3, 50),
        points = d3.range(100).map(function () {
            return [randomX(), randomY(), randomZ()];
        });
    //Push 3 more outlying points.
    points.push([contentWidth / 2 + 5 * 50, contentHeight / 2 + 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 - 5 * 50, contentHeight / 2 + 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 + 5 * 50, contentHeight / 2 - 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 + 3 * 50, contentHeight / 2 + 3 * 50, contentHeight / 2 + 3 * 50]);
    datasets.push(points);
}

/***********SKEWED DATA*******************/
skewedScatterPlot();

function skewedScatterPlot() {
    let points = [];
    for (let i = 0; i < svgWidth; i = i + svgWidth / 3) {
        for (let j = 0; j < svgHeight; j = j + svgHeight / 3) {
            for (let k = 0; k < svgHeight; k = k + svgHeight / 3) {
                const randomX = d3.randomNormal(i, svgWidth / 60),
                    randomY = d3.randomNormal(j, svgHeight / 60),
                    randomZ = d3.randomNormal(k, svgHeight / 60);
                d3.range(10).forEach(d => {
                    points.push([randomX(), randomY(), randomZ()]);
                });
            }
        }
    }
    datasets.push(points);
}


/***********CLUMPY DATA*******************/
clumpyScatterPlot();

function clumpyScatterPlot() {
    let randomX = muy => d3.randomNormal(muy, 7),
        randomY = muy => d3.randomNormal(muy, 7),
        randomZ = muy => d3.randomNormal(muy, 7),
        cluster1 = d3.range(200).map(function () {
            return [randomX(contentHeight / 3)() + 10 * random(), randomY(contentHeight / 3)() + 10 * random(), randomZ(contentHeight / 3)() + 10 * random()];
        }),
        cluster2 = d3.range(50).map(function () {
            return [randomX(2 * contentHeight / 3)(), randomY(2 * contentHeight / 3)(), randomZ(2 * contentHeight / 3)()];
        }),
        cluster3 = d3.range(50).map(function () {
            return [randomX(2 * contentHeight / 3)(), randomY(2 * contentHeight / 3)(), randomZ(contentHeight / 3)()];
        }),
        points = cluster1.concat(cluster2).concat(cluster3);
    datasets.push(points);
}


/***********SPARSE DATA*******************/
sparseScatterPlot();

function sparseScatterPlot() {
    // let cornerPoints = [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1], [0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]];
    // let points = [];
    // cornerPoints.forEach(p => {
    //     //Top left points
    //     let randomX = d3.randomNormal(p[0] * svgWidth / 4, 5),
    //         randomY = d3.randomNormal(p[1] * svgHeight / 4, 5),
    //         randomZ = d3.randomNormal(p[2] * svgHeight / 4, 5);
    //     d3.range(20).map(function () {
    //         points.push([randomX(), randomY(), randomZ()]);
    //     });
    // });
    // datasets.push(points);

    let cornerPoints = [[0, 1, 0], [0, 0, 1], [1, 0, 0], [1, 1, 1]];
    let points = [];
    cornerPoints.forEach(p => {
        //Top left points
        let randomX = d3.randomNormal(p[0] * svgWidth / 4, 2),
            randomY = d3.randomNormal(p[1] * svgHeight / 4, 2),
            randomZ = d3.randomNormal(p[2] * svgHeight / 4, 2);
        // let randomX = d3.randomNormal(p[0] * svgWidth / 4, 5),
        //     randomY = d3.randomNormal(p[1] * svgHeight / 4, 5),
        //     randomZ = d3.randomNormal(p[2] * svgHeight / 4, 5);
        d3.range(7).map(function () {
            points.push([randomX(), randomY(), randomZ()]);
        });
    });
    datasets.push(points);

}

/***********STRIATED DATA*******************/
striatedScatterPlot();

function striatedScatterPlot() {
    let x1 = (y1, z1) => 2 * y1 + 3 * z1 - 5;
    let x2 = (y2, z2) => 2 * y2 + 3 * z2 + 5;
    let noise = d3.randomUniform(-0.001, 0.001);
    // let noise = ()=>0;
    let plane1 = d3.range(200).map(() => {
        let yr = d3.randomUniform(0, 1);
        let zr = d3.randomUniform(0, 1);
        let y = yr();
        let z = zr();
        let x = x1(y, z);
        return [x, y, z];
    });
    let plane2 = d3.range(200).map(() => {
        let yr = d3.randomUniform(0, 1);
        let zr = d3.randomUniform(0, 1);
        let y = yr();
        let z = zr();
        let x = x2(y, z);
        return [x + noise(), y + noise(), z + noise()];
    });
    let points = plane1.concat(plane2);
    datasets.push(points);

    // //THE FOLLOWING IS FOR THE PAPER'S GRAPHIC ONLY
    // let x1 = t=>1+t, y1 = t=>3-1.3*t, z1 = t=>1-t;
    // let x2 = t=>-100-t, y2 = t=>-100+1.3*t, z2 = t=>-10+t;
    // let x3 = t=>-50-t, y3 = t=>-50+1.3*t, z3 = t=>-5+t;
    // let x4 = t=>30+t, y4 = t=>30-1.3*t, z4 = t=>5-t;
    // let noise = d3.randomUniform(-2, 2);
    // let line1 = d3.range(50).map(()=>{
    //     let t = d3.randomUniform(10, 50)();
    //     return [x1(t), y1(t)+noise(), z1(t)];
    // });
    // let line2 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x2(s), y2(s)+noise(), z2(s)];
    // });
    // let line3 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x3(s), y3(s)+noise(), z3(s)];
    // });
    //
    // let line4 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x4(s), y4(s)+noise(), z4(s)];
    // });
    //
    // let points = line1.concat(line2).concat(line3).concat(line4);
    // datasets.push(points);
}


/***********CONVEX DATA*******************/
convexScatterPlot();

function convexScatterPlot() {
    let randomX = d3.randomNormal(svgWidth / 2, 50),
        randomY = d3.randomNormal(svgHeight / 2, 50),
        randomZ = d3.randomNormal(svgHeight / 2, 50),
        points = d3.range(2000).map(function () {
            return [randomX(), randomY(), randomZ()];
        });
    datasets.push(points);
}

/***********SKINNY DATA*******************/
skinnyScatterPlot();

function skinnyScatterPlot() {
    let points = [];
    let deg_to_rad = Math.PI / 180.0;
    let depth = 4;
    let branchAngle = 45;
    generateTree(300, 300, -90, depth);
    generateTree(300, 300, 0, depth);
    generateTree(300, 300, 90, depth);
    generateTree(300, 300, 180, depth);

    function generateTree(x1, y1, angle, depth) {
        if (depth !== 0) {
            let x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 10.0);
            let y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 10.0);
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 165));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 255));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 345));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 435));
            generateTree(x2, y2, angle - branchAngle, depth - 1);
            generateTree(x2, y2, angle + branchAngle, depth - 1);
        }
    }


    function generatePointsOnLine(x1, y1, x2, y2, nPoints, zPlace) {
        let random = () => Math.random();
        let pointsOL = [];
        if (x1 === x2) {
            let deltaY = (y2 - y1) / nPoints;
            for (let i = 0; i < nPoints; i++) {
                let x = x1;
                let y = y1 + i * deltaY;
                pointsOL.push([x + random(), y + random(), zPlace + random()]);
            }
        } else {
            let a = (y2 - y1) / (x2 - x1);
            let b = -a * x1 + y1;
            let deltaX = (x2 - x1) / nPoints;
            for (let i = 0; i < nPoints; i++) {
                let x = x1 + i * deltaX;
                let y = a * x + b;
                pointsOL.push([x + random(), y + random(), zPlace + random()]);
            }
        }
        return pointsOL;
    }

    // for (let i = 0; i < 50; i++) {
    //     points.push([300 + random(), 300 + random(), i * (600 / 50) + random()])
    // }

    datasets.push(points);

}

/***********STRINGY DATA*******************/
stringyScatterPlot();

function stringyScatterPlot() {
    let noise = () => Math.random() / 12;
    let points = [];
    for (let x = 0; x < 150; x++) {
        points.push([x + noise(), Math.sin(x * Math.PI / 30) + noise(), Math.cos(x * Math.PI / 30) + noise()])
    }
    ;
    datasets.push(points);
    // let noise = () => Math.random() / 50;
    // let points = [];
    // for (let x = 0; x < 150; x++) {
    //     points.push([x + noise(), Math.sin(x * Math.PI / 30) + noise(), Math.cos(x * Math.PI / 30) + noise()])
    // }
    // ;
    // datasets.push(points);
}

/***********Monotonic Data*******************/
monotonicScatterPlot();

function monotonicScatterPlot() {
    let noise = d3.randomUniform(-2, 2);
    let points = d3.range(150).map((x) => {
        return [x + noise(), 150 - x + noise(), x + noise()];
    });
    datasets.push(points);
}

changeDataset(document.getElementById("scagnostics"));

function changeDataset(evt) {
    let points = datasets[evt.selectedIndex];
    //Reset parameters
    alpha = 0;
    beta = 0;

    draw(points);
}


function draw(points) {
    //Clean the svg if it has some data
    scagsvg.selectAll("*").remove();
    // drawContentBound(scagsvg);

    scag = scagnostics3d(points, scagOptions);

    //Add a g as the svg itself
    mainG = scagsvg.append('g').attr('transform', `translate(${margins.left}, ${margins.top})`);
    //Process yLine
    d3.range(-5, 6, 1).forEach(d => {
        xLine.push([d * 0.1, -0.5, -0.5]);
        yLine.push([-0.5, -d * 0.1, -0.5]);
        zLine.push([-0.5, -0.5, d * 0.1]);

    });
    let cubeDataPoints = [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1], [0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]];
    cubeDataPoints.id = 0;
    let grid = [];
    xLine.forEach(xVal => {
        zLine.forEach(zVal => {
            grid.push([xVal[0], 0.5, zVal[2]]);
        });
    });

    let binColor = d3.scaleSequential(d3.interpolateLab("#fff", "steelblue"))
        .domain(d3.extent(scag.bins.map(b => b.length)));

    let normalizedPoints = scag.normalizedPoints.map((d, i) => {
        if (d.id === undefined) {
            d.id = 'origPoints_' + i;
        }
        return d;
    });

    let leaderPoints = scag.bins.map((d, i) => {
        let ret = [d.x, d.y, d.z];
        if (ret.id === undefined) {
            ret.id = "leader_" + i;
        }
        if (ret.data === undefined) {
            ret.data = {};
        }
        ret.data.size = d.length;
        ret.data.binRadius = scag.binRadius;
        return ret
    });

    let graphLines = scag.graph.links.map((l, i) => {
        let ret = [l.source, l.target];
        if (ret.id === undefined) {
            ret.id = 'graphLine_' + i;
        }
        return ret;
    });

    let mstLines = scag.mst.links.map((l, i) => {
        let ret = [l.source, l.target];
        if (ret.id === undefined) {
            ret.id = 'mstLine_' + i;
        }
        return ret;
    });

    let outlyingLines = scag.outlyingLinks.map((l, i) => {
        let ret = [l.source, l.target];
        if (ret.id === undefined) {
            ret.id = 'outlyingLine_' + i;
        }
        return ret;
    });

    let v2CornersPoints = scag.v2Corners.map((d, i) => {
        let ret = d[0];
        if (ret.id === undefined) {
            ret.id = 'v2Corners_' + i;
        }
        return ret;
    });

    let v1CornersPoints = scag.v1s.map((d, i) => {
        let ret = d;
        if (ret.id === undefined) {
            ret.id = 'v1Corners_' + i;
        }
        return ret;
    });

    let convexHullLines = [];
    scag.convexHull.map((t, i) => {
        let l1 = [t[0], t[1]];
        l1.id = 'convexHull_l1_' + i;

        let l2 = [t[1], t[2]];
        l2.id = 'convexHull_l2_' + i;

        let l3 = [t[2], t[0]];
        l3.id = 'convexHull_l3_' + i;

        convexHullLines.push(l1);
        convexHullLines.push(l2);
        convexHullLines.push(l3);
    });


    let concaveHullFaces = scag.concaveHull.map((d, i) => {
        let ret = d;
        if (ret.id === undefined) {
            ret.id = 'concaveHullFace_' + i;
        }
        return ret;
    });

    let convexHullLinesOptions = {'stroke': 'blue', 'stroke-width': 2, 'opacity': 1.0}
    let concaveHullFacesOptions = {
        'stroke': 'purple', 'stroke-width': 0.3, 'fill-opacity': 0.9, 'fill': function (d) {
            return d.ccw ? 'lightgrey' : '#717171';
        }
    };
    let origPointsOptions = {
        'stroke': pointColor,
        'fill': pointColor,
        // 'fill': 'none',
        'opacity': dataPointOpacity,
        'opacity': 1,
        'r': dataPointRadius
    };
    let binsOptions = {
        'stroke': 'black',
        'fill': d => binColor(d.data.size),
        'opacity': binOpacity,
        'r': d => scaleR(d.data.binRadius)
        // 'r': 3
    };
    let graphLineOptions = {'stroke': 'black', 'stroke-width': 1, 'opacity': 1.0};
    let mstLineOptions = {'stroke': 'green', 'stroke-width': 2};
    let noOutlyingMstLineOptions = {'stroke': 'green', 'stroke-width': 3};
    let outlyingLineOptions = {'stroke': 'red', 'stroke-width': 3};
    let v2CornersOptions = {
        'stroke': 'black',
        'fill': 'yellow',
        'opacity': dataPointOpacity,
        'r': dataPointRadius + 2
    };
    let v1CornersOptions = {
        'stroke': 'black',
        'fill': 'orange',
        'opacity': dataPointOpacity,
        'r': dataPointRadius + 2
    };
    rotateAndDraw(alpha, beta, duration);
    //Select elements after drawing
    selectElements();//Select the elements after drawing for toggling purpose

    //Displaying messages
    let msgContainer = "msg";
    displayScagScores(scag, msgContainer);

    //Process the drag
    d3.select(mainG.node().parentNode).call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd))

    function rotateAndDraw(alpha, beta, duration) {
        let xGridData = grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(grid);
        let cubeData = cube3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([cubeDataPoints]);
        let pointsData = point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(normalizedPoints);
        let leadersData = point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(leaderPoints);
        let graphLinesData = line3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(graphLines);
        let mstLinesData = line3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(mstLines);
        let outlyingLinesData = line3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(outlyingLines);
        let v2CornersPointsData = point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(v2CornersPoints);
        let v1CornersPointsData = point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(v1CornersPoints);
        let convexHullLinesData = line3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(convexHullLines);
        let concaveHullFacesData = triangle3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(concaveHullFaces);

        drawCube(cubeData, mainG);
        drawXGrid(xGridData, mainG);
        drawCircles(pointsData, mainG, 'origPoints', duration, origPointsOptions);
        drawCircles(leadersData, mainG, 'bins', duration, binsOptions);
        drawLines(graphLinesData, mainG, 'graphLines', duration, graphLineOptions);
        drawLines(mstLinesData, mainG, 'mstLines', duration, mstLineOptions);
        drawLines(outlyingLinesData, mainG, 'outlyingLines', duration, outlyingLineOptions);
        drawCircles(v2CornersPointsData, mainG, 'v2Corners', duration, v2CornersOptions);
        drawCircles(v1CornersPointsData, mainG, 'v1Corners', duration, v1CornersOptions);
        drawLines(convexHullLinesData, mainG, 'convexHullLines', duration, convexHullLinesOptions);
        drawTriangles(concaveHullFacesData, mainG, 'concaveHullFaces', duration, concaveHullFacesOptions);
    }

    //<editor-fold desc="This section is drag processing">
    function dragStart() {
        mx = d3.event.x;
        my = d3.event.y;
    }

    function dragged() {
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta = (d3.event.x - mx + mouseX) * Math.PI / 230;
        alpha = (d3.event.y - my + mouseY) * Math.PI / 230 * (-1);
        rotateAndDraw(alpha, beta, 0);
    }

    function dragEnd() {
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }

    //</editor-fold>

    function drawLines(data, svg, classType, duration, lineOptions = {}) {
        let stroke = lineOptions.stroke;
        let strokeWidth = lineOptions['stroke-width'];
        let opacity = lineOptions.opacity;
        if (stroke === undefined) stroke = 'black';

        if (strokeWidth === undefined) strokeWidth = 0.5;
        if (opacity === undefined) opacity = 1.0;

        let lines = svg.selectAll(`line.${classType}`).data(data, d => d.id);
        lines
            .enter()
            .append('line')
            .attr('class', `_3d ${classType}`)
            .merge(lines)
            .attr('stroke', stroke)
            .attr('stroke-width', strokeWidth)
            .attr('opacity', opacity)
            .attr('x1', d => d[0].projected.x)
            .attr('y1', d => d[0].projected.y)
            .attr('x2', d => duration ? d[0].projected.x : d[1].projected.x)
            .attr('y2', d => duration ? d[0].projected.y : d[1].projected.y)
            .transition().duration(duration)
            .attr('x2', d => d[1].projected.x)
            .attr('y2', d => d[1].projected.y);
        lines.exit().remove();
        //Resort all the 3d elements
        svg.selectAll('._3d').sort(d3._3d().sort);
    }

    function drawCube(data, svg) {

        /* --------- FACES ---------*/
        var faces = svg.selectAll('path.face').data(data[0].faces, d => d.face);

        faces.enter()
            .append('path')
            .attr('class', 'face')
            .attr('fill', "none")
            .attr('stroke', "black")
            .attr("stroke-width", 1)
            .classed('_3d', true)
            .merge(faces)
            .attr('d', cube3d.draw);

        faces.exit().remove();

    }

    function drawXGrid(data, svg) {
        /*x-Grid*/
        let xGrid = svg.selectAll('path.grid').data(data);
        xGrid
            .enter()
            .append('path')
            .attr('class', '_3d grid')
            .merge(xGrid)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.3)
            .attr('fill', function (d) {
                // return d.ccw ? 'lightgrey' : '#717171';
                return 'lightgrey';
            })
            .attr('fill-opacity', 0.9)
            .attr('d', grid3d.draw);
        xGrid.exit().remove();
        //Resort all the 3d elements
        svg.selectAll('._3d').sort(d3._3d().sort);
    }

    function drawTriangles(data, svg, classType, duration, triangleOptions = {}) {
        let stroke = triangleOptions.stroke;
        let strokeWidth = triangleOptions['stroke-width'];
        let fill = triangleOptions.fill;
        let fillOpacity = triangleOptions['fill-opacity'];
        if (stroke === undefined) stroke = 'black';
        if (strokeWidth === undefined) strokeWidth = 0.3;
        if (fill === undefined) fill = 'lightgrey';
        if (fillOpacity === undefined) fillOpacity = 0.9;
        /*Triangle*/
        let triangles = svg.selectAll(`path.${classType}`).data(data, d => d.id);

        triangles
            .enter()
            .append('path')
            .attr('class', `_3d ${classType}`)
            .merge(triangles)
            .attr('stroke', stroke)
            .attr('stroke-width', strokeWidth)
            .transition().duration(duration)
            .attr('fill', fill)
            .attr('fill-opacity', fillOpacity)
            .attr('d', triangle3d.draw);
        triangles.exit().remove();
        //Resort all the 3d elements
        svg.selectAll('._3d').sort(d3._3d().sort);
    }

    function drawCircles(data, svg, classType, duration, circleOptions = {}) {
        let opacity = circleOptions.opacity;
        let r = circleOptions.r;
        let fill = circleOptions.fill;
        let stroke = circleOptions.stroke;

        if (opacity === undefined) opacity = 1.0;
        if (r === undefined) r = 1;
        if (fill === undefined) fill = 'black';
        if (stroke === undefined) stroke = 'black';


        let circles = svg.selectAll(`circle.${classType}`).data(data, d => d.id);

        circles
            .enter()
            .append('circle')
            .attr('class', `_3d ${classType}`)
            .attr('opacity', 10e-6)
            .attr('cx', d => d.projected.x)
            .attr('cy', d => d.projected.y)
            .attr('id', d => d.id)
            .merge(circles)
            .transition().duration(duration)
            .attr('r', r)
            .attr('stroke', stroke)
            .attr('fill', fill)
            .attr('opacity', opacity)
            .attr('cx', d => d.projected.x)
            .attr('cy', d => d.projected.y);
        circles.exit().remove();
        //Resort all the 3d elements
        svg.selectAll('._3d').sort(d3._3d().sort);
    }
}

function displayScagScores(scag) {
    d3.select('#scagBinsLengthMsg').html(scag.bins.length);
    d3.select('#outlyingUpperBoundMsg').html(scag.outlyingUpperBound);
    d3.select('#outlyingScoreMsg').html(scag.outlyingScore);
    d3.select('#skewedScoreMsg').html(scag.skewedScore);
    d3.select('#sparseScoreMsg').html(scag.sparseScore);
    d3.select('#clumpyScoreMsg').html(scag.clumpyScore);
    d3.select('#striatedScoreMsg').html(scag.striatedScore);
    d3.select('#convexScoreMsg').html(scag.convexScore);
    d3.select('#skinnyScoreMsg').html(scag.skinnyScore);
    d3.select('#stringyScoreMsg').html(scag.stringyScore);
    d3.select('#monotonicScoreMsg').html(scag.monotonicScore);
}

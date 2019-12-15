let datasets = [];
let scag = null;
let data = null;
let svgWidth = 1000;
let svgHeight = 1000;
let duration = 1000;
let dataPointRadius = 2;
let dataPointOpacity = 0.9;
let binOpacity = 0.8;
let size = 500;

const random = Math.random;
/***********OUTLYING DATA*******************/
outlyingScatterPlot();

function outlyingScatterPlot() {
    let points = [];
    let dim = 10;
    //100 data points
    for (let i = 0; i < 100; i++) {
        //each point of 10 dimensions
        let point = [];
        for (let j = 0; j < dim; j++) {
            point.push(random());
        }
        points.push(point);
    }
    //Push outlying point(s)
    points.push([0.5, 0.5, 0.5, 2, 2, 2, .5, .5, 2, 2]);
    points.push([2, 2, 2, 2, 2, .5, .5, .5, .5, .5]);
    points.push([2, 2, .5, .5, 2, 2, 2, .5, .5, .5]);
    datasets.push(points);
}

/***********SKEWED DATA*******************/
skewedScatterPlot();

function skewedScatterPlot() {

    let dim = 10;
    let cluster1 = d3.range(60).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                point.push(random());
            }
            return point;
        }),
        cluster2 = d3.range(10).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                point.push(5 + 3 * random());
            }
            return point;
        }),

        cluster3 = d3.range(20).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                point.push(10 + 5 * random());
            }
            return point;
        }),
        points = cluster1.concat(cluster2).concat(cluster3);
    datasets.push(points);
}

/***********SPARSED DATA*******************/
sparseScatterPlot();

function sparseScatterPlot() {
    // let points = [];
    // let dim = 10;
    // for (let i = 0; i < 100; i++) {
    //     let point = [];
    //     for (let j = 0; j < dim; j++) {
    //         if (random() > 0.5) {
    //             point.push(30 + random());
    //         } else {
    //             point.push(random());
    //         }
    //     }
    //     points.push(point);
    // }
    // datasets.push(points);

    let points = [];
    let dim = 10;
    //Extreme of each coordinates
    //Cluster 1
    for (let i = 0; i < 8; i++) {
        let point = [];
        for (let j = 0; j < dim; j++) {
            if (j < dim / 3) {
                point.push(10 + random());
            } else {
                point.push(random());
            }
        }
        point.data = 'green';
        points.push(point);
    }
    //Cluster 2
    for (let i = 0; i < 8; i++) {
        let point = [];
        for (let j = 0; j < dim; j++) {
            if (j >= dim / 3 && j < 2 * dim / 3) {
                point.push(10 + random());
            } else {
                point.push(random());
            }
        }
        point.data = 'blue';
        points.push(point);
    }

    //Cluster 3
    for (let i = 0; i < 8; i++) {
        let point = [];
        for (let j = 0; j < dim; j++) {
            if (j >= 2 * dim / 3 && j < dim) {
                point.push(10 + random());
            } else {
                point.push(random());
            }
        }
        point.data = 'black';
        points.push(point);
    }

    //Cluster 4
    for (let i = 0; i < 6; i++) {
        let point = [];
        for (let j = 0; j < dim; j++) {
            point.push(10 + random());
        }
        point.data = 'red';
        points.push(point);
    }

    datasets.push(points);
}

/***********CLUMPY 3 CLUSTERS*******************/
clumpyScatterPlot();

function clumpyScatterPlot() {
    let dim = 10;
    let random = function () {
        return 2 * Math.random();
    }
    let cluster1 = d3.range(40).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                if (j < 4) {
                    point.push(10 + random());
                } else {
                    point.push(random());
                }
            }
            return point;
        }),
        cluster2 = d3.range(40).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                if (j >= 3 && j <= 6) {
                    point.push(10 + random());
                } else {
                    point.push(random());
                }
            }
            return point;
        }),
        cluster3 = d3.range(40).map(() => {
            let point = [];
            for (let j = 0; j < dim; j++) {
                if (j >= 6 && j <= 9) {
                    point.push(10 + random());
                } else {
                    point.push(random());
                }
            }
            return point;
        }),
        points = cluster1.concat(cluster2).concat(cluster3);
    datasets.push(points);
}

// /***********STRIATED data*******************/
// striatedScatterPlot();
//
// function striatedScatterPlot() {
//     let dim = 10;
//     let x1 = (y1, z1) => 2 * y1 + 3 * z1 - 5;
//     let x2 = (y2, z2) => 2 * y2 + 3 * z2 + 5;
//     let noise = d3.randomUniform(-0.001, 0.001);
//     // let noise = ()=>0;
//     let plane1 = d3.range(50).map(() => {
//         let yr = d3.randomUniform(0, 1);
//         let zr = d3.randomUniform(0, 1);
//         let y = yr();
//         let z = zr();
//         let x = x1(y, z);
//         let point = [x+noise(), y+noise(), z+noise()];
//         for (let i = 0; i < dim - 3; i++) {
//             point.push(noise());
//         }
//         return point;
//     });
//     let plane2 = d3.range(50).map(() => {
//         let yr = d3.randomUniform(0, 1);
//         let zr = d3.randomUniform(0, 1);
//         let y = yr();
//         let z = zr();
//         let x = x2(y, z);
//         let point = [x + noise(), y + noise(), z + noise()];
//         for (let i = 0; i < dim - 3; i++) {
//             point.push(noise());
//         }
//         return point;
//     });
//     let points = plane1.concat(plane2);
//     datasets.push(points);
// }

/***********STRINGY DATA*******************/
stringyScatterPlot();

function stringyScatterPlot() {
    let points = [];
    let dim = 10;
    for (let i = 1; i <= 100; i++) {
        let point = [];
        for (let j = 1; j <= dim; j++) {
            point.push(Math.sin(i + 2 * j));
        }
        points.push(point);
    }
    datasets.push(points);
}

/***********MONOTONIC DATA*******************/
monotonicScatterPlot();

function monotonicScatterPlot() {
    // let points = [];
    // let dim = 10;
    // //Big odd small even
    // for (let i = 1; i <= 50; i++) {
    //     let point = [];
    //     for (let j = 0; j < dim; j++) {
    //         if (j % 2 === 0) {
    //             point.push(i);
    //         } else {
    //             point.push(100 - i)
    //         }
    //     }
    //     points.push(point);
    // }
    //
    // for (let i = 1; i <= 50; i++) {
    //     let point = [];
    //     for (let j = 0; j < dim; j++) {
    //         if (i % 2 === 1) {
    //             point.push(i);
    //         } else {
    //             point.push(100 - i)
    //         }
    //     }
    //     points.push(point);
    // }
    //
    // datasets.push(points);

    let points = [];
    let dim = 10;
    for (let i = 1; i <= 50; i++) {
        let point = [];
        for (let j = 0; j < dim; j++) {
            point.push(i % 30);
        }
        points.push(point);
    }

    datasets.push(points);

}

changeDataset(document.getElementById("scagnostics"));

function changeDataset(evt) {
    let points = datasets[evt.selectedIndex];
    draw(points);
}


function draw(points) {
    let scagOptions = {
        startBinGridSize: 30,
        minBins: 30,
        maxBins: 100,
        outlyingCoefficient: 1.5,
        incrementA: 1,
        incrementB: 5,
        decrementA: 0.9,
        decrementB: 0,
        distanceWeights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    };
    // let scagOptions = {};
    scag = scagnosticsnd(points, scagOptions);
    //Displaying messages
    let msgContainer = "msg";
    displayScagScores(scag, msgContainer);

    let normalizedPoints = scag.normalizedPoints;
    let radarData = [];
    for (let i = 0; i < normalizedPoints.length; i++) {
        let point = {};
        point.axes = [];
        for (let j = 0; j < normalizedPoints[i].length; j++) {
            let item = {
                axis: 'd' + j,
                value: normalizedPoints[i][j],
            }
            point.axes.push(item);
        }
        point.data = normalizedPoints[i];
        radarData.push(point);
    }
    drawRadarChart(".radarChart", radarData);
}


function drawRadarChart(theDiv, radarData) {
    let margin = {top: 50, right: 80, bottom: 50, left: 80},
        width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom);
    const radarChartOptions = {
        w: 300,				//Width of the circle
        h: 350,				//Height of the circle
        margin: margin, //The margins of the SVG
        levels: 5,				//How many levels or inner circles should there be drawn
        maxValue: 1, 			//What is the value that the biggest circle will represent
        labelFactor: 1.15, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 2, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 1, 		//The widthue of the stroke around each blob
        strokeOpacity: 0.7,
        roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: pointColor,
        format: '.1',
        unit: '',
        legend: false,
        drawContentBound: drawContentBound
    };

    // Draw the chart, get a reference the created svg element :
    let svg_radar = RadarChart(theDiv, radarData, radarChartOptions);
    return svg_radar;

    function pointColor(d, i) {
        return (d.data && d.data.data) ? d.data.data : 'black';
    }
}

function drawContentBound(svg, options) {
    // let x = options.margin.left;
    // let y = options.margin.top;
    // svg.append("rect").attr("x", x - 30).attr("y", y - 5).attr("width", 360).attr("height", 360).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "#ddd");
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
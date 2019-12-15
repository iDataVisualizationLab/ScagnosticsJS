let scag = null;
let datasets = [];
let svgWidth = 400;
let svgHeight = 400;
let duration = 1000;
let dataPointRadius = 4;
let dataPointOpacity = 0.9;
// let pointColor = 'steelblue';
let pointColor = 'black';
let binOpacity = 0.8,
    margins = {left: 5, top: 5, right: 5, bottom: 5},
    padding = 5,
    contentWidth = svgWidth - margins.left - margins.right - 2 * padding,
    contentHeight = svgHeight - margins.top - margins.bottom - 2 * padding;

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
const random = Math.random;
const pi = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
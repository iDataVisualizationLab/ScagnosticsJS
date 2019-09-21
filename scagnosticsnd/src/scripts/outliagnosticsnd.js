import {Normalizer} from "./modules/normalizer";
import {LeaderBinner} from "./modules/leaderBinner";
import {_} from 'underscore'
import {createGraph, mst, equalPoints} from "./modules/kruskal-mst";
import {Outlying} from "./modules/outlying";
import {Skewed} from "./modules/skewed";
import {Sparse} from "./modules/sparse";
import {Clumpy} from "./modules/clumpy";
// import {Striated} from "./modules/striated";
// import {Convex} from "./modules/convex";
// import {Skinny} from "./modules/skinny";
import {Stringy} from "./modules/stringy";
import {Monotonic} from "./modules/monotonic";

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
(function (window) {
    /**
     * initialize a outliagnosticsnd object
     * @param inputPoints   {*[][]} set of points from the scatter plot
     * @returns {*[][]}
     */
    window.outliagnosticsnd = function (inputPoints, options = {}) {
        let result = {};
        let dims = inputPoints[0].length;
        //Clone it to avoid modifying it.
        let points = inputPoints.map(e => e.slice());
        //Add one step to pass the data over if there is.
        for (let i = 0; i < points.length; i++) {
            points[i].data = inputPoints[i].data;
        }
        let normalizedPoints = points;

        if (options.isNormalized === undefined) {
            let normalizer = new Normalizer(points);
            normalizedPoints = normalizer.normalizedPoints;
            outputValue("normalizedPoints", normalizedPoints);
            outputValue("normalizer", normalizer);
        }

        let binType = options.binType;
        /******This section isouasdtly about the outlying score and outlying score results******/
        let outlyingUpperBound = options.outlyingUpperBound;
        let outlyingCoefficient = options.outlyingCoefficient;

        /******This section is about finding number of bins and binners******/
        let sites = null;
        let bins = null;
        let binner = null;
        let binSize = null;
        let binRadius = 0;
        let startBinGridSize = options.startBinGridSize;

        if (options.isBinned === undefined) {//Only do the binning if needed.
            let incrementA = options.incrementA ? options.incrementA : 2;
            let incrementB = options.incrementB ? options.incrementB : 0;
            let decrementA = options.decrementA ? options.decrementA : 1 / 2;
            let decrementB = options.decrementB ? options.decrementB : 0;

            if (startBinGridSize === undefined) {
                startBinGridSize = 20;
            }
            bins = [];
            //Default number of bins
            let minNumOfBins = 30;
            let maxNumOfBins = 200;
            let minBins = options.minBins;
            let maxBins = options.maxBins;
            if (minBins) {
                minNumOfBins = minBins;
            }
            if (maxBins) {
                maxNumOfBins = maxBins;
            }

            do {
                //Start with binSize x binSize x binSize... bins, and then increase it as binSize = binSize * incrementA + incrementB or binSize = binSize * decrementA + decrementB.
                if (binSize === null) {
                    binSize = startBinGridSize;
                } else if (bins.length > maxNumOfBins) {
                    binSize = binSize * decrementA + decrementB;
                } else if (bins.length < minNumOfBins) {
                    binSize = binSize * incrementA + incrementB;
                }
                if (binType === "hexagon") {
                    // // This section uses hexagon binning
                    // let shortDiagonal = 1/binSize;
                    // binRadius = Math.sqrt(3)*shortDiagonal/2;
                    // binner = new Binner().radius(binRadius).extent([[0, 0], [1, 1]]);//extent from [0, 0] to [1, 1] since we already normalized data.
                    // bins = binner.hexbin(normalizedPoints);
                } else if (!binType || binType === "leader") {
                    // This section uses leader binner
                    binRadius = Math.sqrt(dims * Math.pow(1 / (binSize * 2), 2));
                    binner = new LeaderBinner(normalizedPoints, binRadius);
                    bins = binner.leaders;
                }
            } while (bins.length > maxNumOfBins || bins.length < minNumOfBins);
            // }
            sites = bins.map(d => d.site); //=>sites are the set of centers of all bins
            /******This section is about the binning and binning results******/
            outputValue("binner", binner);
            outputValue("bins", bins);
            outputValue("binSize", binSize);
            outputValue("binRadius", binRadius)
        } else {
            sites = normalizedPoints;
        }

        outputValue("binnedSites", sites);

        /******This section is about the spanning tree and spanning tree results******/
            //Spanning tree calculation
        let tetrahedraCoordinates = [sites];
        let weights = options.distanceWeights;
        let graph = createGraph(tetrahedraCoordinates, weights);
        let mstree = mst(graph);
        //Assigning the output values
        // outputValue("graph", graph);
        // outputValue("mst", mstree);

        /******This section is about the outlying score and outlying score results******/
            //TODO: Need to check if outlying links are really connected to outlying points
        let outlying = new Outlying(mstree, {
                outlyingUpperBound: outlyingUpperBound,
                outlyingCoefficient: outlyingCoefficient
            });
        let outlyingScore = outlying.score();
        outlyingUpperBound = outlying.upperBound;
        //Add outlying points from the bin to it.
        outputValue("outlyingScore", outlyingScore);
        outputValue("outlyingUpperBound", outlyingUpperBound);

        return result;

        function outputValue(name, value) {
            result[name] = value;
        }
    };

})(commonjsGlobal);
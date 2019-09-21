import {LeaderBinner} from "./modules/leaderBinner";
import {createGraph, mst, equalPoints} from "./modules/kruskal-mst";

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
(function (window) {
    /**
     * initialize a outliagnosticsnd object
     * @param inputPoints   {*[][]} set of points from the scatter plot
     * @returns {*[][]}
     */
    window.ndleaderbin = function (inputPoints, options = {}) {
        let result = {};
        let dims = inputPoints[0].length;
        //Clone it to avoid modifying it.
        let points = inputPoints.map(e => e.slice());
        //Add one step to pass the data over if there is.
        for (let i = 0; i < points.length; i++) {
            points[i].data = inputPoints[i].data;
        }
        let normalizedPoints = points;
        /******This section is about finding number of bins and binners******/
        let sites = null;
        let bins = null;
        let binner = null;
        let binSize = null;
        let binRadius = 0;
        let startBinGridSize = options.startBinGridSize;

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
            // This section uses leader binner
            binRadius = Math.sqrt(dims * Math.pow(1 / (binSize * 2), 2));
            binner = new LeaderBinner(normalizedPoints, binRadius);
            bins = binner.leaders;
        } while (bins.length > maxNumOfBins || bins.length < minNumOfBins);
        // }
        sites = bins.map(d => d.site); //=>sites are the set of centers of all bins
        /******This section is about the binning and binning results******/
        outputValue("binner", binner);
        outputValue("bins", bins);
        outputValue("binSize", binSize);
        outputValue("binRadius", binRadius)
        outputValue("binnedSites", sites);

        return result;

        function outputValue(name, value) {
            result[name] = value;
        }
    };

})(commonjsGlobal);
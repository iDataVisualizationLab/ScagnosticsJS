import {Delaunator} from "./modules/delaunator";
import {createGraph} from "./modules/kruskal-mst";
import {mst} from "./modules/kruskal-mst";
import {Outlying} from "./modules/outlying";
import {Normalizer} from "./modules/normalizer";
import {LeaderBinner} from "./modules/leaderbinner";
// import {Binner} from './modules/binner';
(function(window){
    /**
     * initialize a scagnostic object
     * @param inputPoints   {*[][]} set of points from the scatter plot
     * @returns {*[][]}
     */
    window.outliagnostics = function(inputPoints) {
        //Clone it to avoid modifying it.
        let points = inputPoints.slice(0);
        /******This section is about normalizing the data******/
        let normalizer = new Normalizer(points);
        let normalizedPoints = normalizer.normalizedPoints;
        outputValue("normalizer", normalizer);
        outputValue("normalizedPoints", normalizedPoints);
        /******This section is about finding number of bins and binners******/
        let binSize = null;
        let bins = [];
        let binner = null;
        let binRadius = 0;
        do{
            //Start with 40x40 bins, and divided by 2 every time there are more than 250 none empty cells
            binSize = (binSize===null)?40: binSize/2;
            //// This section uses hexagon binning
            // let shortDiagonal = 1/binSize;
            // binRadius = Math.sqrt(3)*shortDiagonal/2;
            // binner = new Binner().radius(binRadius).extent([[0, 0], [1, 1]]);//extent from [0, 0] to [1, 1] since we already normalized data.
            // bins = binner.hexbin(normalizedPoints);
            // This section uses leader binner
            binRadius = 1/(binSize*2);
            binner = new LeaderBinner(normalizedPoints, binRadius);
            bins = binner.leaders;
        }while(bins.length > 250);
        let sites = bins.map(d => [d.x, d.y]); //=>sites are the set of centers of all bins
        //Assigning output results
        outputValue("binner", binner);
        outputValue("bins", bins);
        outputValue("binSize", binSize);
        outputValue("binRadius", binRadius)
        outputValue("binnedSites", sites);

        /******This section is about the triangulating and triangulating results******/
        //Triangulation calculation
        let delaunay = Delaunator.from(sites);
        let triangles = delaunay.triangles;
        let triangleCoordinates = delaunay.triangleCoordinates();
        //Assigning output values
        outputValue("delaunay", delaunay);
        outputValue("triangles", triangles);
        outputValue("triangleCoordinates", triangleCoordinates);

        /******This section is about the spanning tree and spanning tree results******/
        //Spanning tree calculation
        let graph = createGraph(triangleCoordinates);
        let mstree = mst(graph);
        //Assigning the output values
        outputValue("graph", graph);
        outputValue("mst", mstree);

        /******This section is about the outlying score and outlying score results******/
        let outlying = new Outlying(mstree);
        let outlyingScore = outlying.score();
        let outlyingLinks = outlying.links();
        let outlyingPoints = outlying.points();
        let noOutlyingTree = outlying.removeOutlying();
        outputValue("outlyingScore", outlyingScore);
        outputValue("outlyingLinks", outlyingLinks);
        outputValue("outlyingPoints", outlyingPoints);
        outputValue("noOutlyingTree", noOutlyingTree);

        return window.outliagnostics;
        function outputValue(name, value){
            window.outliagnostics[name] = value;
        }
    };

})(window);
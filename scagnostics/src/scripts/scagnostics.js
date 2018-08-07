import {Binner} from './modules/binner';
import {Delaunator} from "./modules/delaunator";
import {createGraph} from "./modules/kruskal-mst";
import {mst} from "./modules/kruskal-mst";
import {Outlying} from "./modules/outlying";
import {Skewed} from "./modules/skewed";
import {Sparse} from "./modules/sparse";
import {Clumpy} from "./modules/clumpy";
import {Striated} from "./modules/striated";
import {Convex} from "./modules/convex";

(function(window){
    /**
     * initialize a scagnostic object
     * @param points
     * @param width
     * @param height
     * @param binningRadius
     * @returns {*[][]}
     */
    window.scagnostics = function(points, width, height, binningRadius) {
        /******This section is about the binner and binning results******/
        let binner = new Binner().radius(binningRadius).extent([[0, 0], [width, height]]);
        //Calculation
        let bins = binner.hexbin(points);
        let sites = bins.map(d => [d.x, d.y]); //=>sites are the set of centers of all bins
        //Assigning output results
        outputValue("binner", binner);
        outputValue("bins", bins);
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

        /******This section is about the skewed score and skewed score results******/
        let skewed = new Skewed(noOutlyingTree);
        outputValue("skewedScore", skewed.score());

        /******This section is about the sparse score and sparse score results******/
        let sparse = new Sparse(noOutlyingTree);
        outputValue("sparseScore", sparse.score());

        /******This section is about the clumpy score and clumpy score results******/
        let clumpy = new Clumpy(noOutlyingTree);
        outputValue("clumpyScore", clumpy.score());

        /******This section is about the striated score and striated score results******/
        let striated = new Striated(noOutlyingTree);
        let v2Corners = striated.getAllV2Corners();
        let obtuseV2Corners = striated.getAllObtuseV2Corners();
        outputValue("striatedScore", striated.score());
        outputValue("v2Corners", v2Corners);
        outputValue("obtuseV2Corners", obtuseV2Corners);

        /******This section is about the convex hull and convex hull results******/
        let convex = new Convex(noOutlyingTree);
        let convexHull = convex.convexHull();
        outputValue("convexHull", convexHull);

        /******This section is about the concave hull and concave hull results******/
        let concaveHull = convex.concaveHull();
        outputValue("concaveHull", concaveHull);

        /******This section is about the convex hull and convex hull results******/
        let convexScore = convex.score();
        outputValue("convexScore", convexScore);

        return window.scagnostics;
        function outputValue(name, value){
            window.scagnostics[name] = value;
        }
    };

})(window);
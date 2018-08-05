import {Binner} from './modules/binner';
import {Delaunator} from "./modules/delaunator";
import {createGraph} from "./modules/kruskal-mst";
import {mst} from "./modules/kruskal-mst";
import {ConcaveHull} from "./modules/concaveHull";
import {Outlying} from "./modules/outlying";

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
        let triangleCoordinates = [];
        for (let i = 0; i < triangles.length; i += 3) {
            triangleCoordinates.push([
                sites[triangles[i]],
                sites[triangles[i + 1]],
                sites[triangles[i + 2]]
            ]);
        }
        //Assigning output values
        outputValue("delaunay", delaunay);
        outputValue("triangles", triangles);
        window.scagnostics.triangleCoordinates = triangleCoordinates;

        /******This section is about the spanning tree and spanning tree results******/
        //Spanning tree calculation
        let graph = createGraph(triangleCoordinates);
        let mstree = mst(graph);
        //Assigning the output values
        outputValue("graph", graph);
        outputValue("mst", mstree);

        /******This section is about the convex hull tree and convex hull results******/
        //Calculating the hull (convex hull)
        let hull = delaunay.hull;
        let hulldata = [];
        let e = hull;
        do {
            hulldata.push([e.x, e.y]);
            e = e.next;
        } while (e != hull);
        //Assigning the output values
        outputValue("convexHull", hulldata);

        /******This section is about the concave hull tree and concave hull results******/
            //TODO: Need to change the fixed value as 100 here by an algorithm to calculate it
        let concaveHullResult = new ConcaveHull(100).concaveHull(triangleCoordinates);
        outputValue("concaveHull", concaveHullResult);

        /******This section is about the outlying score tree and outlying score results******/
        let outlying = new Outlying(mstree);
        let outlyingScore = outlying.score();
        let outlyingLinks = outlying.links();
        outlying.removeOutlying();
        outputValue("outlyingScore", outlyingScore);
        outputValue("outlyingLinks", outlyingLinks);


        return window.scagnostics;
        function outputValue(name, value){
            window.scagnostics[name] = value;
        }
    };

})(window);
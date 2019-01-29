import {Normalizer} from "./modules/normalizer";
// import {HexaBinner} from "./modules/hexagonBinner";
import {LeaderBinner} from "./modules/leaderBinner";
import {_} from 'underscore'
import {triangulate} from 'delaunay-triangulate'
import {createGraph, mst, equalPoints} from "./modules/kruskal-mst";

import {Outlying} from "./modules/outlying";
// import {Skewed} from "./modules/skewed";
// import {Sparse} from "./modules/sparse";
// import {Clumpy} from "./modules/clumpy";
// import {Striated} from "./modules/striated";
// import {Convex} from "./modules/convex";
// import {Skinny} from "./modules/skinny";
// import {Stringy} from "./modules/stringy";
// import {Monotonic} from "./modules/monotonic";

(function (window) {
    /**
     * initialize a scagnostics3d object
     * @param inputPoints   {*[][]} set of points from the scatter plot
     * @returns {*[][]}
     */
    window.scagnosticsnd = function (inputPoints, options={}) {
        let dims = inputPoints[0].length;
        //Clone it to avoid modifying it.
        let points = inputPoints.map(e=>e.slice());
        //Add one step to pass the data over if there is.
        for (let i = 0; i < points.length; i++) {
            points[i].data = inputPoints[i].data;
        }
        let normalizedPoints = points;

        if(options.isNormalized === undefined){
            let normalizer = new Normalizer(points);
            normalizedPoints = normalizer.normalizedPoints;
            outputValue("normalizedPoints", normalizedPoints);
            outputValue("normalizer", normalizer);
        }

        let binType = options.binType;
        /******This section is about the outlying score and outlying score results******/
        let outlyingUpperBound = options.outlyingUpperBound;
        let outlyingCoefficient = options.outlyingCoefficient;

        /******This section is about finding number of bins and binners******/
        let sites = null;
        let bins = null;
        let binner = null;
        let binSize = null;
        let binRadius = 0;
        let startBinGridSize = options.startBinGridSize;
        if(options.isBinned===undefined){//Only do the binning if needed.
            if(startBinGridSize===undefined){
                startBinGridSize = 40;
            }
            bins = [];
            //Default number of bins
            let minNumOfBins = 30;
            let maxNumOfBins = 200;
            let minBins = options.minBins;
            let maxBins = options.maxBins;
            if(minBins){
                minNumOfBins =minBins;
            }
            if(maxBins){
                maxNumOfBins = maxBins;
            }
            //Don't do the binning if the unique set of values are less than min number. Just return the unique set.
            let uniqueKeys = _.uniq(normalizedPoints.map(p=>p.join(',')));
            let groups = _.groupBy(normalizedPoints, p=>p.join(','));
            if(uniqueKeys.length<minNumOfBins){
                uniqueKeys.forEach(key=>{
                    let bin = groups[key];
                    //Take the coordinate of the first point in the group to be the bin leader (they should have the same points actually=> so just take the first one.
                    bin.site = bin[0].slice();
                    bins.push(bin);
                });
            }else{
                do{
                    //Start with binSize x binSize bins, and divided by 2 every time there are more than maxNumberofBins none empty cells, increase 5 (+5) if less than minNumberOfBins
                    if(binSize===null){
                        binSize = startBinGridSize;
                    }else if(bins.length>maxNumOfBins){
                        binSize = binSize/2;
                    }else if(bins.length<minNumOfBins){
                        binSize = 2*binSize;
                    }
                    if(binType==="hexagon"){
                        // // This section uses hexagon binning
                        // let shortDiagonal = 1/binSize;
                        // binRadius = Math.sqrt(3)*shortDiagonal/2;
                        // binner = new Binner().radius(binRadius).extent([[0, 0], [1, 1]]);//extent from [0, 0] to [1, 1] since we already normalized data.
                        // bins = binner.hexbin(normalizedPoints);
                    }else if(!binType || binType==="leader"){
                        // This section uses leader binner
                        binRadius = Math.sqrt(dims*Math.pow(1/(binSize*2), 2));
                        binner = new LeaderBinner(normalizedPoints, binRadius);
                        bins = binner.leaders;
                    }
                }while(bins.length > maxNumOfBins || bins.length < minNumOfBins);
            }
            sites = bins.map(d=>d.site); //=>sites are the set of centers of all bins
            /******This section is about the binning and binning results******/
            outputValue("binner", binner);
            outputValue("bins", bins);
            outputValue("binSize", binSize);
            outputValue("binRadius", binRadius)
        }else{
            sites = normalizedPoints;
        }

        outputValue("binnedSites", sites);

        // /******This section is about the triangulating and triangulating results******/
        // //Triangulation calculation
        // let delaunay = {};
        // //TODO: There are many places we need the triangleCoordinates function => we should build it as a prototype instead of copy/paste this function in many different places.
        // delaunay.points = sites;
        // let tetrahedra = triangulate(sites);
        //
        // delaunay.tetrahedra = tetrahedra;
        // delaunay.tetrahedraCoordinates = function(){
        //     let tetrahedra = this.tetrahedra;
        //     let tc = [];
        //     for (let i = 0; i < tetrahedra.length; i ++) {
        //         let t = tetrahedra[i];
        //         tc.push(t.map(tv=>this.points[tv]));
        //     }
        //     return tc;
        // }
        // let tetrahedraCoordinates = delaunay.tetrahedraCoordinates();
        // //Assigning output values
        // outputValue("delaunay", delaunay);
        // outputValue("tetrahedra", tetrahedra);
        // outputValue("tetrahedraCoordinates", tetrahedraCoordinates);

        /******This section is about the spanning tree and spanning tree results******/
        //Spanning tree calculation
        let tetrahedraCoordinates = [sites];
        let graph = createGraph(tetrahedraCoordinates);
        let mstree = mst(graph);
        //Assigning the output values
        outputValue("graph", graph);
        outputValue("mst", mstree);

        /******This section is about the outlying score and outlying score results******/
        let outlying = new Outlying(mstree, outlyingUpperBound,outlyingCoefficient);
        let outlyingScore = outlying.score();
        outlyingUpperBound = outlying.upperBound;
        let outlyingLinks = outlying.links();
        //Add outlying points from the bin to it.
        let outlyingPoints = [];
        outlying.points().forEach(p=>{
            bins.forEach(b=>{
                if(equalPoints(p, b.site)){
                    outlyingPoints = outlyingPoints.concat(b);
                }
            });

        });

        outputValue("outlyingScore", outlyingScore);
        outputValue("outlyingUpperBound", outlyingUpperBound);
        outputValue("outlyingLinks", outlyingLinks);
        outputValue("outlyingPoints", outlyingPoints);


        // /******This section is about the skewed score and skewed score results******/
        // let skewed = new Skewed(noOutlyingTree);
        // outputValue("skewedScore", skewed.score());
        //
        // /******This section is about the sparse score and sparse score results******/
        // let sparse = new Sparse(noOutlyingTree);
        // outputValue("sparseScore", sparse.score());
        //
        // /******This section is about the clumpy score and clumpy score results******/
        // let clumpy = new Clumpy(noOutlyingTree);
        // outputValue("clumpy", clumpy);
        // outputValue("clumpyScore", clumpy.score());
        //
        //
        // /******This section is about the striated score and striated score results******/
        // let striated = new Striated(noOutlyingTree);
        // outputValue("striatedScore", striated.score());
        //
        //
        // /******This section is about the convex hull and convex hull results******/
        // let convex = new Convex(noOutlyingTree, 1/outlying.upperBound);
        // let convexHull = convex.convexHull();
        // outputValue("convexHull", convexHull);
        //
        //
        // /******This section is about the concave hull and concave hull results******/
        // let concaveHull = convex.concaveHull();
        // outputValue("concaveHull", concaveHull);
        //
        //
        // /******This section is about the convex score and convex score results******/
        // let convexScore = convex.score();
        // outputValue("convexScore", convexScore);
        //
        //
        // /******This section is about the skinny score and skinny score results******/
        // let skinny = new Skinny(concaveHull);
        // let skinnyScore = skinny.score();
        // outputValue("skinnyScore", skinnyScore);
        //
        // /******This section is about the stringy score and stringy score results******/
        // let stringy = new Stringy(noOutlyingTree);
        // let v1s = stringy.getAllV1s();
        // let v2Corners = stringy.getAllV2Corners();
        // // let obtuseV2Corners = striated.getAllObtuseV2Corners();
        // let stringyScore = stringy.score();
        // outputValue("v1s", v1s);
        // outputValue("stringyScore", stringyScore);
        // outputValue("v2Corners", v2Corners);
        // // outputValue("obtuseV2Corners", obtuseV2Corners);
        //
        //
        // /******This section is about the monotonic score and monotonic score results******/
        // let monotonic = new Monotonic(noOutlyingTree.nodes.map(n=>n.id));
        // let monotonicScore = monotonic.score();
        // outputValue("monotonicScore", monotonicScore);

        return window.scagnosticsnd;
        function outputValue(name, value) {
            window.scagnosticsnd[name] = value;
        }
    };

})(window);
import {alphaShape} from "alpha-shape";
// import {quantile} from 'simple-statistics';
import {convexHull} from 'convex-hull'
export class Convex {
    constructor(tree, alpha) {
        this.tree = tree;
        this.alpha = alpha;
    }
    // /**
    //  * Returns convex score
    //  * @returns {number}
    //  */
    // score() {
    //     let concaveArea = concaveHullArea(this.concaveHull());
    //     return concaveArea/polygon.polygonArea(this.convexHull());
    //     function sortVerticies(points) {
    //         let center = findCentroid(points);
    //         points.sort((a, b) => {
    //             let a1 = (toDegrees(Math.atan2(a[0] - center[0], a[1] - center[1])) + 360) % 360;
    //             let a2 = (toDegrees(Math.atan2(b[0] - center[0], b[1] - center[1])) + 360) % 360;
    //             return Math.round(a1 - a2);
    //         });
    //         return points;
    //         function toDegrees (angle) {
    //             return angle * (180 / Math.PI);
    //         }
    //         function findCentroid(points) {
    //             let x = 0;
    //             let y = 0;
    //             points.forEach(p=>{
    //                 x += p[0];
    //                 y += p[1];
    //             });
    //             let center = [];
    //             center.push(x / points.length);
    //             center.push(y / points.length);
    //             return center;
    //         }
    //     }
    // }
    // noOutlyingTriangleCoordinates(){
    //
    //     return this.delaunay.triangleCoordinates();
    // }
    concaveHull() {
        //Clone the tree to avoid modifying it
        let tree = JSON.parse(JSON.stringify(this.tree));
        let sites =  tree.nodes.map(d => d.id);
        let cch = alphaShape(this.alpha, sites);
        let cchPoints = [];
        cch.forEach(t=>{
            cchPoints.push([sites[t[0]], sites[t[1]], sites[t[2]]]);
        });
        return cchPoints;
    }
    convexHull() {
        //Clone the tree to avoid modifying it
        let tree = JSON.parse(JSON.stringify(this.tree));
        let sites =  tree.nodes.map(d => d.id);

        let cvh = convexHull(sites);
        let cvhPoints = [];
        cvh.forEach(t=>{
           cvhPoints.push([sites[t[0]], sites[t[1]], sites[t[2]]]);
        });
        return cvhPoints;
    }
}

import {alphaShape} from "alpha-shape";
import {getPolyhedronVolume} from "./polyhedra";
import {convexHull} from 'convex-hull';

export class Convex {
    constructor(tree, alpha) {
        this.tree = tree;
        this.alpha = alpha;
    }

    /**
     * Returns convex score
     * @returns {number}
     */
    score() {
        let concaveVolume = Math.abs(getPolyhedronVolume(this.concaveHull()));
        let convexVolume = Math.abs(getPolyhedronVolume(this.convexHull()));
        return concaveVolume / convexVolume;
    }

    concaveHull() {
        //Clone the tree to avoid modifying it
        let tree = JSON.parse(JSON.stringify(this.tree));
        let sites = tree.nodes.map(d => d.id);
        let cch = alphaShape(this.alpha, sites);
        let cchPoints = [];
        cch.forEach(t => {
            cchPoints.push([sites[t[0]], sites[t[1]], sites[t[2]]]);
        });
        return cchPoints;
    }

    convexHull() {
        debugger
        //Clone the tree to avoid modifying it
        let tree = JSON.parse(JSON.stringify(this.tree));
        let sites = tree.nodes.map(d => d.id);

        let cvh = convexHull(sites);
        let cvhPoints = [];
        cvh.forEach(t => {
            cvhPoints.push([sites[t[0]], sites[t[1]], sites[t[2]]]);
        });
        return cvhPoints;
    }
}

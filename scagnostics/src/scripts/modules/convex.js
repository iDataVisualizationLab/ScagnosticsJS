import {Delaunator} from "./delaunator";
import {ConcaveHull} from "./concaveHull";
import {quantile} from 'simple-statistics';
import * as polygon from 'd3-polygon';
export class Convex {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
        this.delaunay = Delaunator.from(this.tree.nodes.map(d => d.id));
    }

    /**
     * Returns convex score
     * @returns {number}
     */
    score() {
        return polygon.polygonArea(this.concaveHull())/polygon.polygonArea(this.convexHull());
    }
    concaveHull() {
        //Use q90 as the cutoff distance.
        let allLengths = this.tree.links.map(l => l.weight),
            q90 = quantile(allLengths, 0.9),
            concaveHull = new ConcaveHull(q90).concaveHull(this.delaunay.triangleCoordinates());
        return concaveHull;
    }

    convexHull() {
        let hull = this.delaunay.hull;
        let convexHull = [];
        let e = hull;
        do {
            convexHull.push([e.x, e.y]);
            e = e.next;
        } while (e != hull);
        return convexHull;
    }
}

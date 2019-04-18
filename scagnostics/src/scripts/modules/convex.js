import {concaveHull, convexHull, concaveHullArea, convexHullArea} from "./hulls";

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
        let concaveArea = concaveHullArea(this.concaveHull());
        let convexArea = convexHullArea(this.convexHull());
        return concaveArea / convexArea;
    }

    concaveHull() {
        if(!this.cch){
            //Clone the tree to avoid modifying it
            let tree = JSON.parse(JSON.stringify(this.tree));
            let sites = tree.nodes.map(d => d.id);
            let cch = concaveHull(this.alpha, sites);
            while(cch.length == 0 && this.alpha > 10e-6){
                this.alpha = this.alpha/2;
                cch = concaveHull(this.alpha, sites);
            }
            this.cch = cch;
        }
        return this.cch;
    }

    convexHull() {
        if(!this.cvh){
            //Clone the tree to avoid modifying it
            let tree = JSON.parse(JSON.stringify(this.tree));
            let sites = tree.nodes.map(d => d.id);
            this.cvh = convexHull(sites);
        }
        return this.cvh;
    }
}

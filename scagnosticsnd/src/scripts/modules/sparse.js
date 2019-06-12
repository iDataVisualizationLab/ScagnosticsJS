import {quantile} from 'simple-statistics';

export class Sparse {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
    }

    /**
     * Returns sparse score
     * @returns {number}
     */
    score() {
        let allLengths = this.tree.links.map(l=>l.weight),
            q90 = quantile(allLengths, .9);
        let n = this.tree.links[0].source.length;
        return q90/Math.sqrt(Math.floor(2*n/3));
    }
}

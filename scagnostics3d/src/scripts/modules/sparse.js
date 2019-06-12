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
            q90 = quantile(allLengths, .9)/Math.sqrt(2);
        return q90;
    }
}

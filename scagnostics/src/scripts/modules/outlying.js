import _ from 'underscore';
import {quantile} from 'simple-statistics';

export class Outlying {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
    }

    /**
     * Returns outlying score
     * @returns {number}
     */
    score() {
        let tree = this.tree,
            totalLengths = 0,
            totalOutlyingLengths = 0,
            allLengths = tree.links.map(l => l.weight),
            q1 = quantile(allLengths, 0.25),
            q3 = quantile(allLengths, 0.75),
            iqr = q3 - q1;
        let upperBound = q3+1.5*iqr;
        tree.links.forEach(l => {
            totalLengths += l.weight;
            if (l.weight > upperBound) {
                totalOutlyingLengths += l.weight;
                l.isOutlying = true;
            }
        });
        return totalOutlyingLengths / totalLengths;
    }

    /**
     * Returns outlying links
     */
    links() {
        return this.tree.links.filter(l => l.isOutlying);
    }

    /**
     * Remove outlying links and nodes
     */
    removeOutlying() {
        var newTree = JSON.parse(JSON.stringify(this.tree));
        //Remove outlying links
        newTree.links = newTree.links.filter(l => !l.isOutlying);
        //Remove outlying nodes (nodes are not in any none-outlying links
        let allNodesWithLinks = [];
        newTree.links.forEach(l => {
            allNodesWithLinks.push(l.source);
            allNodesWithLinks.push(l.target);
        });
        allNodesWithLinks = _.uniq(allNodesWithLinks, false, d => d.join(','));
        newTree.nodes = allNodesWithLinks;
        return newTree;
    }
}

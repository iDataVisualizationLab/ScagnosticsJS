import _ from 'underscore';
import {quantile} from 'simple-statistics';
import {pointExists} from "./clumpy";
import {Delaunay} from "d3-delaunay";
import {createGraph, mst} from "./kruskal-mst";


export class Outlying {
    constructor(tree, upperBound) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
        this.upperBound = upperBound;
        //Mark the outlying links and add total length
        if (!upperBound) {
            let allLengths = tree.links.map(l => l.weight),
                q1 = quantile(allLengths, 0.25),
                q3 = quantile(allLengths, 0.75),
                iqr = q3 - q1;
            upperBound = q3+1.5*iqr;
            // upperBound = q3 + 3 * iqr;
            //Save it for displaying purpose.
            this.upperBound = upperBound;
        }
        this.tree.links.forEach(l => {
            if (l.weight > upperBound) {
                l.isOutlying = true;
            }
        });

    }

    /**
     * Returns outlying score
     * @returns {number}
     */
    score() {
        let totalLengths = 0;
        let totalOutlyingLengths = 0;
        //If it is outlying links it must be outlying (long) and also contains at least one outlying points.
        let outlyingPoints = this.points();
        this.tree.links.forEach(l => {
            totalLengths += l.weight;
            //If there are outlying points first.
            if(outlyingPoints.length>0){
                if(l.isOutlying){
                    //Also check if the link contains outlying points.
                    if(pointExists(outlyingPoints,l.source) ||pointExists(outlyingPoints,l.target)){
                        totalOutlyingLengths += l.weight;
                    }
                }
            }

        });
        return totalOutlyingLengths / totalLengths;
    }

    /**
     * Returns outlying links
     */
    links() {
        if (!this.outlyingLinks) {
            this.outlyingLinks = this.tree.links.filter(l => l.isOutlying);
        }
        return this.outlyingLinks;
    }

    /**
     * Remove outlying links and nodes and return a new tree without outlying points/edges
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
        newTree.nodes = allNodesWithLinks.map(n => {
            return {id: n};
        });

        return newTree;
    }

    /**
     * Returns the outlying points (in form of points, not node object).
     * @returns {Array}
     */
    points() {
        if (!this.outlyingPoints) {
            let newTree = this.removeOutlying();
            let newNodes = newTree.nodes;
            let oldNodes = this.tree.nodes;
            let ops = [];
            oldNodes.forEach(on => {
                //.id since we are accessing to points and the node is in form of {id: thePoint}
                if (!pointExists(newNodes.map(nn => nn.id), on.id)) {
                    ops.push(on.id);
                }
            });
            this.outlyingPoints = ops;
        }
        return this.outlyingPoints;
    }
}

import _ from 'underscore';
import {quantile} from 'simple-statistics';
import {pointExists} from "./clumpy";
import {createGraph, mst, getAllV2CornersFromTree, getAllV2OrGreaterFromTree} from "./kruskal-mst";
import {delaunayFromPoints} from "./delaunay";

export class Outlying {
    constructor(tree, upperBound) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
        this.upperBound = upperBound;
        //Calculate the upper bound if it is not provided.
        if (!upperBound) {
            let allLengths = tree.links.map(l => l.weight),
                q1 = quantile(allLengths, 0.25),
                q3 = quantile(allLengths, 0.75),
                iqr = q3 - q1;
            upperBound = q3 + 1.5 * iqr;
            // upperBound = q3 + 3 * iqr;
            //Save it for displaying purpose.
            this.upperBound = upperBound;
        }
        //Mark the outlying links
        this.tree.links.forEach(l => {
            if (l.weight > upperBound) {
                l.isOutlying = true;
            }
        });
        //Building the new tree
        let newTree = JSON.parse(JSON.stringify(this.tree));
        //Remove outlying links
        newTree.links = newTree.links.filter(l => !l.isOutlying);
        //Remove outlying nodes (nodes are not in any none-outlying links)
        let allNodesWithLinks = [];
        newTree.links.forEach(l => {
            allNodesWithLinks.push(l.source);
            allNodesWithLinks.push(l.target);
        });
        allNodesWithLinks = _.uniq(allNodesWithLinks, false, d => d.join(','));
        newTree.nodes = allNodesWithLinks.map(n => {
            return {id: n};
        });
        this.newTree = newTree;
        //Get the outlying points
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
            if (outlyingPoints.length > 0) {
                if (l.isOutlying) {
                    //Also check if the link contains outlying points.
                    if (pointExists(outlyingPoints, l.source) || pointExists(outlyingPoints, l.target)) {
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
        //If the outlying nodes has the degree of 2 or greater => it will break the tree into subtrees => so we need to rebuild the tree.
        //Take the outlying points
        let outlyingPoints = this.outlyingPoints.map(p=>p.join(','));
        let v2OrGreater = getAllV2OrGreaterFromTree(this.tree).map(p=>p.join(','));
        let diff = _.difference(outlyingPoints, v2OrGreater);
        if(diff.length<outlyingPoints.length){
            //Means there is outlying node(s) with degree 2 or higher (so we should rebuild the tree)
            let delaunay = delaunayFromPoints(this.newTree.nodes.map(n=>n.id));
            let graph = createGraph(delaunay.triangleCoordinates())
            this.newTree = mst(graph);
        }
        //TODO: Continue from here, need to put back the long edges which are not outlying links.
        return this.newTree;
    }

    /**
     * Returns the outlying points (in form of points, not node object).
     * @returns {Array}
     */
    points() {
        return this.outlyingPoints;
    }
}

import _ from 'underscore';
import {quantile} from 'simple-statistics';
import {triangulate} from 'delaunay-triangulate'
import {createGraph, mst, pointExists} from "./kruskal-mst";


export class Outlying {
    constructor(tree, upperBound) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
        this.upperBound = upperBound;
    }

    /**
     * Returns outlying score
     * @returns {number}
     */
    score() {
        let tree = this.tree,
            totalLengths = 0,
            totalOutlyingLengths = 0;
        let upperBound = this.upperBound;
        if(!upperBound){
            let allLengths = tree.links.map(l => l.weight),
                q1 = quantile(allLengths, 0.25),
                q3 = quantile(allLengths, 0.75),
                iqr = q3 - q1;
            // upperBound = q3+1.5*iqr;
            upperBound = q3+3*iqr;
            //Save it for displaying purpose.
            this.upperBound = upperBound;
        }
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
        //TODO: May need to reuse the existing result instead of calculating all again.
        //Triangulation calculation
        let delaunay = {};
        //TODO: There are many places we need the triangleCoordinates function => we should build it as a prototype instead of copy/paste this function in many different places.
        delaunay.points = allNodesWithLinks;
        let tetrahedra = triangulate(allNodesWithLinks);
        delaunay.tetrahedra = tetrahedra;
        delaunay.tetrahedraCoordinates = function(){
            let tetrahedra = this.tetrahedra;
            let tc = [];
            for (let i = 0; i < tetrahedra.length; i ++) {
                let t = tetrahedra[i];
                tc.push([
                    this.points[t[0]],
                    this.points[t[1]],
                    this.points[t[2]],
                    this.points[t[3]]
                ]);
            }
            return tc;
        }
        //Triangulate again
        let graph = createGraph(delaunay.tetrahedraCoordinates());
        newTree = mst(graph);
        return newTree;
    }

    /**
     * Returns the outlying points (in form of points, not node object).
     * @returns {Array}
     */
    points(){
        let newTree = this.removeOutlying();
        let newNodes = newTree.nodes;
        let oldNodes = this.tree.nodes;
        let ops = [];
        oldNodes.forEach(n=>{
            //.id since we are accessing to points and the node is in form of {id: thePoint}
            if(!pointExists(newNodes.map(n=>n.id), n.id)){
                ops.push(n.id);
            }
        });
        return ops;
    }
}

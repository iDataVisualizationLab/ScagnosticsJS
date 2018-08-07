import {max} from 'simple-statistics';
import {equalPoints} from "./kruskal-mst";

export class Clumpy {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
    }

    /**
     * Returns clumpy score
     * @returns {number}
     */
    score() {
        let self = this;
        return max(this.tree.links.map(link=>1-maxLength(runtGraph(link))/link.weight));
        function runtGraph(link){
            let greaterLinks = self.tree.links.filter(l=>l.weight >= link.weight);
            let sourceConnectedNodes = [link.source];
            let sourceConnectedLinks = [];
            let targetConnectedNodes = [link.target];
            let targetConnectedLinks = [];
            greaterLinks.forEach(link=>{
                //Either source or target in the sourceConnectedNodes then it is connected
                if(pointExists(sourceConnectedNodes, link.source)){
                    sourceConnectedNodes.push(link.target);
                    sourceConnectedLinks.push(link);
                }else if(pointExists(sourceConnectedNodes, link.target)){
                    sourceConnectedNodes.push(link.source);
                    sourceConnectedLinks.push(link);
                }

                if(pointExists(targetConnectedNodes, link.source)){
                    targetConnectedNodes.push(link.target);
                    targetConnectedLinks.push(link);
                }else if(pointExists(targetConnectedNodes, link.target)){
                    targetConnectedNodes.push(link.source);
                    targetConnectedLinks.push(link);
                }
            });
            return sourceConnectedLinks.length < targetConnectedLinks.length?sourceConnectedLinks:targetConnectedLinks;
        }
        function maxLength(runtGraph){
            return max(runtGraph.map(l=>l.weight));
        }
    }
}
export function pointExists(points, point){
    for (let i = 0; i < points.length; i++) {
        let point1 = points[i];
        if (equalPoints(point1, point)) {
            return true;
        }
    }
    return false;
}
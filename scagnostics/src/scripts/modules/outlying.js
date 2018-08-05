import statistics from "./statistics";
import _ from 'underscore';
export class Outlying{
    constructor(tree){
        this.tree = tree;
    }

    /**
     * Returns outlying score
     * @returns {number}
     */
    score(){
        let tree = this.tree;
        let totalLengths = 0;
        let totalOutlyingLengths = 0;
        let upperBound = statistics.normalBound(tree.links.map(l=>l.weight))[1];
        tree.links.forEach(l=>{
            totalLengths += l.weight;
            if(l.weight>upperBound){
                totalOutlyingLengths += l.weight;
                l.isOutlying = true;
            }
        });
        return totalOutlyingLengths/totalLengths;
    }

    /**
     * Returns outlying links
     */
    links(){
        return this.tree.links.filter(l=>l.isOutlying);
    }

    /**
     * Remove outlying links and nodes
     */
    removeOutlying(){
        // //Remove the links.
        // this.links().forEach(outlyingLink =>{
        //     this.tree.links.splice(this.tree.links.indexOf(outlyingLink), 1);
        // });
        console.log(_.filter);
    }
}

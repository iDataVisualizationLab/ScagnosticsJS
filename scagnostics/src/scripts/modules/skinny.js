import * as polygon from 'd3-polygon';
export class Skinny {
    constructor(alphaHull) {
        //Clone it in order to avoid modifying it.
        this.alphaHull = alphaHull.slice(0);
    }
    /**
     * Returns skinny score
     * @returns {number}
     */
    score() {
        return 1 - Math.sqrt(4*Math.PI*polygon.polygonArea(this.alphaHull))/polygon.polygonLength(this.alphaHull);
    }
}

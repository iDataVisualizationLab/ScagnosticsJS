import {getPolyhedronArea, getPolyhedronVolume} from "./polyhedra";

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
        let area = getPolyhedronArea(this.alphaHull);
        let volume = Math.abs(getPolyhedronVolume(this.alphaHull));
        return 1 - Math.pow(6*Math.sqrt(Math.PI)*volume, 1/3)/Math.sqrt(area);
    }
}

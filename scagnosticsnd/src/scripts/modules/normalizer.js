import _ from 'underscore';

export class Normalizer {
    constructor(points) {
        this.points = points.map(e=>e.slice());
        //pass the data over
        this.points.forEach((p, i)=>{
            p.data = points[i].data;
        });
        let nds = this.nds = _.unzip(this.points);
        let maxD = this.maxD = [];
        let minD = this.minD = [];
        let rangeD = this.rangeD = [];
        let normalizedD = this.normalizedD = [];
        nds.forEach((d, i)=>{
            maxD[i] = _.max(d);
            minD[i] = _.min(d);
            rangeD[i] = (maxD[i] != minD[i]) ? maxD[i] - minD[i] : 1;
            normalizedD[i] = d.map(e=>(e-minD[i])/rangeD[i]);
        });
        let length = this.points.length;
        this.normalizedPoints = [];
        for (let i = 0; i < length; i++) {
            this.normalizedPoints[i] = [];
            for (let j = 0; j < this.nds.length; j++) {
                this.normalizedPoints[i][j] = normalizedD[j][i];
            }
        }
        //Add one step to pass the data over if there is.
        for (let i = 0; i < length; i++) {
            this.normalizedPoints[i].data = this.points[i].data;
        }
    }

    /**
     * Input a set of points in this scale range [0, 1] and will be scaled back to
     * - Original scale ([minX, maxX], [minY, maxY], [minZ, maxZ])
     * @param points
     */
    scaleBackPoints(points) {
        return points.map(point => {
            return this.scaleBackPoint(point);
        });
    }

    /**
     * Input a single point in this scale range [0, 1] and will be scaled back to
     * - Original scale ([minX, maxX], [minY, maxY], [minZ, maxZ])
     * @param points
     */
    scaleBackPoint(point) {
        let newPoint = point.map((vs, i)=>{
            let v = this.rangeD[i]*vs + this.minD[i];
            return v;
        });
        return newPoint;
    }
}

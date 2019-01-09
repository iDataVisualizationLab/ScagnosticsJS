import _ from 'underscore';

export class Normalizer {
    constructor(points) {
        this.points = points.slice(0);
        let [xArr, yArr, zArr] = [this.xArr, this.yArr, this.zArr] = _.unzip(this.points),
            maxX = this.maxX = _.max(xArr),
            minX = this.minX = _.min(xArr),
            maxY = this.maxY = _.max(yArr),
            minY = this.minY = _.min(yArr),
            maxZ = this.maxZ = _.max(zArr),
            minZ = this.minZ = _.min(zArr),
            rangeX = this.rangeX = (maxX != minX) ? maxX - minX : 1,
            rangeY = this.rangeY = (maxY != minY) ? maxY - minY : 1,
            rangeZ = this.rangeZ = (maxZ != minZ) ? maxZ - minZ : 1,
            normalizedXArr = this.normalizedXArr = xArr.map(x => (x - minX) / rangeX),
            normalizedYArr = this.normalizedYArr = yArr.map(y => (y - minY) / rangeY),
            normalizedZArr = this.normalizedZArr = zArr.map(z => (z - minZ) / rangeZ);
        this.normalizedPoints = _.zip(normalizedXArr, normalizedYArr, normalizedZArr);
        //Add one step to pass the data over if there is.
        let length = this.points.length;
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
        let xs = point[0],
            x = this.rangeX * xs + this.minX,
            ys = point[1],
            y = this.rangeY * ys + this.minY,
            zs = point[2],
            z = this.rangeZ * zs + this.minZ;
        return [x, y, z];
    }
}

import _ from 'underscore';

export class Normalizer {
    constructor(points) {
        this.points = points.slice(0);
        let [xArr, yArr] = [this.xArr, this.yArr] = _.unzip(this.points),
            maxX = this.maxX = _.max(xArr),
            minX = this.minX = _.min(xArr),
            maxY = this.maxY = _.max(yArr),
            minY = this.minY = _.min(yArr),
            rangeX = this.rangeX = maxX - minX,
            rangeY = this.rangeY = maxY - minY,
            normalizedXArr = this.normalizedXArr = xArr.map(x => (x - minX) / rangeX),
            normalizedYArr = this.normalizedYArr = yArr.map(y => (y - minY) / rangeY);
        this.normalizedPoints = _.zip(normalizedXArr, normalizedYArr);
    }

    /**
     * Input a set of points in this scale range [0, 1] and will be scaled back to
     * - Original scale ([minX, maxX], [minY, maxY])
     * @param points
     */
    scaleBackPoints(points) {
        return points.map(point=>{
            return this.scaleBackPoint(point);
        });
    }
    /**
     * Input a single point in this scale range [0, 1] and will be scaled back to
     * - Original scale ([minX, maxX], [minY, maxY])
     * @param points
     */
    scaleBackPoint(point) {
        let xs = point[0],
            x = this.rangeX * xs + this.minX,
            ys = point[1],
            y = this.rangeY * ys + this.minY;
        return [x, y];
    }
}

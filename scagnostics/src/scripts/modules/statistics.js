const statistics = {
    firstQuartile: function (values) {
        let theValues, q1;
        theValues = values.slice(0).sort((a, b) => a - b);
        if ((theValues.length / 4) % 1 === 0) {//find quartiles
            q1 = 1 / 2 * (theValues[(theValues.length / 4)] + theValues[(theValues.length / 4) + 1]);
        } else {
            q1 = theValues[Math.floor(theValues.length / 4 + 1)];
        }
        return q1;
    },
    thirdQuartile: function (values) {
        let theValues, q3;
        theValues = values.slice(0).sort((a, b) => a - b);
        if ((theValues.length / 4) % 1 === 0) {//find quartiles
            q3 = 1 / 2 * (theValues[(theValues.length * (3 / 4))] + theValues[(theValues.length * (3 / 4)) + 1]);
        } else {
            q3 = theValues[Math.ceil(theValues.length * (3 / 4) + 1)];
        }
        return q3;
    },
    normalBound: function (values) {
        let q1 = this.firstQuartile(values),
            q3 = this.thirdQuartile(values),
            iqr = q3 - q1,
            maxValue = q3 + iqr * 1.5,
            minValue = q1 - iqr * 1.5;

        return [minValue, maxValue];
    }
}
export default statistics;
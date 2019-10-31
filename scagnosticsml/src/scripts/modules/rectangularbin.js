export function RectangularBinner(points, options={gridNumber: 40}) {
    let gridNumber = options.gridNumber;
    let gridSize = 1.0/gridNumber;
    let bins = [];
    for (let i = 0; i < gridNumber; i++) {
        for (let j = 0; j < gridNumber; j++) {
            bins[i, j] = 0; // Initialize.
        }
    }
    let n = points.length;
    for (let pi = 0; pi < n; pi++) {
        let point = points[pi];
        let x = point[0];
        let y = point[1];
        let j = Math.floor(x/gridSize);
        let i = Math.floor((1-y)/gridSize);
        bins[i][j] = 1;
    }
    return bins;
}
/***********OUTLYING DATA*******************/
function outlyingScatterPlot() {
    let randomX = d3.randomNormal(contentWidth / 30, 20),
        randomY = d3.randomNormal(contentHeight / 30, 20),
        randomZ = d3.randomNormal(contentHeight / 30, 20),
        points = d3.range(100).map(function () {
            return [randomX(), randomY(), randomZ()];
        });
    //Push 3 more outlying points.
    points.push([contentWidth / 2 + 5 * 50, contentHeight / 2 + 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 - 5 * 50, contentHeight / 2 + 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 + 5 * 50, contentHeight / 2 - 5 * 50, contentHeight / 2 + 5 * 50]);
    points.push([contentWidth / 2 + 3 * 50, contentHeight / 2 + 3 * 50, contentHeight / 2 + 3 * 50]);
    return points;
}

/***********SKEWED DATA*******************/

function skewedScatterPlot() {
    let points = [];
    for (let i = 0; i < svgWidth; i = i + svgWidth / 3) {
        for (let j = 0; j < svgHeight; j = j + svgHeight / 3) {
            for (let k = 0; k < svgHeight; k = k + svgHeight / 3) {
                const randomX = d3.randomNormal(i, svgWidth / 60),
                    randomY = d3.randomNormal(j, svgHeight / 60),
                    randomZ = d3.randomNormal(k, svgHeight / 60);
                d3.range(10).forEach(d => {
                    points.push([randomX(), randomY(), randomZ()]);
                });
            }
        }
    }
    return points;
}





/***********SPARSE DATA*******************/
function sparseScatterPlot() {
    // let cornerPoints = [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1], [0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]];
    // let points = [];
    // cornerPoints.forEach(p => {
    //     //Top left points
    //     let randomX = d3.randomNormal(p[0] * svgWidth / 4, 5),
    //         randomY = d3.randomNormal(p[1] * svgHeight / 4, 5),
    //         randomZ = d3.randomNormal(p[2] * svgHeight / 4, 5);
    //     d3.range(20).map(function () {
    //         points.push([randomX(), randomY(), randomZ()]);
    //     });
    // });
    // datasets.push(points);

    let cornerPoints = [[0, 1, 0], [0, 0, 1], [1, 0, 0], [1, 1, 1]];
    let points = [];
    cornerPoints.forEach(p => {
        //Top left points
        let randomX = d3.randomNormal(p[0] * svgWidth / 4, 2),
            randomY = d3.randomNormal(p[1] * svgHeight / 4, 2),
            randomZ = d3.randomNormal(p[2] * svgHeight / 4, 2);
        // let randomX = d3.randomNormal(p[0] * svgWidth / 4, 5),
        //     randomY = d3.randomNormal(p[1] * svgHeight / 4, 5),
        //     randomZ = d3.randomNormal(p[2] * svgHeight / 4, 5);
        d3.range(7).map(function () {
            points.push([randomX(), randomY(), randomZ()]);
        });
    });
    return points;
}

/***********CLUMPY DATA*******************/
function clumpyScatterPlot() {
    let randomX = muy => d3.randomNormal(muy, 7),
        randomY = muy => d3.randomNormal(muy, 7),
        randomZ = muy => d3.randomNormal(muy, 7),
        cluster1 = d3.range(200).map(function () {
            return [randomX(contentHeight / 3)() + 10 * random(), randomY(contentHeight / 3)() + 10 * random(), randomZ(contentHeight / 3)() + 10 * random()];
        }),
        cluster2 = d3.range(50).map(function () {
            return [randomX(2 * contentHeight / 3)(), randomY(2 * contentHeight / 3)(), randomZ(2 * contentHeight / 3)()];
        }),
        cluster3 = d3.range(50).map(function () {
            return [randomX(2 * contentHeight / 3)(), randomY(2 * contentHeight / 3)(), randomZ(contentHeight / 3)()];
        }),
        points = cluster1.concat(cluster2).concat(cluster3);
    return points;
}

/***********STRIATED DATA*******************/
function striatedScatterPlot() {
    let x1 = (y1, z1) => 2 * y1 + 3 * z1 - 5;
    let x2 = (y2, z2) => 2 * y2 + 3 * z2 + 5;
    let noise = d3.randomUniform(-0.001, 0.001);
    // let noise = ()=>0;
    let plane1 = d3.range(200).map(() => {
        let yr = d3.randomUniform(0, 1);
        let zr = d3.randomUniform(0, 1);
        let y = yr();
        let z = zr();
        let x = x1(y, z);
        return [x, y, z];
    });
    let plane2 = d3.range(200).map(() => {
        let yr = d3.randomUniform(0, 1);
        let zr = d3.randomUniform(0, 1);
        let y = yr();
        let z = zr();
        let x = x2(y, z);
        return [x + noise(), y + noise(), z + noise()];
    });
    let points = plane1.concat(plane2);
    return points;

    // //THE FOLLOWING IS FOR THE PAPER'S GRAPHIC ONLY
    // let x1 = t=>1+t, y1 = t=>3-1.3*t, z1 = t=>1-t;
    // let x2 = t=>-100-t, y2 = t=>-100+1.3*t, z2 = t=>-10+t;
    // let x3 = t=>-50-t, y3 = t=>-50+1.3*t, z3 = t=>-5+t;
    // let x4 = t=>30+t, y4 = t=>30-1.3*t, z4 = t=>5-t;
    // let noise = d3.randomUniform(-2, 2);
    // let line1 = d3.range(50).map(()=>{
    //     let t = d3.randomUniform(10, 50)();
    //     return [x1(t), y1(t)+noise(), z1(t)];
    // });
    // let line2 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x2(s), y2(s)+noise(), z2(s)];
    // });
    // let line3 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x3(s), y3(s)+noise(), z3(s)];
    // });
    //
    // let line4 = d3.range(50).map(()=>{
    //     let s = d3.randomUniform(10, 50)();
    //     return [x4(s), y4(s)+noise(), z4(s)];
    // });
    //
    // let points = line1.concat(line2).concat(line3).concat(line4);
    // return points;
}


/***********CONVEX DATA*******************/

function convexScatterPlot() {
    let randomX = d3.randomNormal(svgWidth / 2, 50),
        randomY = d3.randomNormal(svgHeight / 2, 50),
        randomZ = d3.randomNormal(svgHeight / 2, 50),
        points = d3.range(2000).map(function () {
            return [randomX(), randomY(), randomZ()];
        });
    return points;
}

/***********SKINNY DATA*******************/

function skinnyScatterPlot() {
    let points = [];
    let deg_to_rad = Math.PI / 180.0;
    let depth = 4;
    let branchAngle = 45;
    generateTree(300, 300, -90, depth);
    generateTree(300, 300, 0, depth);
    generateTree(300, 300, 90, depth);
    generateTree(300, 300, 180, depth);

    function generateTree(x1, y1, angle, depth) {
        if (depth !== 0) {
            let x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 10.0);
            let y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 10.0);
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 165));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 255));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 345));
            points = points.concat(generatePointsOnLine(x1, y1, x2, y2, 10, 435));
            generateTree(x2, y2, angle - branchAngle, depth - 1);
            generateTree(x2, y2, angle + branchAngle, depth - 1);
        }
    }


    function generatePointsOnLine(x1, y1, x2, y2, nPoints, zPlace) {
        let random = () => Math.random();
        let pointsOL = [];
        if (x1 === x2) {
            let deltaY = (y2 - y1) / nPoints;
            for (let i = 0; i < nPoints; i++) {
                let x = x1;
                let y = y1 + i * deltaY;
                pointsOL.push([x + random(), y + random(), zPlace + random()]);
            }
        } else {
            let a = (y2 - y1) / (x2 - x1);
            let b = -a * x1 + y1;
            let deltaX = (x2 - x1) / nPoints;
            for (let i = 0; i < nPoints; i++) {
                let x = x1 + i * deltaX;
                let y = a * x + b;
                pointsOL.push([x + random(), y + random(), zPlace + random()]);
            }
        }
        return pointsOL;
    }

    // for (let i = 0; i < 50; i++) {
    //     points.push([300 + random(), 300 + random(), i * (600 / 50) + random()])
    // }

    return points;

}

/***********STRINGY DATA*******************/

function stringyScatterPlot() {
    let noise = () => Math.random() / 12;
    let points = [];
    for (let x = 0; x < 150; x++) {
        points.push([x + noise(), Math.sin(x * Math.PI / 30) + noise(), Math.cos(x * Math.PI / 30) + noise()])
    }
    return points;
    // let noise = () => Math.random() / 50;
    // let points = [];
    // for (let x = 0; x < 150; x++) {
    //     points.push([x + noise(), Math.sin(x * Math.PI / 30) + noise(), Math.cos(x * Math.PI / 30) + noise()])
    // }
    // ;
    // return points;
}

/***********Monotonic Data*******************/
function monotonicScatterPlot() {
    let noise = d3.randomUniform(-5, 5);
    let points = d3.range(150).map((x) => {
        return [x + noise(), 150 - x + noise(), x + noise()];
    });
    return points;
}
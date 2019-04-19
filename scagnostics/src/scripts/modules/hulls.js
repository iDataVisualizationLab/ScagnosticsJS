import alphaShape from 'alpha-shape';
import * as polygon from 'd3-polygon';

export function concaveHull(alpha, sites) {
    const cells = alphaShape(alpha, sites);
    let hulls = [];
    processCells(cells, hulls);
    hulls = hulls.map(h => {
        //Get vertices
        let vertices = Array.from(h).map(item => {
            return sites[item];
        });
        return sortVerticies(vertices);
    });
    return hulls;
}

export function concaveHullArea(hulls) {
    let total = 0;
    hulls.forEach(h => {
        total += polygon.polygonArea(h);
    });
    return total;
}

export function concaveHullLength(hulls) {
    let total = 0;
    hulls.forEach(h => {
        total += polygon.polygonLength(h);
    });
    return total;
}

export function convexHull(sites) {
    const cells = alphaShape(0, sites);
    let h = Array.from(new Set(cells.flat()));
    //Get vertices
    let vertices = Array.from(h).map(item => {
        return sites[item];
    });
    return sortVerticies(vertices);
}

export function convexHullArea(hull) {
    return polygon.polygonArea(hull);
}

//<editor-fold desc="Util to convert cells to hulls">
function putCellToHulls(cell, hulls) {
    for (let i = 0; i < hulls.length; i++) {
        let hull = hulls[i];
        if (hull.has(cell[0])) {
            hull.add(cell[1]);
            return true;
        } else if (hull.has(cell[1])) {
            hull.add(cell[0]);
            return true;
        }
    }
    return false;
}

function processCells(cells, hulls) {
    if (cells.length === 0) {
        return;
    }
    //If loop through all cells but can't put into any hull then need to create new hull
    let processedIndice = [];
    cells.forEach((cell, i) => {
        if (putCellToHulls(cell, hulls)) {
            processedIndice.push(i);
        }
    });
    //If loop through all of them but none got put into the cells => we need to take first one from cells to create a new hull.
    if (processedIndice.length == 0) {
        //Put first one in the hull
        let cell = cells.shift();
        const hull = new Set(cell);
        hulls.push(hull);
    } else {
        //Remove the processed items and continue.
        cells = cells.filter((v, i)=>processedIndice.indexOf(i)<0);
    }
    //Do this recursively
    processCells(cells, hulls);
}

function sortVerticies(points) {
    let center = findCentroid(points);
    points.sort((a, b) => {
        let a1 = (toDegrees(Math.atan2(a[0] - center[0], a[1] - center[1])) + 360) % 360;
        let a2 = (toDegrees(Math.atan2(b[0] - center[0], b[1] - center[1])) + 360) % 360;
        return Math.round(a1 - a2);
    });
    return points;

    function toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    function findCentroid(points) {
        let x = 0;
        let y = 0;
        points.forEach(p => {
            x += p[0];
            y += p[1];
        });
        let center = [];
        center.push(x / points.length);
        center.push(y / points.length);
        return center;
    }
}

//</editor-fold>
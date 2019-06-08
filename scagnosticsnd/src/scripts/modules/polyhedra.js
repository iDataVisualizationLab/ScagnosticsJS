//Implemented basing on the algorithm from here: http://wwwf.imperial.ac.uk/~rn/centroid.pdf
export function getPolyhedronVolume(faces) {
    let n = faces.length;
    let sum = 0.0;
    for (let i = 0; i < n; i++) {
        let triangle = faces[i];
        let ai = triangle[0];
        let nHati = normalVector(triangle);
        sum += dotProduct(ai, nHati);
    }
    return sum/6.0;
}
function getTriangleArea(triangle){
    return magnitude(normalVector(triangle))/2;
}
export function getPolyhedronArea(triangles){
    let result =0;
    for (let i = 0; i < triangles.length; i++) {
        result += getTriangleArea(triangles[i]);
    }
    return result;
}
export function dotProduct(p1, p2) {
    let length = p1.length;
    let result = 0;
    for (let i = 0; i < length; i++) {
        result += p1[i] * p2[i];
    }
    return result;
}

function crossProduct(p1, p2) {
    let result = [];
    result[0] = p1[1] * p2[2] - p2[1] * p1[2];
    result[1] = p1[2] * p2[0] - p2[2] * p1[0];
    result[2] = p1[0] * p2[1] - p2[0] * p1[1]
    return result;
}

function substract(v1, v2) {
    let length = v1.length;
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(v1[i] - v2[i]);
    }
    return result;
}

export function normalVector(triangle) {
    let a = triangle[0];
    let b = triangle[1];
    let c = triangle[2];
    let ab = substract(b, a);
    let ac = substract(c, a);
    let nHati = crossProduct(ab, ac);
    return nHati;
}

export function magnitude(vector){
    let result = 0;
    for (let i = 0; i <vector.length; i++) {
        result += vector[i]*vector[i];
    }
    return Math.sqrt(result);
}
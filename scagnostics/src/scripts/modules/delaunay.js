import {isA2DLine} from "./line";
import {Delaunay} from "d3-delaunay";

export function delaunayFromPoints(sites) {
    let delaunay = {};
    //If it is a straight line => simulate as triangles of three consecutive points (with connection of a common points between two consecutive triangles)
    if (isA2DLine(sites)) {
        let tgs = [];
        let siteLength = sites.length;
        for (let i = 0; i < siteLength; i = i + 2) {
            if (i + 1 < siteLength) {
                tgs.push(i);
                tgs.push(i + 1);
            }
            if (i + 2 < siteLength) {
                tgs.push(i + 2);
            } else if (siteLength % 2 == 0) {
                tgs.push(i - 1);//If it is odd => we add back one point. to make them divisible by 3 (as triangles).
            }
        }
        delaunay.triangles = tgs;
    } else {
        delaunay = Delaunay.from(sites);
    }
    return delaunay;
}
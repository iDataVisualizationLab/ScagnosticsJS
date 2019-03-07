import {Delaunay} from "d3-delaunay";
import {ConcaveHull, concaveHullArea} from "./concaveHull";
import {quantile} from 'simple-statistics';
import * as polygon from 'd3-polygon';

export class Convex {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
        let sites = this.tree.nodes.map(d => d.id);
        this.delaunay = Delaunay.from(sites);
        this.delaunay.points = sites;
        this.delaunay.triangleCoordinates = function(){
            let triangles = this.triangles;
            let tc = [];
            for (let i = 0; i < triangles.length; i += 3) {
                tc.push([
                    this.points[triangles[i]],
                    this.points[triangles[i + 1]],
                    this.points[triangles[i + 2]]
                ]);
            }
            return tc;
        }
    }
    /**
     * Returns convex score
     * @returns {number}
     */
    score() {
        let concaveArea = concaveHullArea(this.concaveHull());
        return concaveArea/polygon.polygonArea(this.convexHull());
        function sortVerticies(points) {
            let center = findCentroid(points);
            points.sort((a, b) => {
                let a1 = (toDegrees(Math.atan2(a[0] - center[0], a[1] - center[1])) + 360) % 360;
                let a2 = (toDegrees(Math.atan2(b[0] - center[0], b[1] - center[1])) + 360) % 360;
                return Math.round(a1 - a2);
            });
            return points;
            function toDegrees (angle) {
                return angle * (180 / Math.PI);
            }
            function findCentroid(points) {
                let x = 0;
                let y = 0;
                points.forEach(p=>{
                    x += p[0];
                    y += p[1];
                });
                let center = [];
                center.push(x / points.length);
                center.push(y / points.length);
                return center;
            }
        }
    }
    noOutlyingTriangleCoordinates(){

        return this.delaunay.triangleCoordinates();
    }
    concaveHull() {
        //Use quantile as cutoff values.
        let allLengths = this.tree.links.map(l => l.weight),
            concaveHull = new ConcaveHull(quantile(allLengths, 0.9999)).concaveHull(this.noOutlyingTriangleCoordinates());
            // concaveHull = new ConcaveHull().coveringConcaveHull(this.noOutlyingTriangleCoordinates());
        return concaveHull;
    }
    convexHull() {
        let hull = this.delaunay.hull;
        let convexHull = [];
        let e = hull;
        do {
            convexHull.push([e.x, e.y]);
            e = e.next;
        } while (e != hull);
        return convexHull;
    }
}

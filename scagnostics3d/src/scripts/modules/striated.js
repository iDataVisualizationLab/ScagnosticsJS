import {pairNodeLinks} from "./kruskal-mst";
import {normalVector, magnitude, dotProduct} from "./polyhedra";

export class Striated {
    constructor(tree) {
        //Clone the tree to avoid modifying it
        this.tree = JSON.parse(JSON.stringify(tree));
    }

    /**
     * Returns striated score
     * @returns {number}
     */
    score() {
        //Loop through the nodes.
        let cornerCount = 0;
        let obtuseCornerCount = 0;
        let links = this.tree.links;
        let pln = this.pairLinkNodes();
        links.forEach(l => {
            let connectedToSourceNodes = pln[l.id][0];
            let connectedToTargetNodes = pln[l.id][1];
            connectedToSourceNodes.forEach(ctsn => {
                connectedToTargetNodes.forEach(cttn => {
                    let triangle1 = [ctsn, l.source, l.target];
                    let triangle2 = [l.source, l.target, cttn];
                    let cos = cosine(triangle1, triangle2);
                    //As long as the cosine is > 0.75 or <-0.75 then they are close to a plane
                    cornerCount += 1;
                    if (Math.abs(cos) > 0.75) {
                        obtuseCornerCount += 1;
                    }
                });
            });
        });
        return obtuseCornerCount / cornerCount;

        function cosine(triangle1, triangle2) {
            let n1 = normalVector(triangle1);
            let n2 = normalVector(triangle2);
            return dotProduct(n1, n2) / (magnitude(n1) * magnitude(n2));
        }
    }

    pairLinkNodes() {
        let links = this.tree.links;
        //give an id for every link.
        links.forEach((l, i) => {
            if (l.id === undefined) {
                l.id = 'link' + i;
            }
        });
        let nestedByNodesArr = pairNodeLinks(links);
        //Convert it to object for faster access
        let nestedByNodes = {};
        nestedByNodesArr.forEach(e => {
            nestedByNodes[e[0]] = e[1];
        });
        let nestedByLinks = {};

        links.forEach(l => {
            if (nestedByLinks[l.id] === undefined) {
                nestedByLinks[l.id] = [];
            }
            let sourceId = l.source.join(',');
            let targetId = l.target.join(',');
            //Add all links connected to the source (just need to add the points)
            let linksConnectedToSource = nestedByNodes[sourceId];
            //Push the points of the connected links (which is not on this edge)
            let pointsConnectedToSource = [];

            linksConnectedToSource.forEach(cl => {//the link conneced to the source
                //The adding node must not on the currently checking link
                if (cl.id !== l.id) {
                    if (cl.source.join(',') !== sourceId) {
                        pointsConnectedToSource.push(cl.source);
                    } else {
                        pointsConnectedToSource.push(cl.target);
                    }
                }
            });
            //Add all links connected to the target (just need to add the points)
            let linksConnectedToTarget = nestedByNodes[targetId];
            //Push the points of the connected links (which is not on this edge)
            let pointsConnectedToTarget = [];
            linksConnectedToTarget.forEach(cl => {
                if (l.id !== cl.id) {
                    if (cl.source.join(',') !== targetId) {
                        pointsConnectedToTarget.push(cl.source);
                    } else {
                        pointsConnectedToTarget.push(cl.target);
                    }
                }
            });
            nestedByLinks[l.id] = [pointsConnectedToSource, pointsConnectedToTarget];
        });
        return nestedByLinks;
    }
}

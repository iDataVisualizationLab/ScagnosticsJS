// https://gist.github.com/bmershon/25a74f7b1c7cbd07e7456af1d2c07da1
// See https://en.wikipedia.org/wiki/Kruskal%27s_algorithm\
// Depends on DisjointSet.

/**
 * Create a graph from mesh
 * @param triangles is inform of set of triangles as the result from delaunay triangulations
 */
export function createGraph (triangles) {

    function makeLink(sourceId, targetId, weight) {
        return {"source": sourceId, "target": targetId, "weight": weight};
    }

    let graph = {};
    graph.nodes = [];
    graph.links = [];
    //Creating nodes
    triangles.forEach(t => {
        for (let i = 0; i < 3; i++) {
            let id = t[i];
            if (!idExists(graph.nodes, id)) {
                graph.nodes.push(makeNode(id));
            }
        }
    });

    //Creating links
    triangles.forEach(t => {
        for (let i = 0; i < 3; i++) {
            let p1 = t[i];
            let p2 = t[(i + 1) % 3];
            let id1 = p1;
            let id2 = p2;
            let dist = distance(p1, p2);
            let link = makeLink(id1, id2, dist);
            if (!linkExists(graph.links, link)) {
                graph.links.push(link);
            }
        }
    });

    function distance(a, b) {
        var dx = a[0] - b[0],
            dy = a[1] - b[1];
        //For computer storage issue, some coordinates of the same distance may return different distances if we use long floating point
        //So take only 10 digits after the floating points=> this is precise enough and still have the same values for two different lines of the same distance
        return Math.round(Math.sqrt((dx * dx) + (dy * dy))*Math.pow(10, 10))/Math.pow(10, 10);
    }

    //TODO: may sort the id alphabetically => when creating => so we can just check 1 condition only.
    function linkExists(links, link) {
        for (let i = 0; i < links.length; i++) {
            if ((equalIds(link.source, links[i].source) && equalIds(link.target, links[i].target)) ||
                (equalIds(link.source, links[i].target) && equalIds(link.target, links[i].source))) {
                return true;
            }
        }
        return false;
    }

    return graph;
}

export function distance(a, b) {
    let dx = a[0] - b[0],
        dy = a[1] - b[1];
    //For computer storage issue, some coordinates of the same distance may return different distances if we use long floating point
    //So take only 10 digits after the floating points=> this is precise enough and still have the same values for two different lines of the same distance
    return Math.round(Math.sqrt((dx * dx) + (dy * dy))*Math.pow(10, 10))/Math.pow(10, 10);
}

export function equalIds(id1, id2) {
    if (id1[0] === id2[0] && id1[1] === id2[1]) {
        return true;
    } else {
        return false;
    }
}

export function idExists(nodes, id) {

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (equalIds(node.id, id)) {
            return true;
        }
    }
    return false;
}
export function makeNode(id) {
    return {"id": id};
}
/**
 * create the mst
 * @param graph: in form of nodes and links
 * @returns {{nodes: (selection_nodes|nodes), links: Array}}
 */
export function mst (graph) {
    let vertices = graph.nodes,
        edges = graph.links.slice(0),
        selectedEdges = [],
        forest = new DisjointSet();

    // Each vertex begins "disconnected" and isolated from all the others.
    vertices.forEach((vertex) => {
        forest.makeSet(vertex.id);
    });

    // Sort edges in descending order of weight. We will pop edges beginning
    // from the end of the array.
    edges.sort((a, b) => {
        return -(a.weight - b.weight);
    });

    while (edges.length && forest.size() > 1) {
        let edge = edges.pop();

        if (forest.find(edge.source) !== forest.find(edge.target)) {
            forest.union(edge.source, edge.target);
            selectedEdges.push(edge);
        }
    }

    return {
        nodes: vertices,
        links: selectedEdges
    }
}


function DisjointSet() {
    this.index_ = {};
}

function Node(id) {
    this.id_ = id;
    this.parent_ = this;
    this.rank_ = 0;
}

DisjointSet.prototype.makeSet = function (id) {
    if (!this.index_[id]) {
        let created = new Node(id);
        this.index_[id] = created;
    }
}

// Returns the id of the representative element of this set that (id)
// belongs to.
DisjointSet.prototype.find = function (id) {
    if (this.index_[id] === undefined) {
        return undefined;
    }

    let current = this.index_[id].parent_;
    while (current !== current.parent_) {
        current = current.parent_;
    }
    return current.id_;
}

DisjointSet.prototype.union = function (x, y) {
    let xRoot = this.index_[this.find(x)];
    let yRoot = this.index_[this.find(y)];

    if (xRoot === undefined || yRoot === undefined || xRoot === yRoot) {
        // x and y already belong to the same set.
        return;
    }

    if (xRoot.rank < yRoot.rank) { // Move x into the set y is a member of.
        xRoot.parent_ = yRoot;
    } else if (yRoot.rank_ < xRoot.rank_) { // Move y into the set x is a member of.
        yRoot.parent_ = xRoot;
    } else { // Arbitrarily choose to move y into the set x is a member of.
        yRoot.parent_ = xRoot;
        xRoot.rank_++;
    }
}

// Returns the current number of disjoint sets.
DisjointSet.prototype.size = function () {
    let uniqueIndices = {};

    Object.keys(this.index_).forEach((id) => {
        let representative = this.find(id);

        uniqueIndices[id] = true;
    });

    return Object.keys(uniqueIndices).length;
}

export class LeaderBinner {
    constructor(points, radius) {
        //TODO: Should check if there are more than 3 unique values here or even after the binning.
        //TODO: May need to clone the points to avoid modifying it, but we don't do to reserve other data or to make the process faster
        // //Clone these to avoid modifying them
        // this.points = points.map(p=>p.slice(0));
        this.points = points;
        this.radius = radius;
    }

    get leaders() {
        let self = this;
        let theLeaders = [];
        //find all the leaders
        this.points.forEach(point => {
            let leader = closestLeader(theLeaders, point);
            if (!leader) {
                let newLeader = [];
                newLeader.x = point[0];
                newLeader.y = point[1];
                newLeader.z = point[2];
                theLeaders.push(newLeader);
            }
        });
        //now do this again to set the closest leader.
        this.points.forEach(point => {
            let leader = closestLeader(theLeaders, point);
            leader.push(point);
        });
        return theLeaders;

        function closestLeader(leaders, point) {
            let length = leaders.length;
            let minDistance = 5;//since normalized distance can't  be greater than 5.
            let theLeader = null;
            for (let i = 0; i < length; ++i) {
                let l = leaders[i];
                let d = distance([l.x, l.y, l.z], point);
                if (d < self.radius) {
                    if (d < minDistance) {
                        minDistance = d;
                        theLeader = l;
                    }
                }
            }
            return theLeader;
        }
    }
}

export function distance(a, b) {
    let dx = a[0] - b[0],
        dy = a[1] - b[1],
        dz = a[2] - b[2];
    //For computer storage issue, some coordinates of the same distance may return different distances if we use long floating point
    //So take only 10 digits after the floating points=> this is precise enough and still have the same values for two different lines of the same distance
    return Math.round(Math.sqrt((dx * dx) + (dy * dy) + (dz*dz)) * Math.pow(10, 10)) / Math.pow(10, 10);
}
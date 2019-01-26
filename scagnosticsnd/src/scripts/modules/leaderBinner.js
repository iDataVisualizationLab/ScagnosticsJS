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
                newLeader.site = point.slice();
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
            let minDistance = Number.MAX_SAFE_INTEGER;
            let theLeader = null;
            for (let i = 0; i < length; ++i) {
                let l = leaders[i];
                let d = distance(l.site, point);
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
    let sumsquared = 0;
    for (let i = 0; i < a.length; i++) {
        let d = a[i] - b[i];
        sumsquared += d*d;
    }
    //For computer storage issue, some coordinates of the same distance may return different distances if we use long floating point
    //So take only 10 digits after the floating points=> this is precise enough and still have the same values for two different lines of the same distance
    return Math.round(Math.sqrt(sumsquared) * Math.pow(10, 10)) / Math.pow(10, 10);
}
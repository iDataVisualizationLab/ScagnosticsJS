import {distance} from "./kruskal-mst";
import _ from "underscore";

export class LeaderBinner{
    constructor(points, radius){
        //TODO: Should check if there are more than 3 unique values here or even after the binning.
        //Clone these to avoid modifying them
        this.points = points.map(p=>p.slice(0));
        this.radius = radius;
    }
    get leaders(){
        let self = this;
        let theLeaders = [];
        //find all the leaders

        this.points.forEach(point=>{
            let leader = closestLeader(theLeaders, point);
            if(!leader){
                let newLeader = [];
                newLeader.x = point[0];
                newLeader.y = point[1];
                newLeader.radius = 0;
                theLeaders.push(newLeader);
            }
        });
        //now do this again to set the closest leader.
        this.points.forEach(point=>{
           let leader = closestLeader(theLeaders, point);
           leader.push(point);
        });
        return theLeaders;
        function closestLeader(leaders, point){
            let distances = leaders.map(l=>distance([l.x, l.y], point));
            //Filter the distance to be <= the radius
            distances = distances.filter(d=>d<self.radius);
            if(distances.length===0){
                return null;
            }
            let theDistance = _.min(distances);
            let theLeader = leaders[distances.indexOf(theDistance)];
            //Update the radius of the leader if needed.
            if(theLeader.radius < theDistance) theLeader.radius = theDistance;
            return theLeader;
        }
    }
}
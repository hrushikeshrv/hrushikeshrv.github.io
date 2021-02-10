class Ray {
    constructor(position, angle) {
        this.position = position;
        this.direction = p5.Vector.fromAngle(angle);
    }

    cast(boundaries) {
        //Cast the ray on all of the boundaries.
        let minPoint = createVector(window.innerWidth*100, window.innerHeight*100);
        let drawFlag = false;
        for (let boundary of boundaries) {
            const x1 = boundary.pt1.x;
            const x2 = boundary.pt2.x;
            const y1 = boundary.pt1.y;
            const y2 = boundary.pt2.y;

            const x3 = this.position.x;
            const y3 = this.position.y;
            const x4 = this.position.x + this.direction.x;
            const y4 = this.position.y + this.direction.y;

            const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            
            if (denominator === 0) {
                //If the denominator is 0, the ray and the boundary are parallel, so skip to the next boundary
                continue;
            }

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

            if (0 < t && t < 1 && u > 0) {
                //If this condition is satisfied, the ray intersects with this boundary
                const intersection = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
                //If this intersection point is closer than the minimum distance point till now, set this as the min distance point
                if (intersection.dist(this.position) < minPoint.dist(this.position)) {
                    minPoint = intersection;
                    drawFlag = true;
                    //console.log(`Intersected with the boundary at ${minPoint.x},${minPoint.y}`);
                }
            }
        }

        if (drawFlag) {
            stroke(255);
            strokeWeight(1);
            // console.log(minPoint);
            // throw SyntaxError;
            line(this.position.x, this.position.y, minPoint.x, minPoint.y);
        }
        else {
            //console.log(`Didn't intersect with any boundary. MinPoint is ${minPoint}`);
        }
    }
}
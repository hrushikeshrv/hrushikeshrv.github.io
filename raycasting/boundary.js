class Boundary {
    constructor(x1, y1, x2, y2) {
        this.pt1 = createVector(x1, y1);
        this.pt2 = createVector(x2, y2);
    }

    draw() {
        stroke(255);
        strokeWeight(5);
        line(this.pt1.x, this.pt1.y, this.pt2.x, this.pt2.y);
    }
}
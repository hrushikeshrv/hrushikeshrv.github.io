class Particle {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.rays = [];
        for (let i = 0; i < 360; i+= 1) {
            this.rays.push(new Ray(this.position, radians(i)));   
        }
    }

    draw(boundaries) {
        this.position.x = mouseX;
        this.position.y = mouseY;
        fill(255);
        ellipse(this.position.x, this.position.y, 10);
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].cast(boundaries);
        }
    }
}
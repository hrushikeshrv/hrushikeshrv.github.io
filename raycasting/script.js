const boundaries = [];
let particle;

function setup() {
    const canvasW = window.innerWidth*0.95;
    const canvasH = window.innerHeight*0.9;
    createCanvas(canvasW, canvasH);
    //Show the canvas width and height on the screen
    let div = document.querySelector('#canvas-info')
    div.textContent = `Width: ${canvasW}px, Height: ${canvasH}px`;
    div.style.width = '96.5%';

    for (let i = 0; i < 6; i++) {
        boundaries.push(new Boundary(random(canvasW), random(canvasH), random(canvasW), random(canvasH)));
    }

    for (boundary of boundaries) {
        boundary.draw();
    }

    particle = new Particle(width/2, height/2);
}

function draw() {
    background(0);
    for (let boundary of boundaries) {
        boundary.draw();
    }
    particle.draw(boundaries);
}
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Common = Matter.Common;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const matterCanvas = document.querySelector('#matter-canvas-1');
const worldWidth = window.innerWidth * 0.98;
const worldHeight = matterCanvas.parentElement.offsetHeight * 0.98;

const engine = Engine.create();
const world = engine.world;
const render = Render.create({
    canvas: matterCanvas,
    engine: engine,
    options: {
        width: worldWidth,
        height: worldHeight,
        background: 'transparent',
        wireframes: false,
    }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Composite.add(world, [
//     Bodies.rectangle(0, 0, worldWidth*2, 20, { isStatic: true, render: {fillStyle: 'transparent'} }),
//     Bodies.rectangle(400, worldHeight, worldWidth*2, 20, { isStatic: true, render: {fillStyle: 'transparent'} }),
//     Bodies.rectangle(worldWidth, worldHeight, 20, worldHeight*2, { isStatic: true, render: {fillStyle: 'transparent'} }),
//     Bodies.rectangle(0, 0, 20, worldHeight*2, { isStatic: true, render: {fillStyle: 'transparent'} }),
// ]);
engine.gravity.x = 0;
engine.gravity.y = 0;

// Return an options object for an SVG sprite
function getSpriteOptions(path) {
    return {
        render: {
            strokeStyle: '#333333',
            sprite: {
                texture: path
            }
        },
        friction: 0.05,
        frictionAir: 0.001,
    }
}

// Apply a random force on some body
function applyRandomForce(body) {
    Body.applyForce(
        body,
        {
            x: body.position.x,
            y: body.position.y,
        },
        {
            x: (Math.random() - 0.5)/90,
            y: (Math.random() - 0.5)/90,
        }
    )
}

function addSprites(n, path) {
    for (let i = 0; i < n; i++) {
        const body = Bodies.rectangle(worldWidth/2, worldHeight/2, 30, 30, getSpriteOptions(path));
        applyRandomForce(body);
        Composite.add(world, body);
    }
}

// const mouse = Mouse.create(render.canvas);
// const mouseConstraint = MouseConstraint.create(engine, {
//     mouse: mouse,
//     constraint: {
//         stiffness: 0.2,
//         render: {
//             visible: false,
//         }
//     }
// });
// mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
// mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
// Composite.add(world, mouseConstraint);
// render.mouse = mouse;

Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: worldWidth, y: worldHeight},
})
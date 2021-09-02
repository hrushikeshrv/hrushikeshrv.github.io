const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Common = Matter.Common;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let worldWidth = window.innerWidth/2;
if (worldWidth < 200) worldWidth *= 2;

const matterCanvas = document.querySelector('#matter-canvas-1');
const worldHeight = matterCanvas.parentElement.offsetHeight;

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

Composite.add(world, [
    Bodies.rectangle(0, 0, worldWidth*2, 10, { isStatic: true, render: {fillStyle: 'transparent'} }),
    Bodies.rectangle(400, worldHeight, 800, 10, { isStatic: true, render: {fillStyle: 'transparent'} }),
    Bodies.rectangle(worldWidth, worldHeight, 10, worldHeight*2, { isStatic: true, render: {fillStyle: 'transparent'} }),
    Bodies.rectangle(0, 0, 10, worldHeight*2, { isStatic: true, render: {fillStyle: 'transparent'} }),
]);
engine.gravity.x = -0.05;
engine.gravity.y = 0;

const stack = Composites.stack(50, 120, 11, 1, 0, 0, function(x, y) {
    switch (Math.round(Common.random(0, 1))) {
        case 0:
            if (Common.random() < 0.6) {
                return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
            } else {
                return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
            }
        case 1:
            return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 50));

    }
});
Composite.add(world, stack);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false,
        }
    }
});
mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
Composite.add(world, mouseConstraint);
render.mouse = mouse;

Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: worldWidth, y: worldHeight},
})
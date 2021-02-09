import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createPlane } from "./components/plane.js";
import { createHelpers } from "./components/helpers.js";

import { createOrbitControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { createRobot } from "./components/robot.js";
import { createRandomBoxes } from "./components/box.js";

let camera;
let renderer;
let scene;
let loop;

let boxes = null; 

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    // const orbitControls = createOrbitControls(camera, renderer.domElement);
    // orbitControls.enabled = false;
    const { directionalLight, ambientLight } = createLights();

    // loop.updatables.push(orbitControls);

    new Resizer(container, camera, renderer);

    const plane = createPlane();
    boxes = createRandomBoxes(15);

    const { axesHelper } = createHelpers();

    scene.add(directionalLight, ambientLight);
    scene.add(plane);
    scene.add(axesHelper);
    scene.add(...boxes);
  }

  async init() {
    const robot = await createRobot(camera, boxes);
    robot.add(camera);
    loop.updatables.push(robot);
    scene.add(robot);
  }
  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };

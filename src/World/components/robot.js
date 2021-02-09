import { AnimationMixer, MathUtils, Vector2, Vector3 } from "three";
import { Plane } from "three/build/three.module";
import { gltfLoader } from "../systems/gltfLoader";

let robotRoot = null;

const SPEED = 10;
const ROTATE_ANGLE = MathUtils.degToRad(5);
const RADIUS = 10;

let camera = null;
let angle = 0;
const fromCameraDir2 = new Vector3();

const tempPlane = new Plane(new Vector3(0, 1, 0));
const projectedPoint = new Vector3();

async function createRobot(cam) {
  const gltfModel = await gltfLoader.loadAsync(
    "../../assets/models/robot/scene.gltf"
  );

  robotRoot = gltfModel.scene;

  robotRoot.position.setY(13);
  const clip = gltfModel.animations[0];

  const mixer = new AnimationMixer(robotRoot);
  const action = mixer.clipAction(clip);

  action.play();

  robotRoot.tick = (delta) => {
    mixer.update(delta);
  };

  camera = cam;

  return robotRoot;
}

const getRobotModel = () => robotRoot;

export { createRobot, getRobotModel };

document.addEventListener("keydown", handleKeysForModel, false);

function handleKeysForModel(event) {
  const newLookAt = new Vector3().copy(robotRoot.position);
  const previousPosition = robotRoot.position.clone();

  let delta = undefined;
  let deltaAngle = undefined;

  // switch
  if (robotRoot) {
    const { code } = event;
    if (code === "KeyW") {
      delta = -SPEED;
    } else if (code === "KeyD") {
      deltaAngle = ROTATE_ANGLE;
    } else if (code === "KeyA") {
      deltaAngle = -ROTATE_ANGLE;
    } else if (code === "KeyS") {
      delta = SPEED;
    }

    if (delta !== undefined) {
      fromCameraDir2.unproject(camera).normalize();
      tempPlane.projectPoint(fromCameraDir2, projectedPoint).normalize();
      robotRoot.position.add(projectedPoint.clone().multiplyScalar(delta));
      robotRoot.position.y = previousPosition.y;
    }

    if (deltaAngle !== undefined) {
      angle += deltaAngle;
      newLookAt.x = robotRoot.position.x + RADIUS * Math.cos(angle);
      newLookAt.z = robotRoot.position.z + RADIUS * Math.sin(angle);
      robotRoot.lookAt(newLookAt);
    }

  }
}

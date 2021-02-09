import { AnimationMixer, LoopOnce, MathUtils, Vector2, Vector3 } from "three";
import { Box3, Plane } from "three/build/three.module";
import { gltfLoader } from "../systems/gltfLoader";

let robotRoot = null;

const SPEED = 15;
const ROTATE_ANGLE = MathUtils.degToRad(5);
const RADIUS = 15;

let camera = null;
let angle = 0;

let jumpAction = null;

// to move oppositely to camera
const fromCameraDir = new Vector3();
const newLookAt = new Vector3();
const tempPlane = new Plane(new Vector3(0, 1, 0));
const projectedPoint = new Vector3();

// for moving without intersections
const cubes = [];
const cubesBox3 = [];
let modelBox3 = null;
let intersectedBox = null;
const intersectedBoxCenter = new Vector3();

async function createRobot(cam, boxes) {
  const gltfModel = await gltfLoader.loadAsync(
    "../../assets/models/robot/scene.gltf"
  );

  robotRoot = gltfModel.scene;

  robotRoot.position.setY(13);
  const clip = gltfModel.animations[0];
  const jumpClip = gltfModel.animations[4];

  const mixer = new AnimationMixer(robotRoot);
  const action = mixer.clipAction(clip);
  jumpAction = mixer.clipAction(jumpClip);

  action.play();

  robotRoot.tick = (delta) => {
    mixer.update(delta);
  };

  camera = cam;
  boxes.forEach((box) => {
    cubes.push(box);

    const box3 = new Box3().setFromObject(box);
    cubesBox3.push(box3);
  });

  return robotRoot;
}

const getRobotModel = () => robotRoot;

export { createRobot, getRobotModel };

document.addEventListener("keydown", handleKeysForModel, false);

const handleKeyAndCalculateAction = (code) => {
  let deltaSpeed = undefined;
  let deltaAngle = undefined;

  switch (code) {
    case "Space":
      jumpAction.reset();
      jumpAction.setLoop(LoopOnce);
      jumpAction.play();
      break;

    case "KeyW":
      deltaSpeed = -SPEED;
      break;

    case "KeyD":
      deltaAngle = -ROTATE_ANGLE;
      break;

    case "KeyA":
      deltaAngle = ROTATE_ANGLE;
      break;

    case "KeyS":
      deltaSpeed = SPEED;
      break;
  }

  return {
    deltaSpeed,
    deltaAngle,
  };
};

const handleOutPlanePosition = (newPosition) => {
  if (Math.abs(newPosition.x) > 1000) {
    newPosition.x = Math.sign(newPosition.x) * 1000;
  }

  if (Math.abs(newPosition.z) > 1000) {
    newPosition.z = Math.sign(newPosition.z) * 1000;
  }
};

const handleCubesIntersections = (newPosition, previousPosition) => {
  intersectedBox = null;
  cubesBox3.forEach((cube3) => {
    modelBox3 = new Box3().setFromObject(robotRoot);
    const isIntersectedModel = cube3.intersectsBox(modelBox3);
    if (isIntersectedModel) {
      intersectedBox = cube3.clone();
    }
  });

  if (intersectedBox) {
    intersectedBox.getCenter(intersectedBoxCenter);

    // to check whether a point is in a sqaure |x - c| <= d
    if (
      Math.abs(newPosition.x - intersectedBoxCenter.x) <= 75 &&
      Math.abs(newPosition.z - intersectedBoxCenter.z) <= 75
    ) {
      newPosition.copy(previousPosition);
    }
  }
};

const handleMoving = (deltaSpeed) => {
  const previousPosition = robotRoot.position.clone();
  const newPosition = previousPosition.clone();

  fromCameraDir.unproject(camera).normalize();
  tempPlane.projectPoint(fromCameraDir, projectedPoint).normalize();
  newPosition.add(projectedPoint.clone().multiplyScalar(deltaSpeed));

  handleOutPlanePosition(newPosition);
  handleCubesIntersections(newPosition, previousPosition);

  robotRoot.position.copy(newPosition);
  robotRoot.position.y = previousPosition.y;
};

const handleRotating = (deltaAngle) => {
  newLookAt.copy(robotRoot.position);
  angle += deltaAngle;
  newLookAt.x = robotRoot.position.x + RADIUS * Math.sin(angle);
  newLookAt.z = robotRoot.position.z + RADIUS * Math.cos(angle);
  robotRoot.lookAt(newLookAt);
};

function handleKeysForModel(event) {
  if (robotRoot) {
    const { deltaSpeed, deltaAngle } = handleKeyAndCalculateAction(event.code);
    if (deltaSpeed !== undefined) {
      handleMoving(deltaSpeed);
    }

    if (deltaAngle !== undefined) {
      handleRotating(deltaAngle);
    }
  }
}

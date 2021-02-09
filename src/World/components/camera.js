import { PerspectiveCamera } from 'three';
import { Vector3 } from 'three/build/three.module';

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.1, 10000);

  camera.position.set(0, 1200, -1800);
  camera.lookAt(new Vector3());

  return camera;
}

export { createCamera };

import { GridHelper, AxesHelper } from 'three';

function createHelpers() {
  const gridHelper = new GridHelper(1000, 20);
  const axesHelper = new AxesHelper(2000);

  return { gridHelper, axesHelper };
}

export { createHelpers };
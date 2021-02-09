import { DoubleSide, MirroredRepeatWrapping } from "three";
import { BoxGeometry, Mesh, MeshPhongMaterial } from "three/build/three.module"
import { textureLoader } from "../systems/textureLoader";

const texture = textureLoader.load('/assets/textures/wood.jpg');

texture.wrapS = MirroredRepeatWrapping;
texture.wrapT = MirroredRepeatWrapping;


const getRandomInt = (min, max) => {
    const handledMin = Math.ceil(min);
    const handledMax = Math.floor(max);
    return Math.floor(Math.random() * (handledMax - handledMin) + handledMin); 
  }

function createBox() {
    const geometry = new BoxGeometry(100, 100, 100);

    const material = new MeshPhongMaterial({
        map: texture,
        side: DoubleSide,

    });

    const box = new Mesh(geometry, material);

    return box;
}

function createRandomBoxes(amount = 5) {
    const boxes = [];
    
    for (let i = 0; i < amount; i++) {
        const box = createBox();

        box.position.x = getRandomInt(-950, 950);
        box.position.y = 52;
        box.position.z = getRandomInt(-950, 950);

        boxes.push(box);
    }

    return boxes;
}

export { createRandomBoxes }
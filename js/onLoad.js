import { Sprite } from "../classes.js";
import { Boundary } from "../classes.js";
import { collisions } from "../data/collisions.js";
const loadCollisions = (collisionObjects) => {
  const collisionsMap = [];
  for (let i = 0; i < 570; i += 30) {
    collisionsMap.push(
      collisionObjects.layers[collisionObjects.layers.length - 1].data.slice(
        i,
        30 + i
      )
    );
  }
  const boundaries = [];
  const offset = {
    x: 0,
    y: 0,
  };

  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol != 0) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
      }
    });
  });

  return boundaries;
};

export const loadRenderables = (chapter) => {
  const characters = [];
  const boundaries = loadCollisions(collisions[chapter.collisions_name]);
  const backgroundImage = new Image();
  backgroundImage.src = `../assets/${chapter.background}`;

  const foregroundImage = new Image();
  // foregroundImage.src = "./img/foregroundObjects.png";

  const playerDownImage = new Image();
  playerDownImage.src = "../assets/playerDown.png";

  const playerUpImage = new Image();
  playerUpImage.src = "../assets/playerUp.png";

  const playerLeftImage = new Image();
  playerLeftImage.src = "../assets/playerLeft.png";

  const playerRightImage = new Image();
  playerRightImage.src = "../assets/playerRight.png";

  const player = new Sprite({
    position: chapter.player.position,
    image: playerDownImage,
    frames: {
      max: 4,
      hold: 10,
    },
    sprites: {
      up: playerUpImage,
      left: playerLeftImage,
      right: playerRightImage,
      down: playerDownImage,
    },
    scale: 0.5,
  });

  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    // position: {
    //   x: offset.x,
    //   y: offset.y,
    // },
    image: backgroundImage,
  });

  // const foreground = new Sprite({
  //   position: {
  //     x: offset.x,
  //     y: offset.y,
  //   },
  //   image: foregroundImage,
  // });

  chapter.characters.forEach((character) => {
    const characterDownImage = new Image();
    characterDownImage.src = "../assets/playerDown.png";

    const characterUpImage = new Image();
    characterUpImage.src = "../assets/playerUp.png";

    const characterLeftImage = new Image();
    characterLeftImage.src = "../assets/playerLeft.png";

    const characterRightImage = new Image();
    characterRightImage.src = "../assets/playerRight.png";
    const characterImages = {
      up: characterUpImage,
      down: characterDownImage,
      left: characterLeftImage,
      right: characterRightImage,
    };
    characters.push(
      new Sprite({
        position: character.position,
        image: characterImages[character.direction],
        frames: {
          max: 4,
          hold: 10,
        },
        sprites: {
          ...characterImages,
        },
        scale: 0.5,
        interaction: character.interaction,
        name: character.name,
      })
    );
  });
  return {
    toRender: [
      background,
      ...boundaries,
      // ...battleZones,
      ...characters,
      // foreground,
      player,
    ],
    player,
    boundaries,
    characters,
  };
};

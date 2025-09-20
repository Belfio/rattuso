import { Sprite } from "../classes.js";
import { Boundary } from "../classes.js";
import { collisions } from "../data/collisions.js";
const loadCollisions = (collisionObjects, offsetX = 0, offsetY = 0) => {
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

  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol != 0) {
        const boundary = new Boundary({
          position: {
            x: j * Boundary.width + offsetX,
            y: i * Boundary.height + offsetY,
          },
        });
        // Store original position for future reference
        boundary.originalX = j * Boundary.width;
        boundary.originalY = i * Boundary.height;
        boundaries.push(boundary);
      }
    });
  });

  return boundaries;
};

export const loadRenderables = (chapter) => {
  const characters = [];

  // For camera system, start player near center of viewport
  const canvas = document.querySelector("canvas");
  const playerStartX = canvas.width / 2 - 16; // Center minus half player width
  const playerStartY = canvas.height / 2 - 16; // Center minus half player height

  // Get background image dimensions to prevent grey canvas exposure
  const backgroundImage = new Image();
  backgroundImage.src = `../assets/${chapter.background}`;

  // Offset background so player appears at the correct world position
  // But ensure background never exposes grey canvas areas
  const originalPlayerX = chapter.player.position.x;
  const originalPlayerY = chapter.player.position.y;
  let backgroundOffsetX = playerStartX - originalPlayerX;
  let backgroundOffsetY = playerStartY - originalPlayerY;

  // Clamp background offset to prevent grey canvas exposure
  // This ensures the background always covers the entire viewport
  function clampBackgroundOffset() {
    // Default map size if image not loaded yet
    const mapWidth = 960; // Will be updated when image loads
    const mapHeight = 640; // Will be updated when image loads

    // Don't let background move too far right (left edge visible)
    if (backgroundOffsetX > 0) {
      backgroundOffsetX = 0;
    }
    // Don't let background move too far left (right edge visible)
    if (backgroundOffsetX < -(mapWidth - canvas.width) && mapWidth > canvas.width) {
      backgroundOffsetX = -(mapWidth - canvas.width);
    }
    // Don't let background move too far down (top edge visible)
    if (backgroundOffsetY > 0) {
      backgroundOffsetY = 0;
    }
    // Don't let background move too far up (bottom edge visible)
    if (backgroundOffsetY < -(mapHeight - canvas.height) && mapHeight > canvas.height) {
      backgroundOffsetY = -(mapHeight - canvas.height);
    }
  }

  clampBackgroundOffset();

  const boundaries = loadCollisions(collisions[chapter.collisions_name], backgroundOffsetX, backgroundOffsetY);

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

  // Adjust player position based on clamped background offset
  const adjustedPlayerX = originalPlayerX + backgroundOffsetX;
  const adjustedPlayerY = originalPlayerY + backgroundOffsetY;

  const player = new Sprite({
    position: { x: adjustedPlayerX, y: adjustedPlayerY },
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
      x: backgroundOffsetX,
      y: backgroundOffsetY,
    },
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
        position: {
          x: character.position.x + backgroundOffsetX,
          y: character.position.y + backgroundOffsetY,
        },
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

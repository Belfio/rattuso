import { Sprite } from '../classes.js';
import { Boundary } from '../classes.js';
import { collisions } from '../data/collisions.js';

// import { objects2 } from "../data/objects2.js";
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


export const loadRenderables = chapter => {
  const characters = [];

  // For camera system, position player and background correctly
  const canvas = document.querySelector('canvas');
  const viewportCenterX = canvas.width / 2 - 16; // Center minus half player width
  const viewportCenterY = canvas.height / 2 - 16; // Center minus half player height

  // Get background image dimensions to prevent grey canvas exposure
  const backgroundImage = new Image();
  backgroundImage.src = `../assets/${chapter.background}`;

  // Player's world position from chapter data
  const originalPlayerX = chapter.player.position.x;
  const originalPlayerY = chapter.player.position.y;

  // Calculate ideal background offset to center player
  const idealBackgroundOffsetX = viewportCenterX - originalPlayerX;
  const idealBackgroundOffsetY = viewportCenterY - originalPlayerY;

  // Clamp background offset to prevent grey canvas exposure
  function clampBackgroundOffset(offsetX, offsetY) {
    const mapWidth = 960; // Default, will be updated when image loads
    const mapHeight = 640;

    // Clamp X offset
    let clampedX = offsetX;
    if (clampedX > 0) {
      clampedX = 0; // Don't show left edge
    }
    if (mapWidth > canvas.width && clampedX < -(mapWidth - canvas.width)) {
      clampedX = -(mapWidth - canvas.width); // Don't show right edge
    }

    // Clamp Y offset
    let clampedY = offsetY;
    if (clampedY > 0) {
      clampedY = 0; // Don't show top edge
    }
    if (mapHeight > canvas.height && clampedY < -(mapHeight - canvas.height)) {
      clampedY = -(mapHeight - canvas.height); // Don't show bottom edge
    }

    return { x: clampedX, y: clampedY };
  }

  const clampedOffset = clampBackgroundOffset(
    idealBackgroundOffsetX,
    idealBackgroundOffsetY
  );
  const backgroundOffsetX = clampedOffset.x;
  const backgroundOffsetY = clampedOffset.y;

  const boundaries = loadCollisions(
    collisions[chapter.collisions_name],
    backgroundOffsetX,
    backgroundOffsetY
  );


  const foregroundImage = new Image();
  // foregroundImage.src = "./img/foregroundObjects.png";

  const playerDownImage = new Image();
  playerDownImage.src = '../assets/playerDown.png';

  const playerUpImage = new Image();
  playerUpImage.src = '../assets/playerUp.png';

  const playerLeftImage = new Image();
  playerLeftImage.src = '../assets/playerLeft.png';

  const playerRightImage = new Image();
  playerRightImage.src = '../assets/playerRight.png';

  // Calculate final player screen position
  // If we can center the player (background wasn't clamped), player goes to center
  // If we can't center (background was clamped), player appears offset from center
  let finalPlayerX, finalPlayerY;

  if (idealBackgroundOffsetX === backgroundOffsetX) {
    // Background wasn't clamped horizontally - player can be centered
    finalPlayerX = viewportCenterX;
  } else {
    // Background was clamped - calculate player's screen position
    finalPlayerX = originalPlayerX + backgroundOffsetX;
  }

  if (idealBackgroundOffsetY === backgroundOffsetY) {
    // Background wasn't clamped vertically - player can be centered
    finalPlayerY = viewportCenterY;
  } else {
    // Background was clamped - calculate player's screen position
    finalPlayerY = originalPlayerY + backgroundOffsetY;
  }

  const player = new Sprite({
    position: { x: finalPlayerX, y: finalPlayerY },
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

  chapter.characters.forEach(character => {
    const characterDownImage = new Image();
    characterDownImage.src = '../assets/playerDown.png';

    const characterUpImage = new Image();
    characterUpImage.src = '../assets/playerUp.png';

    const characterLeftImage = new Image();
    characterLeftImage.src = '../assets/playerLeft.png';

    const characterRightImage = new Image();
    characterRightImage.src = '../assets/playerRight.png';
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
        interactions: character.interactions,
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

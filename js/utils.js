function rectangularCollision({ rectangle1, rectangle2 }) {
  //colliding == is rectangle1 inside rectangle2, check the corners
  // top left corner

  return (
    rectangle1.position.x > rectangle2.position.x - rectangle2.width / 2 &&
    rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y > rectangle2.position.y - rectangle2.height &&
    rectangle1.position.y < rectangle2.position.y + rectangle2.height / 2
  );
}

export const checkForCharacterCollision = ({
  characters,
  player,
  characterOffset = { x: 0, y: 0 },
}) => {
  // console.log(player);
  // console.log(characters);
  player.interactionAsset = null;
  // monitor for character collision
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = { character, index: 0, answerTemp: 0 };
      player.interacting = true;
      break;
    }
  }
};

export const movementManager = (
  canvas,
  keys,
  lastKey,
  player,
  boundaries,
  characters,
  renderables
) => {
  let moving = true;
  player.animate = false;

  // Camera system configuration for mobile-friendly experience
  const VIEWPORT_CENTER_X = canvas.width / 2;
  const VIEWPORT_CENTER_Y = canvas.height / 2;
  const CAMERA_DEADZONE = 100; // Player can move this much before camera follows

  // Get background to determine map boundaries
  const background = renderables.find(r => r.constructor.name === 'Sprite' && r.image && !r.sprites);
  const mapWidth = background ? background.image.width : canvas.width * 2;
  const mapHeight = background ? background.image.height : canvas.height * 2;

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    // Check for collisions before moving
    let canMove = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      const backgroundY = background ? background.position.y : 0;
      const backgroundX = background ? background.position.x : 0;

      // Check if we're at map boundaries
      const atMapTop = backgroundY >= 0;
      const atMapBottom = backgroundY <= -(mapHeight - canvas.height);

      // Always try to keep player centered by moving the map
      // Only move player when map can't move anymore
      if (!atMapTop) {
        // Move map down (camera moves up)
        renderables.forEach(renderable => {
          if (renderable !== player) {
            renderable.position.y += 3;
          }
        });
      } else {
        // At map boundary, move player toward top of screen
        const targetY = VIEWPORT_CENTER_Y * 0.3; // 30% from top
        if (player.position.y > targetY) {
          player.position.y -= 3;
        }
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 },
    });

    let canMove = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      const backgroundX = background ? background.position.x : 0;

      // Check if we're at map boundaries
      const atMapLeft = backgroundX >= 0;

      if (!atMapLeft) {
        // Move map right (camera moves left)
        renderables.forEach(renderable => {
          if (renderable !== player) {
            renderable.position.x += 3;
          }
        });
      } else {
        // At map boundary, move player toward left side of screen
        const targetX = VIEWPORT_CENTER_X * 0.3; // 30% from left
        if (player.position.x > targetX) {
          player.position.x -= 3;
        }
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;

    let canMove = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      const backgroundY = background ? background.position.y : 0;

      // Check if we're at map boundaries
      const atMapBottom = backgroundY <= -(mapHeight - canvas.height);

      if (!atMapBottom) {
        // Move map up (camera moves down)
        renderables.forEach(renderable => {
          if (renderable !== player) {
            renderable.position.y -= 3;
          }
        });
      } else {
        // At map boundary, move player toward bottom of screen
        const targetY = VIEWPORT_CENTER_Y * 1.7; // 70% from top
        if (player.position.y < targetY && player.position.y < canvas.height - player.height) {
          player.position.y += 3;
        }
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 },
    });

    let canMove = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        canMove = false;
        break;
      }
    }

    if (canMove) {
      const backgroundX = background ? background.position.x : 0;

      // Check if we're at map boundaries
      const atMapRight = backgroundX <= -(mapWidth - canvas.width);

      if (!atMapRight) {
        // Move map left (camera moves right)
        renderables.forEach(renderable => {
          if (renderable !== player) {
            renderable.position.x -= 3;
          }
        });
      } else {
        // At map boundary, move player toward right side of screen
        const targetX = VIEWPORT_CENTER_X * 1.7; // 70% from left
        if (player.position.x < targetX && player.position.x < canvas.width - player.width) {
          player.position.x += 3;
        }
      }
    }
  }
  return false;
};

export const interactionConvo = (player) => {
  let interactionEnd = false;
  let htmlTextQ = "";
  let htmlTextA = "";
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interaction;
  if (interaction.type === "discussion") {
    htmlTextQ = `${interaction.discussion[index].a} `;

    interaction.discussion[index].b.forEach(
      (answer, i) =>
        (htmlTextA =
          htmlTextA +
          `<div id="dialogueBoxTextResponse" class="answerOption ${
            answerTemp === i && "selectedAnswer"
          }">
        ${answer.option}</div>`)
    );

    return { question: htmlTextQ, answers: htmlTextA };
  }

  return { interactionEnd, htmlText };
};

export const selectNextOption = (player) => {
  let htmlTextA = "";
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interaction;
  if (interaction.type === "discussion") {
    interaction.discussion[index].b.forEach(
      (answer, i) =>
        (htmlTextA =
          htmlTextA +
          `<div id="dialogueBoxTextResponse" class="answerOption ${
            answerTemp === i && "selectedAnswer"
          }">
        ${answer.option}</div>`)
    );

    return htmlTextA;
  }
  return {};
};

export const nextAnswerIndex = (player, lastKey) => {
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interaction;
  const answersTotNumber = interaction.discussion[index].b.length;
  let newIndex = answerTemp;

  switch (lastKey) {
    case "s":
      if (newIndex === answersTotNumber - 1) newIndex = 0;
      else newIndex++;
      break;
    case "w":
      if (newIndex === 0) newIndex = answersTotNumber - 1;
      else newIndex--;
      break;

    default:
      break;
  }
  return newIndex;
};

export const getNextConvoIndex = (player) => {
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interaction;

  return interaction.discussion[index].b[answerTemp].next;
};

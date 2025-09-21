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

export const checkForPlayerCollision = ({
  characters,
  objects,
  player,
  characterOffset = { x: 0, y: 0 },
  interactionEnd = false,
}) => {
  if (interactionEnd) {
    return;
  }
  console.log(player.position);
  
  player.interactionAsset = null;
  const collisionObjects = [...characters, ...objects];
  console.log(collisionObjects);
  // monitor for character collision
  for (let i = 0; i < collisionObjects.length; i++) {
    const target = collisionObjects[i];

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...target,
          position: {
            x: target.position.x + characterOffset.x,
            y: target.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = { character: target, index: 0, answerTemp: 0 };
      player.interacting = true;
      break;
    }
  }
};

export const checkForCharacterCollision = ({
  characters,
  player,
  characterOffset = { x: 0, y: 0 },
  interactionEnd = false,
}) => {
  if (interactionEnd) {
    return;
  }
  player.interactionAsset = null;
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
  renderables,
  objects
) => {
  const SPEED = 3;
  player.animate = false;

  // Camera system configuration - works with full-screen mobile canvas
  const VIEWPORT_CENTER_X = canvas.width / 2;
  const VIEWPORT_CENTER_Y = canvas.height / 2;

  // Get background to determine map boundaries (background keeps original size)
  const background = renderables.find(
    r => r.constructor.name === 'Sprite' && r.image && !r.sprites
  );
  const mapWidth = background
    ? background.image.naturalWidth || background.image.width
    : 960;
  const mapHeight = background
    ? background.image.naturalHeight || background.image.height
    : 640;

  // Resolve current intended direction
  const direction =
    (keys.w.pressed && lastKey === 'w') ? 'up' :
    (keys.a.pressed && lastKey === 'a') ? 'left' :
    (keys.s.pressed && lastKey === 's') ? 'down' :
    (keys.d.pressed && lastKey === 'd') ? 'right' :
    null;

  if (!direction) return false;

  // Set animation and sprite
  player.animate = true;
  switch (direction) {
    case 'up':
      player.image = player.sprites.up;
      break;
    case 'down':
      player.image = player.sprites.down;
      break;
    case 'left':
      player.image = player.sprites.left;
      break;
    case 'right':
      player.image = player.sprites.right;
      break;
  }

  // Character interaction checks (only for horizontal, matching original behavior)
  if (direction === 'left') {
    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: SPEED, y: 0 },
    });
  } else if (direction === 'right') {
    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -SPEED, y: 0 },
    });
  }

  // Directional offsets for boundary collision pre-check
  let boundaryOffset = { x: 0, y: 0 };
  switch (direction) {
    case 'up':
      boundaryOffset = { x: 0, y: SPEED };
      break;
    case 'down':
      boundaryOffset = { x: 0, y: -SPEED };
      break;
    case 'left':
      boundaryOffset = { x: SPEED, y: 0 };
      break;
    case 'right':
      boundaryOffset = { x: -SPEED, y: 0 };
      break;
  }

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
            x: boundary.position.x + boundaryOffset.x,
            y: boundary.position.y + boundaryOffset.y,
          },
        },
      })
    ) {
      canMove = false;
      break;
    }
  }

  if (!canMove) return false;

  const isVertical = direction === 'up' || direction === 'down';
  const axis = isVertical ? 'y' : 'x';
  const center = isVertical ? VIEWPORT_CENTER_Y : VIEWPORT_CENTER_X;
  const backgroundPos = background ? background.position[axis] : 0;

  // Player centering check (within 5px tolerance)
  const isPlayerCentered = Math.abs(player.position[axis] - center) <= 5;
  const moveTowardsCenter =
    (direction === 'up' || direction === 'left')
      ? player.position[axis] > center
      : player.position[axis] < center;

  if (!isPlayerCentered && moveTowardsCenter) {
    // Phase 1: move player toward center, keep map still
    player.position[axis] += (direction === 'up' || direction === 'left')
      ? -SPEED
      : SPEED;
  } else {
    // Phase 2: player centered, check map boundaries
    const atMapEdge = (() => {
      if (isVertical) {
        if (direction === 'up') return backgroundPos >= 0;
        return backgroundPos <= -(mapHeight - canvas.height);
      } else {
        if (direction === 'left') return backgroundPos >= 0;
        return backgroundPos <= -(mapWidth - canvas.width);
      }
    })();

    if (!atMapEdge) {
      // Map can still move - normal camera following
      renderables.forEach(renderable => {
        if (renderable !== player) {
          renderable.position[axis] += (direction === 'up' || direction === 'left')
            ? SPEED
            : -SPEED;
        }
      });
    } else {
      // Map at boundary - move player toward screen edge within limits
      if (direction === 'up') {
        const minY = 10;
        if (player.position.y > minY) player.position.y -= SPEED;
      } else if (direction === 'down') {
        const maxY = canvas.height - 50;
        if (player.position.y < maxY) player.position.y += SPEED;
      } else if (direction === 'left') {
        const minX = 10;
        if (player.position.x > minX) player.position.x -= SPEED;
      } else {
        const maxX = canvas.width - 50;
        if (player.position.x < maxX) player.position.x += SPEED;
      }
    }
  }

  return false;
};

export const interactionConvo = (player, charState) => {
  const interactionEnd = false;
  let htmlTextQ = '';
  let htmlTextA = '';
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interactions[charState];
  if (interaction.type === 'discussion') {
    htmlTextQ = `${interaction.discussion[index].a} `;

    interaction.discussion[index].b.forEach(
      (answer, i) =>
        (htmlTextA =
          htmlTextA +
          `<div id="dialogueBoxTextResponse" class="answerOption${
            answerTemp === i ? ' selectedAnswer' : ''
          }">
        ${answer.option}</div>`)
    );

    return { question: htmlTextQ, answers: htmlTextA };
  }

  return { interactionEnd, htmlText };
};

export const selectNextOption = (player, charState) => {
  let htmlTextA = '';
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interactions[charState];

  if (interaction.type === 'discussion') {
    interaction.discussion[index].b.forEach(
      (answer, i) =>
        (htmlTextA =
          htmlTextA +
          `<div id="dialogueBoxTextResponse" class="answerOption${
            answerTemp === i ? ' selectedAnswer' : ''
          }">
        ${answer.option}</div>`)
    );

    return htmlTextA;
  }
  return {};
};

export const nextAnswerIndex = (player, lastKey, charState) => {
  try {
    const index = player.interactionAsset.index;
    const answerTemp = player.interactionAsset.answerTemp;
    const interaction =
      player.interactionAsset.character.interactions[charState];
    console.log(interaction);
    console.log(charState);
    const answersTotNumber = interaction.discussion[index].b.length;
    let newIndex = answerTemp;

    switch (lastKey) {
      case 's':
        if (newIndex === answersTotNumber - 1) {
          newIndex = 0;
        } else {
          newIndex++;
        }
        break;
      case 'w':
        if (newIndex === 0) {
          newIndex = answersTotNumber - 1;
        } else {
          newIndex--;
        }
        break;

      default:
        break;
    }
    return newIndex;
  } catch (error) {
    console.log('Probably something wrong with the plot');
    const index = player.interactionAsset.index;
    const answerTemp = player.interactionAsset.answerTemp;
    console.log(index);
    console.log(answerTemp);
    console.log(charState);
    return 0;
  }
};

export const getNextConvoIndex = (player, charState) => {
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interactions[charState];

  return interaction.discussion[index].b[answerTemp].next;
};

export const getNextState = (player, charState) => {
  const index = player.interactionAsset.index;
  const answerTemp = player.interactionAsset.answerTemp;
  const interaction = player.interactionAsset.character.interactions[charState];

  return interaction.discussion[index].b[answerTemp].state || 'default';
};

export const checkKeysPressed = (
  keys,
  lastKey,
  antiBouncer,
  antiBouncerLimit
) => {
  if (keys.w.pressed && lastKey === 'w' && antiBouncer > antiBouncerLimit) {
    return 'up';
  }
  if (keys.s.pressed && lastKey === 's' && antiBouncer > antiBouncerLimit) {
    return 'down';
  }
  if (keys.space.pressed && lastKey === ' ' && antiBouncer > antiBouncerLimit) {
    return 'action';
  }
  if (keys.a.pressed && lastKey === 'a' && antiBouncer > antiBouncerLimit) {
    return 'left';
  }
  if (keys.d.pressed && lastKey === 'd' && antiBouncer > antiBouncerLimit) {
    return 'right';
  }
  return null;
};

let oldLog = null;
export function log(message, doc) {
  const logBox = doc.getElementById('logs');
  if (message === oldLog) {
    return;
  }
  oldLog = message;
  logBox.innerHTML = message;
}

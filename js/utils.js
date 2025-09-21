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
  interactionEnd = false,
}) => {
  if (interactionEnd) {
    return;
  }
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
  const moving = true;
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

  if (keys.w.pressed && lastKey === 'w') {
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

      // Check if player is centered (within 5px tolerance)
      const isPlayerCentered =
        Math.abs(player.position.y - VIEWPORT_CENTER_Y) <= 5;

      if (!isPlayerCentered && player.position.y > VIEWPORT_CENTER_Y) {
        // Phase 1: Move player toward center from below, keep map still
        player.position.y -= 3;
      } else {
        // Phase 2: Player is centered, check map boundaries
        const atMapTop = backgroundY >= 0; // Map's top edge is at or past screen top

        if (!atMapTop) {
          // Map can still move - normal camera following
          renderables.forEach(renderable => {
            if (renderable !== player) {
              renderable.position.y += 3;
            }
          });
        } else {
          // Map is at top boundary - now move player toward top edge
          const minY = 10; // Minimum distance from top edge
          if (player.position.y > minY) {
            player.position.y -= 3;
          }
        }
      }
    }
  } else if (keys.a.pressed && lastKey === 'a') {
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

      // Check if player is centered (within 5px tolerance)
      const isPlayerCentered =
        Math.abs(player.position.x - VIEWPORT_CENTER_X) <= 5;

      if (!isPlayerCentered && player.position.x > VIEWPORT_CENTER_X) {
        // Phase 1: Move player toward center from the right, keep map still
        player.position.x -= 3;
      } else {
        // Phase 2: Player is centered, check map boundaries
        const atMapLeft = backgroundX >= 0; // Map's left edge is at or past screen left

        if (!atMapLeft) {
          // Map can still move - normal camera following
          renderables.forEach(renderable => {
            if (renderable !== player) {
              renderable.position.x += 3;
            }
          });
        } else {
          // Map is at left boundary - now move player toward left edge
          const minX = 10; // Minimum distance from left edge
          if (player.position.x > minX) {
            player.position.x -= 3;
          }
        }
      }
    }
  } else if (keys.s.pressed && lastKey === 's') {
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

      // Check if player is centered (within 5px tolerance)
      const isPlayerCentered =
        Math.abs(player.position.y - VIEWPORT_CENTER_Y) <= 5;

      if (!isPlayerCentered && player.position.y < VIEWPORT_CENTER_Y) {
        // Phase 1: Move player toward center from above, keep map still
        player.position.y += 3;
      } else {
        // Phase 2: Player is centered, check map boundaries
        const atMapBottom = backgroundY <= -(mapHeight - canvas.height); // Map's bottom edge is at or past screen bottom

        if (!atMapBottom) {
          // Map can still move - normal camera following
          renderables.forEach(renderable => {
            if (renderable !== player) {
              renderable.position.y -= 3;
            }
          });
        } else {
          // Map is at bottom boundary - now move player toward bottom edge
          const maxY = canvas.height - 50; // Minimum distance from bottom edge
          if (player.position.y < maxY) {
            player.position.y += 3;
          }
        }
      }
    }
  } else if (keys.d.pressed && lastKey === 'd') {
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

      // Check if player is centered (within 5px tolerance)
      const isPlayerCentered =
        Math.abs(player.position.x - VIEWPORT_CENTER_X) <= 5;

      if (!isPlayerCentered && player.position.x < VIEWPORT_CENTER_X) {
        // Phase 1: Move player toward center from the left, keep map still
        player.position.x += 3;
      } else {
        // Phase 2: Player is centered, check map boundaries
        const atMapRight = backgroundX <= -(mapWidth - canvas.width); // Map's right edge is at or past screen right

        if (!atMapRight) {
          // Map can still move - normal camera following
          renderables.forEach(renderable => {
            if (renderable !== player) {
              renderable.position.x -= 3;
            }
          });
        } else {
          // Map is at right boundary - now move player toward right edge
          const maxX = canvas.width - 50; // Minimum distance from right edge
          if (player.position.x < maxX) {
            player.position.x += 3;
          }
        }
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

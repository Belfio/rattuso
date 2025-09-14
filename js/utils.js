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
  characters
) => {
  let moving = true;
  player.animate = false;

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    if (player.position.y <= 0) return;
    // checkForCharacterCollision({
    //   characters,
    //   player,
    //   characterOffset: { x: 0, y: 3 },
    // });

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
        moving = false;
        break;
      }
    }

    if (moving) player.position.y -= 3;
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    if (player.position.x <= 0) return;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 },
    });

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
        moving = false;
        break;
      }
    }

    if (moving) player.position.x -= 3;
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    if (player.position.y >= canvas.height) return;

    // checkForCharacterCollision({
    //   characters,
    //   player,
    //   characterOffset: { x: 0, y: -3 },
    // });

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
        console.log(boundary, player);
        moving = false;
        break;
      }
    }
    if (moving) player.position.y += 3;
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 },
    });

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
        moving = false;
        break;
      }
    }

    if (moving) player.position.x += 3;
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

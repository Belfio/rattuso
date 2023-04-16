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

function checkForCharacterCollision({
  characters,
  player,
  characterOffset = { x: 0, y: 0 },
}) {
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
      player.interactionAsset = character;
      break;
    }
  }
}

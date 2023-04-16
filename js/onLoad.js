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
      if (symbol != 0)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  return boundaries;
};

export default loadCollisions;

const loadCharacters = () => {};

const loadMap = () => {};

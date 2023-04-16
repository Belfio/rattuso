import loadCollisions from "./js/onLoad";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 640;

const boundaries = loadCollisions(collisionObjects);

const charactersMap = [];
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i));
}

const characters = [];
// const rattusoImg = new Image();
// rattusoImg.src = "./assets/rattuso.png";
const villagerImg = new Image();
villagerImg.src = "./assets/villager/Idle.png";

// const oldManImg = new Image();
// oldManImg.src = "./img/oldMan/Idle.png";

const backgroundImage = new Image();
backgroundImage.src = "./assets/casa.png";

const foregroundImage = new Image();
// foregroundImage.src = "./img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./assets/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./assets/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./assets/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./assets/playerRight.png";

const player = new Sprite({
  position: {
    x: 40,
    y: 180,
  },
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

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [
  // background,
  // ...boundaries,
  // foreground,
  // ...battleZones,
  // ...characters,
  player,
];
const renderables = [
  background,
  ...boundaries,
  // ...battleZones,
  ...characters,
  player,
  // foreground,
];

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  renderables.forEach((renderable) => {
    renderable.draw();
  });

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

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
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

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
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

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
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

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  }
}
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  if (player.isInteracting) {
    switch (e.key) {
      case " ":
        player.interactionAsset.dialogueIndex++;

        const { dialogueIndex, dialogue } = player.interactionAsset;
        if (dialogueIndex <= dialogue.length - 1) {
          document.querySelector("#characterDialogueBox").innerHTML =
            player.interactionAsset.dialogue[dialogueIndex];
          return;
        }

        // finish conversation
        player.isInteracting = false;
        player.interactionAsset.dialogueIndex = 0;
        document.querySelector("#characterDialogueBox").style.display = "none";

        break;
    }
    return;
  }

  switch (e.key) {
    case " ":
      document.querySelector("#dialogueBox").style.display = "flex";
      if (!player.interactionAsset) return;

      // beginning the conversation
      const firstMessage = player.interactionAsset.dialogue[0];
      document.querySelector("#characterDialogueBox").innerHTML = firstMessage;
      document.querySelector("#characterDialogueBox").style.display = "flex";
      player.isInteracting = true;
      break;
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;

    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

// let clicked = false;
// addEventListener("click", () => {
//   if (!clicked) {
//     audio.Map.play();
//     clicked = true;
//   }
// });

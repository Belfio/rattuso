import { loadRenderables } from "./js/onLoad.js";
import { canvas, doc } from "./classes.js";
import { keys, IDLE, COMIC, GAME } from "./js/constants.js";
import {
  movementManager,
  checkForCharacterCollision,
  interactionConvo,
  selectNextOption,
  nextAnswerIndex,
  getNextConvoIndex,
} from "./js/utils.js";
import { plot } from "./data/plot.js";

canvas.width = 960;
canvas.height = 640;

let lastKey = "";
let chapterType = IDLE;
let currentChapter;
let i = 0;
let story_index = 0;
let antiBouncer = 0;
const ANTI_BOUNCER_LIMIT = 20;
let renderables = {};
function animate() {
  antiBouncer++;
  // read and launch story chapter
  const animationId = window.requestAnimationFrame(animate);
  // Loading level 0
  const comic_page = doc.getElementById("comic_div");
  const canv_game = doc.getElementById("canvas");

  if (chapterType === IDLE) {
    currentChapter = plot.story[i];
    chapterType = currentChapter.type;
    i++;
    story_index = 0;
  }
  if (chapterType === COMIC) {
    const comic_background = doc.getElementById("comic_background");
    const dialogueComimBoxText = doc.getElementById("dialogue_box_comic_text");
    const dialogueBox = doc.getElementById("dialogue_box_comic");
    const title = doc.getElementById("dialogue_box_comic_title");
    // show the scene
    canv_game.style.display = "none";
    comic_page.style.display = "inline";
    // load the right scene
    // load image
    comic_background.src = `./assets/${currentChapter.img}`;
    if (story_index === 0) {
      title.innerHTML = currentChapter.title;
      dialogueComimBoxText.innerHTML = currentChapter.discussion[story_index];
    }
    if (story_index > 0) {
      title.innerHTML = "";
      dialogueComimBoxText.innerHTML = currentChapter.discussion[story_index];
    }

    // set the keyboard controls
    if (
      keys.space.pressed &&
      lastKey === " " &&
      antiBouncer > ANTI_BOUNCER_LIMIT
    ) {
      story_index++;
      antiBouncer = 0;
    }
    // set the finish command

    if (story_index === currentChapter.discussion.length) chapterType = IDLE;
    // console.log(comic_page);
    // dialogueBox.style.display = "inline";
  }
  if (chapterType === GAME) {
    const dialogueBox = doc.getElementById("dialogueBox");
    const dialogueBoxText = doc.getElementById("dialogueBoxText");
    const answersBox = doc.getElementById("answerOptionsWrapper");
    // load renderables
    if (!renderables.toRender) renderables = loadRenderables(currentChapter);
    renderables.toRender.forEach((renderable) => {
      renderable.draw();
    });
    const player = renderables.player;
    const boundaries = renderables.boundaries;
    const characters = renderables.characters;
    if (!player.interacting) {
      movementManager(canvas, keys, lastKey, player, boundaries, []);
      canv_game.style.display = "inline";
      comic_page.style.display = "none";

      // interagisci
      if (
        keys.space.pressed &&
        lastKey === " " &&
        antiBouncer > ANTI_BOUNCER_LIMIT
      ) {
        antiBouncer = 0;
        checkForCharacterCollision({ characters, player });
        if (player.interacting) {
          dialogueBox.style.display = "inline";
          const newConvo = interactionConvo(player);
          dialogueBoxText.innerHTML = newConvo.question;
          answersBox.innerHTML = newConvo.answers;
        }
      }
    }

    let interactionEnd = false;
    if (player.interacting) {
      if (
        keys.w.pressed &&
        lastKey === "w" &&
        antiBouncer > ANTI_BOUNCER_LIMIT
      ) {
        const nextAnswer = nextAnswerIndex(player, lastKey);
        player.interactionAsset.answerTemp = nextAnswer;

        answersBox.innerHTML = selectNextOption(player, lastKey);

        antiBouncer = 0;
      }
      if (
        keys.s.pressed &&
        lastKey === "s" &&
        antiBouncer > ANTI_BOUNCER_LIMIT
      ) {
        const nextAnswer = nextAnswerIndex(player, lastKey);
        player.interactionAsset.answerTemp = nextAnswer;
        selectNextOption(player, lastKey);
        answersBox.innerHTML = selectNextOption(player, lastKey);

        antiBouncer = 0;
      }
      if (
        keys.space.pressed &&
        lastKey === " " &&
        antiBouncer > ANTI_BOUNCER_LIMIT
      ) {
        player.interactionAsset.index = getNextConvoIndex(player);
        console.log(player.interactionAsset.index);
        if (player.interactionAsset.index === "END") {
          interactionEnd = true;
          player.interacting = false;
          // break;
        } else {
          const newConvo = interactionConvo(player);
          dialogueBoxText.innerHTML = newConvo.question;
          answersBox.innerHTML = newConvo.answers;
          antiBouncer = 0;
        }
      }
    }
    if (interactionEnd) {
      dialogueBox.style.display = "none";
    }
    // quando vicino ad un altro character, va avanti con un discorso con l'altro character
    // se la discussion ha una sola scelta, con barra si avanza
    // se ne ha due o più serve scegliere
    let chapterEnd;
    if (chapterEnd) {
      renderables = {};
      i++;
      chapterType = IDLE;
    }
  }
}

animate();

window.addEventListener("keydown", (e) => {
  // if (player.isInteracting) {
  //   switch (e.key) {
  //     case " ":
  //       player.interactionAsset.dialogueIndex++;

  //       const { dialogueIndex, dialogue } = player.interactionAsset;
  //       if (dialogueIndex <= dialogue.length - 1) {
  //         document.querySelector("#characterDialogueBox").innerHTML =
  //           player.interactionAsset.dialogue[dialogueIndex];
  //         return;
  //       }

  //       // finish conversation
  //       player.isInteracting = false;
  //       player.interactionAsset.dialogueIndex = 0;
  //       document.querySelector("#characterDialogueBox").style.display = "none";

  //       break;
  //   }
  //   return;
  // }

  switch (e.key) {
    case " ":
      keys.space.pressed = true;
      lastKey = " ";
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
    case " ":
      keys.space.pressed = false;
      break;
  }
});


// game engine
/////////
// 1. chapter  Type === COMIC or GAME or IDLE  or FIGHT 
// 1. COMIC - col botton azione si va avanti per il dialogo. si vede una immagine di sfondo. ogni dialogo puo avere una immagine di sfondo.
// 1. GAME - oggetti con cui interagire e compare un div col dialogo. Una maniera di ottenere uno status in piu dopo aver interagito con certi oggetti (prendi bottiglia, porta bottiglia).Stabilire un ordine di cose da fare. 
// Le interazioni successicve con gli oggetti si possono basare su questo status per cambiare tipo di iterazione.
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

    // set the keyboard controls
    if (
      keys.space.pressed &&
      lastKey === " " &&
      antiBouncer > ANTI_BOUNCER_LIMIT
    ) {
      console.log("ACTION BUTTON PRESSED! story_index was:", story_index);
      story_index++;
      console.log("story_index is now:", story_index);
      antiBouncer = 0;

      // Visual debug - flash the action button
      const actionBtn = document.getElementById("btn-action");
      if (actionBtn) {
        actionBtn.style.background = "red";
        setTimeout(() => {
          actionBtn.style.background = "rgba(255, 255, 255, 0.15)";
        }, 200);
      }
    }

    // Update text after button press logic
    if (story_index === 0) {
      title.innerHTML = currentChapter.title;
      dialogueComimBoxText.innerHTML = currentChapter.discussion[story_index];
    }
    if (story_index > 0) {
      title.innerHTML = "";
      dialogueComimBoxText.innerHTML = currentChapter.discussion[story_index];
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

    // Clear the canvas before drawing
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderables.toRender.forEach((renderable) => {
      renderable.draw();
    });
    const player = renderables.player;
    const boundaries = renderables.boundaries;
    const characters = renderables.characters;
    if (!player.interacting) {
      movementManager(canvas, keys, lastKey, player, boundaries, characters);
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

// Mobile touch controls
function simulateKeyPress(key) {
  switch (key) {
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
}

function simulateKeyRelease(key) {
  switch (key) {
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
}

// Function to scroll text content on mobile - ONLY for comic scenes
function scrollTextContent(direction) {
  console.log('scrollTextContent called with direction:', direction);
  const isMobile = window.innerWidth <= 768;
  console.log('isMobile:', isMobile, 'window width:', window.innerWidth);

  if (!isMobile) return false;

  // Only handle scrolling in comic scenes (image on top, text on bottom)
  const comicDiv = doc.getElementById("comic_div");
  console.log('comicDiv display:', comicDiv ? comicDiv.style.display : 'comicDiv not found');

  // Check if we're in a comic scene (image + text layout)
  if (comicDiv && comicDiv.style.display !== "none") {
    const comicText = doc.getElementById("dialogue_box_comic_text");
    console.log('comicText found:', !!comicText);

    if (comicText) {
      console.log('scrollTop:', comicText.scrollTop, 'scrollHeight:', comicText.scrollHeight, 'clientHeight:', comicText.clientHeight);

      if (direction === 'down') {
        // Check if there's more content to scroll down
        if (comicText.scrollTop < comicText.scrollHeight - comicText.clientHeight) {
          comicText.scrollTop += 40; // Scroll down
          console.log('Scrolled down, new scrollTop:', comicText.scrollTop);
          return true;
        } else {
          console.log('Cannot scroll down - at bottom');
        }
      } else if (direction === 'up') {
        // Check if we can scroll up
        if (comicText.scrollTop > 0) {
          comicText.scrollTop -= 40; // Scroll up
          console.log('Scrolled up, new scrollTop:', comicText.scrollTop);
          return true;
        } else {
          console.log('Cannot scroll up - at top');
        }
      }
    }
  }

  console.log('No scrolling handled - returning false');
  // For game scenes (character movement), don't handle scrolling - let normal controls work
  return false;
}

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Prevent pinch zoom
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});

// Add touch event listeners for mobile controls
document.addEventListener('DOMContentLoaded', () => {
  const mobileButtons = document.querySelectorAll('.dpad-btn, .action-btn');

  mobileButtons.forEach(button => {
    const key = button.getAttribute('data-key');
    let touchStartTime = 0;

    // Handle touch start
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      touchStartTime = Date.now();

      // Safari debugging
      console.log('Touch start on key:', key, 'Safari:', /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

      // Check if we should handle text scrolling instead of normal key input
      console.log('Touch start on key:', key);
      const isMobile = window.innerWidth <= 768;
      if (isMobile && (key === 's' || key === 'w')) {
        console.log('Attempting text scroll for key:', key);
        const direction = key === 's' ? 'down' : 'up';
        const scrollHandled = scrollTextContent(direction);
        console.log('Scroll handled:', scrollHandled);
        if (scrollHandled) {
          console.log('Scroll handled - NOT simulating key press');
          return; // Don't simulate key press if we handled scrolling
        }
      }

      console.log('Simulating key press for:', key);
      // Always allow action button (spacebar) to work for scene progression
      simulateKeyPress(key);
    }, { passive: false });

    // Handle touch end - ensure minimum duration for antiBouncer
    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Ensure minimum touch duration for action button to work with antiBouncer
      const touchDuration = Date.now() - touchStartTime;
      if (key === ' ' && touchDuration < 50) {
        // Wait a bit longer for action button to ensure antiBouncer logic works
        setTimeout(() => {
          simulateKeyRelease(key);
        }, 50 - touchDuration);
      } else {
        simulateKeyRelease(key);
      }
    }, { passive: false });

    // Safari fallback - use click event as backup
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log('Click fallback triggered for key:', key);

      // For Safari, sometimes touch events don't work properly, so use click as backup
      if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
        simulateKeyPress(key);
        setTimeout(() => simulateKeyRelease(key), 100);
      }
    });

    // Handle mouse events for desktop testing
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();

      // Check if we should handle text scrolling instead of normal key input
      const isMobile = window.innerWidth <= 768;
      if (isMobile && (key === 's' || key === 'w')) {
        const direction = key === 's' ? 'down' : 'up';
        const scrollHandled = scrollTextContent(direction);
        if (scrollHandled) {
          return; // Don't simulate key press if we handled scrolling
        }
      }

      // Always allow action button (spacebar) to work for scene progression
      simulateKeyPress(key);
    });

    button.addEventListener('mouseup', (e) => {
      e.preventDefault();
      simulateKeyRelease(key);
    });

    // Prevent context menu on long press
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  });
});

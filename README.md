## Rattuso

A small narrative game prototype that alternates between comic-style story pages and a top‑down playable scene with movement and NPC dialogue.

This README explains how the app boots (starting from `index.html`), how to run it locally, the code structure, how story content and maps are defined, and how to extend the game.

### Quick start

- **Prerequisite**: serve the folder over HTTP (ES modules won't load via file://).
- Using Python 3:
```bash
cd /Users/alfredo/NonBackedUp/Code/rattuso
python3 -m http.server 5173
```
- Open `http://localhost:5173` in your browser.

Tip: Any static server works (Node http-server, VS Code Live Server, etc.).

### Entry point: index.html

`index.html` defines the visible UI and loads the runtime scripts in order.

- Canvas for the playable scene: `#canvas`
- Dialogue box for in‑game interactions: `#dialogueBox`, `#dialogueBoxText`, `#answerOptionsWrapper`
- Comic overlay for story pages: `#comic_div`, `#comic_background`, `#dialogue_box_comic`, `#dialogue_box_comic_title`, `#dialogue_box_comic_text`
- Scripts loaded (in this order):
  - `data/characters.js` (currently placeholder)
  - `data/objects.js` (legacy map data; main collisions are in `data/collisions.js`)
  - `js/utils.js` (movement, collision, dialogue helpers)
  - `classes.js` (Sprite/Boundary, canvas context)
  - `index.js` (main game loop; ES module)

The canvas is fixed at 960×640 CSS pixels; game coordinates are in pixels and tiles are 32×32.

### How the app boots and runs

- `index.js` imports helpers and the `plot` from `data/plot.js` and starts the animation loop with `requestAnimationFrame(animate)`.
- The loop maintains a simple state machine with three states from `js/constants.js`:
  - `IDLE` → pick next chapter from `plot.story`
  - `COMIC` → show comic overlay and advance text on Space
  - `GAME` → render the room, move the player (WASD) and handle NPC interactions
- Comic chapters set `#comic_div` visible and hide the canvas. Game chapters do the opposite.

### Controls

- **W/A/S/D**: move the player while in GAME state
- **Space**:
  - In COMIC: advance to the next line
  - In GAME: interact or advance selected dialogue option

An internal "anti‑bounce" counter throttles repeat processing of key presses.

### Project structure (high level)

- `index.html`: DOM and script wiring for canvas, comic overlay, dialogue UI
- `styles/main.css`: page and UI styling
- `index.js`: main loop, state machine, input listeners
- `classes.js`: `Sprite` (drawing/animation), `Boundary` (collision tiles), canvas context exports
- `js/constants.js`: input state (`keys`) and state constants (`IDLE`, `COMIC`, `GAME`)
- `js/utils.js`: movement, collision checks, dialogue rendering helpers
- `js/onLoad.js`: `loadRenderables(chapter)` loads images, characters, and boundaries for a chapter
- `data/plot.js`: story chapters array (COMIC and GAME), player spawn, NPCs and dialogue trees
- `data/collisions.js`: Tiled map export(s) used to build collision boundaries
- `assets/`: images for backgrounds, sprites and comic pages
- `tiled/`: the original Tiled tileset definitions and `.tmx` map

### Rendering and movement

- `js/onLoad.js` builds renderables for a chapter:
  - Background `Sprite` from `chapter.background`
  - `Boundary` tiles created from the map collision layer (`data/collisions.js`)
  - A `Sprite` for the player using directional spritesheets
  - One `Sprite` per character with an optional `interaction` spec
- In the GAME loop, each renderable’s `draw()` is called every frame. Movement updates the player position by 3 px/step and checks against shifted `Boundary` tiles for collision.

### Story and chapter model (data/plot.js)

The game is driven by `plot.story`, an array of chapters. Two chapter types are supported:

- **COMIC** chapter:
```js
{
  title: "Ogliastra di fuoco",
  type: COMIC,
  img: "d_casa.jpg",            // image under assets/
  discussion: ["line 1", "line 2", ...] // Space to advance
}
```
- **GAME** chapter:
```js
{
  title: "",
  type: GAME,
  background: "casa.png",       // image under assets/
  collisions_name: "home",       // key into data/collisions.js
  player: {
    position: { x: 40, y: 180 },
    name: "Rattuso"
  },
  characters: [
    {
      type: "friend",
      name: "Nieddu",
      direction: "up",           // up|down|left|right
      position: { x: 260, y: 320 },
      interaction: {              // see Dialogue/interaction model below
        type: "discussion",
        discussion: [ /* dialogue nodes */ ]
      }
    }
  ]
}
```

### Dialogue/interaction model

NPC `interaction` objects currently support `type: "discussion"` with a list of dialogue nodes. Each node has:

```js
{
  a: "NPC line",
  b: [
    { option: "Player choice text", next: 1 },
    // next: number → go to that dialogue index; "END" → end interaction
  ]
}
```

At runtime:
- Space confirms the currently selected option.
- W/S moves the selection up/down.
- When `next` resolves to a number, the conversation advances; when it resolves to "END", the dialogue closes.

### Maps, tiles and collisions (Tiled workflow)

- Tile size is 32×32. The current map grid is 30×20 tiles (matching 960×640 canvas).
- Tiled sources live under `tiled/` and are referenced by the `tilesets` list inside `data/collisions.js`.
- `data/collisions.js` exports a `collisions` object with one or more maps by name (e.g., `home`). Each map contains `layers: [...]`.
- `js/onLoad.js` builds collision `Boundary` tiles from the LAST layer of a map (`collisions[mapName].layers[...last].data`). Ensure your collision/obstacle layer is last in the layer order in your Tiled export.

To add or update a map:
1. Edit your map in Tiled (tile width/height: 32, map size: 30×20 for full‑screen fit).
2. Make sure your obstacle/collision layer is placed last.
3. Export/copy the map data into `data/collisions.js` as a new key under `collisions` (e.g., `office`, `street`).
4. Reference the new key from a GAME chapter via `collisions_name`.
5. Add a background image to `assets/` and set `background` in the chapter.

### Sprites and assets

- Player spritesheets live under `assets/` (`playerUp.png`, `playerDown.png`, `playerLeft.png`, `playerRight.png`). The `Sprite` class scales frames with `scale: 0.5` and animates with `frames.max = 4` and `frames.hold = 10`.
- Background images (e.g., `casa.png`) are drawn as a single image at 0,0.
- Comic pages use images under `assets/` and are applied to `#comic_background`.

### Extending the game

- Add a COMIC page: push a new COMIC chapter into `plot.story` with `img` and `discussion` lines.
- Add a new room/scene: create a GAME chapter with `background`, `collisions_name`, `player` spawn, and `characters`.
- Add an NPC: append to the chapter’s `characters` with position and `interaction`.
- Add dialogue branches: in `interaction.discussion`, set `next` to a numeric index or to `"END"` when done.

### UI customization

- The in‑game dialogue DOM is defined in `index.html` under `#dialogueBox`.
- The comic overlay DOM is `#comic_div` with `#dialogue_box_comic` and title/text spans.
- Style these in `styles/main.css` or inline (as currently in `index.html`).

### Known limitations / notes

- Input handling is global; there’s no per‑state listener attach/detach yet.
- Boundaries are currently built from the last Tiled layer only; adjust `loadCollisions` if you need a different source layer.
- Character sprites currently reuse the player spritesheets.

### Contributing / code conventions

- Use clear, descriptive names. Favor early returns and shallow nesting.
- Keep tiles 32×32 and maps 30×20 unless you update canvas size and movement bounds accordingly.
- Keep COMIC and GAME rendering concerns separate as in the current state machine.
- When adding chapters, prefer extending `data/plot.js` rather than hard‑coding logic.
- Keep the obstacle layer last in Tiled exports to match `loadCollisions` behavior.

### Where to look (by task)

- Change story order or content: `data/plot.js`
- Add a new room’s collisions: `data/collisions.js` (and `tiled/` sources)
- Add characters or dialogue: `data/plot.js` within the GAME chapter’s `characters`
- Adjust movement/collision speeds: `js/utils.js` (movement step = 3)
- Tune sprite animation: `classes.js` (`Sprite.frames`, `frames.hold`, `scale`)
- Tweak UI: `index.html`, `styles/main.css`

---
If you need help adding a specific feature (e.g., multiple maps in a single chapter, scene transitions, or persistent flags), open an issue or leave a note in `data/plot.js` near the chapter you’re extending.

const startMap = (level) => {};

const startStoryDrawing = (level) => {};

const plot = {
  title: "Rattuso",
  version: "0.1",
  story: [
    {
      title: "",
      type: "comic",
      img: "url",
      discussion: [
        "Si definisce rattuso in lingua napoletana (più delle volte in volgare) la figura di uomo di mezza età che cerca di mettersi in bella mostra nei confronti di ragazze poco più che maggiorenni. Il “Rattuso” nella società napoletana non viene accostato alla figura del pedofilo o dello stupratore, bensì viene più che altro visto come una figura penosa e marginale.",
        "Porco Dighel.",
        "Questa è l'unica eredità che mi ha lasciato quel terrone di mio padre: un cognome di merda.",
        "Per il resto altro non sono che un pezzo di carne di quarantasei anni sull'orlo di una crisi di mezz'età a servizio dello Stato. Mi volto e mi rivolto tra le lenzuola sgualcite del mio letto. Cazzo, anche stanotte non si è chiuso occhio. Da quando hanno ritirato dal commercio la benzodiazepine la mia migliore amica è tornata ad essere Jack. Eccola lì: mi guarda con espressione beffarda, col suo ghigno color caramello sul fondo della bottiglia e quel toppino nero marchiato old brand n.7",
      ],
    },
    {
      title: "",
      type: "game",
      img: "url",
      characters: [
        { type: "player", url: "", position: { x: 0, y: 0 }, interactions: [] },
        {
          type: "friend",
          url: "",
          position: { x: 0, y: 0 },
          interactions: [
            {
              position: { x: 0, y: 0 },
              discussion: [
                {
                  a: "",
                  b: [
                    { option: "", next: 1 },
                    { option: "", next: 1 },
                  ],
                },
                { a: "", b: "", next: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// animate(){
// read and launch story chapter
// if(state = idle){
//     loadListeners
// for(i<iEnd){
//     if(comic) launch comic (chapter[i])
//     if(game) launch game (chapter[i])
// }}

// if(state = runComic){
//     removeIdleListeners
//     loadImage
//     loadListenerComic
//     if(comicEnd) {
//         i++
//         removeListeners
//         state=idle
//     }
// }
// if(state = runGame){
//     loadGame
//     loadListeners
//     if(gameEnd) {
//         i++
//         removeListeners
//         state=idle
//     }

// }
// }

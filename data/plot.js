import { IDLE, COMIC, GAME } from "../js/constants.js";
export const plot = {
  title: "Rattuso",
  version: "0.1",
  story: [
    // Chapter 1: Opening comic scene - COMMENTED OUT FOR DEBUGGING
    // Uncomment this section to enable the intro comic scene
    /*
    {
      title: "Ogliastra di fuoco", // Chapter title: "Fire of Ogliastra"
      type: COMIC, // Comic scene type - image background with text overlay
      img: "d_casa.jpg", // Background image for the comic scene
      discussion: [ // Array of text segments that advance on user input
        "Si definisce rattuso in lingua napoletana (più delle volte in volgare) la figura di uomo di mezza età che cerca di mettersi in bella mostra nei confronti di ragazze poco più che maggiorenni. Il "Rattuso" nella società napoletana non viene accostato alla figura del pedofilo o dello stupratore, bensì viene più che altro visto come una figura penosa e marginale.",
        "Porco Dighel.",
        "Questa è l'unica eredità che mi ha lasciato quel terrone di mio padre: un cognome di merda.",
        "Per il resto altro non sono che un pezzo di carne di quarantasei anni sull'orlo di una crisi di mezz'età a servizio dello Stato.",
        "...forse oggi non mi lavo; rimango così, come il tenente Willard di Apocalypse Now. Che figata.",
        "Ma questa non è Saigon.",
        "Jerzu, merda...",
        "Mi avevano promesso che nel trasferimento in Sardegna non ci sarebbe stato niente di punitivo.",
        "Avevo bisogno di staccare da Milano, questo sì. Avevo bisogno di liberare la testa da quella brutta faccenda, fare ordine nei pensieri e magari, perché no, conoscere qualche bimba...",
        "KNOCK KNOCK...",
      ],
    },
    */
    // Chapter 2: First gameplay scene - Inside the house
    // Interactive game scene where player can move around and interact with NPCs.
    // Uses the camera/viewport system for mobile-friendly movement.
    {
      title: "", // No title for game scenes
      type: GAME, // Interactive gameplay scene
      background: "casa.png", // Background map image
      collisions_name: "home", // References collision data for boundaries
      player: {
        position: { x: 40, y: 180 }, // Starting position in world coordinates
        interactions: [], // Player-specific interactions (currently empty)
        name: "Rattuso", // Player character name
      },
      characters: [ // NPCs in this scene
        {
          type: "friend", // Character type/relationship
          name: "Nieddu", // Character name
          url: "", // Character sprite URL (currently empty)
          direction: "up", // Which direction the character is facing initially
          position: { x: 260, y: 320 }, // Character position in world coordinates
          interactions: {
            default:
              { // Defines how player can interact with this character
              type: "discussion", // Interaction type - branching dialogue
              discussion: [ // Array of dialogue nodes
                {
                  a: "- Ispettore, Nieddu sono!",
                  b: [
                    {
                      option: "- Non è giornata Nieddu, passa più tardi...",
                      next: 1,
                    },
                    {
                      option: "- Dimmi che mi hai portato un caffè Nieddu",
                      state: "caffe",
                      next: "END",
                    },
                  ],
                },
                {
                  a: "Abbiamo un'emergenza Ispettore!", // Character's response
                  b: [{ option: "-Che palle...", next: "END" }], // Single response option
                },
              ],
            },
            caffe:
              { // Defines how player can interact with this character
              type: "discussion", // Interaction type - branching dialogue
              discussion: [ // Array of dialogue nodes
                {
                  a: "- Ispettore, Nieddu sono!",
                  b: [
                    {
                      option: "- Non è giornata Nieddu, passa più tardi...",
                      next: 1,
                    },
                    {
                      option: "- Dimmi che mi hai portato un caffè Nieddu",
                      state: "caffe",
                      next: "END",
                    },
                  ],
                },
                {
                  a: "Abbiamo un'emergenza Ispettore!", // Character's response
                  b: [{ option: "-Che palle...", next: "END" }], // Single response option
                },
              ],
            }
          },
        },
      ],
    },
  ],
};

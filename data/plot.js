import { IDLE, COMIC, GAME } from "../js/constants.js";
export const plot = {
  title: "Rattuso",
  version: "0.1",
  story: [
    {
      title: "Ogliastra di fuoco",
      type: COMIC,
      img: "d_casa.jpg",
      discussion: [
        "Si definisce rattuso in lingua napoletana (più delle volte in volgare) la figura di uomo di mezza età che cerca di mettersi in bella mostra nei confronti di ragazze poco più che maggiorenni. Il “Rattuso” nella società napoletana non viene accostato alla figura del pedofilo o dello stupratore, bensì viene più che altro visto come una figura penosa e marginale.",
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
    {
      title: "",
      type: GAME,
      background: "casa.png",
      collisions_name: "home",
      player: {
        position: { x: 40, y: 180 },
        interactions: [],
        name: "Rattuso",
      },
      characters: [
        {
          type: "friend",
          name: "Nieddu",
          url: "",
          direction: "up",
          position: { x: 260, y: 320 },
          interaction: {
            type: "discussion",
            discussion: [
              {
                a: "- Ispettore, Nieddu sono!",
                b: [
                  {
                    option: "- Non è giornata Nieddu, passa più tardi...",
                    next: 1,
                  },
                  {
                    option: "- Dimmi che mi hai portato un caffè Nieddu",
                    next: "END",
                  },
                ],
              },
              {
                a: "Abbiamo un'emergenza Ispettore!",
                b: [{ option: "-Che palle...", next: "END" }],
              },
            ],
          },
        },
      ],
    },
  ],
};

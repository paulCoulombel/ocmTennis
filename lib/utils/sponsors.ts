// cspell: disable
const classNames = [
  { className: "absolute left-[2%] rotate-[-5deg]", top: 10 },
  { className: "absolute right-[6%] rotate-[-7deg]", top: 40 },
  { className: "absolute left-[10%] rotate-[8deg]", top: 5 },
  { className: "absolute right-[14%] rotate-[3deg]", top: 32 },
  { className: "absolute left-[18%] rotate-[-12deg]", top: 16 },
  { className: "absolute right-[22%] rotate-[9deg]", top: 20 },
  { className: "absolute left-[26%] rotate-[-6deg]", top: 48 },
  { className: "absolute right-[30%] rotate-[15deg]", top: 8 },
  { className: "absolute left-[34%] rotate-[-4deg]", top: 36 },
  { className: "absolute right-[38%] rotate-[7deg]", top: 12 },
  { className: "absolute left-[42%] rotate-[-10deg]", top: 44 },
  { className: "absolute right-[46%] rotate-[11deg]", top: 24 },
  { className: "absolute left-[50%] rotate-[-8deg]", top: 6 },
  { className: "absolute right-[54%] rotate-[6deg]", top: 52 },
  { className: "absolute left-[58%] rotate-[-14deg]", top: 14 },
  { className: "absolute right-[62%] rotate-[4deg]", top: 28 },
  { className: "absolute left-[66%] rotate-[-9deg]", top: 56 },
  { className: "absolute right-[70%] rotate-[13deg]", top: 18 },
  { className: "absolute left-[74%] rotate-[-11deg]", top: 42 },
  { className: "absolute right-[78%] rotate-[8deg]", top: 26 },
  { className: "absolute right-[90%] rotate-[-7deg]", top: 50 },
];
const sponsors = [
  {
    title: "Agromat",
    image: "/Agromat.jpg",
  },
  {
    title: "AQS",
    image: "/AQS.png",
  },
  {
    title: "AS Auto Sécurité",
    image: "/ASAutoSecurite.png",
  },
  {
    title: "Atout Confort",
    image: "/atoutConfort.png",
  },
  {
    title: "Bar des Sports",
    image: "/BarDesSports.png",
  },
  {
    title: "BreizhTic",
    image: "/BreizhTic.png",
  },
  {
    title: "BREKILIEN AUTOMOBILES",
    image: "/BREKILIEN_AUTOMOBILES.png",
  },
  {
    title: "Consilio Paysage",
    image: "/ConsilioPaysage.png",
  },
  {
    title: "CouleursDuVignoble",
    image: "/CouleursDuVignoble.png",
  },
  {
    title: "Ferté Pizza",
    image: "/FertePizza.png",
  },
  {
    title: "G20",
    image: "/G20.jpg",
  },
  {
    title: "GARAGE CECILIEN",
    image: "/GARAGE_CECILIEN.png",
  },
  {
    title: "GOdentaire",
    image: "/GOdentaire.png",
  },
  {
    title: "Graine des délices",
    image: "/GraineDesDelices.png",
  },
  {
    title: "Intermarché",
    image: "/Intermarche.png",
  },
  {
    title: "JO-DECO",
    image: "/JO-DECO.jpg",
  },
  {
    title: "La Française Immobilière",
    image: "/laFrancaiseImmobiliere.png",
  },
  {
    title: "MARMOL AXA",
    image: "/MARMOL_AXA.png",
  },
  {
    title: "MILON ISOLATION",
    image: "/MILON_ISOLATION.png",
  },
  {
    title: "Musée 39-45",
    image: "/Musee_39-45.png",
  },
  {
    title: "Qualidiag",
    image: "/Qualidiag.png",
  },
];

export const getSponsors = ({
  topFromDocument,
}: {
  topFromDocument: number;
}) => {
  const classNamesShuffled = [...classNames].sort(() => 0.5 - Math.random());
  return sponsors
    .sort(() => 0.5 - Math.random())
    .map((sponsor, index) => ({
      ...sponsor,
      className: classNamesShuffled[index].className,
      style: {
        top: `${classNamesShuffled[index].top + topFromDocument}px`,
      },
    }));
};

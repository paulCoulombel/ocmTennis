export const replaceTeamName = (name: string) => {
  return name
    .replace("TENNIS CLUB DE ", "")
    .replace("TENNIS CLUB ", "")
    .replace("TC ", "")
    .replace("T.C. ", "")
    .replace("T.C ", "")
    .replace("ASSOCIATION ", "")
    .replace("A.S. ", "")
    .replace("A.S ", "")
    .replace("AS ", "")
    .replace("TENNIS ", "");
};

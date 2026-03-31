export const replaceTeamName = (name: string) => {
  return name
    .replace('TENNIS CLUB DE ', '')
    .replace('TENNIS CLUB ', '')
    .replace('TC ', '')
    .replace('T.C. ', '')
    .replace('T.C ', '')
    .replace('ASSOCIATION ', '')
    .replace('A.S. ', '')
    .replace('A.S ', '')
    .replace('AS ', '')
    .replace('JA ', '')
    .replace('TENNIS ', '')
    .replace('CHARTRES BRETAGNE ESPERANCE', 'CHARTRES BRETAGNE')
    .replace('BADMINTON ', '')
    .replace('EMERAUDE DINARD', 'DINARD') // cspell: disable-line
    .replace("SAINT LUNAIRE COTE D'EMERAUDE", 'SAINT LUNAIRE') // cspell: disable-line
    .replace('SAINT JACQUES DE LA LANDE', 'SAINT JACQUES') // cspell: disable-line
}

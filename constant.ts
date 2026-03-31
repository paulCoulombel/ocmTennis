// cspell: disable
export const categoryNicknames = {
  SH35: 'Hommes +35 ans',
  SH: 'Seniors Hommes',
  SD: 'Seniors Dames',
  'F 11/13': 'Filles 11/13 ans',
  'F 14/18': 'Filles 14/18 ans',
  'F/G 8/10': 'Mixte (F/G) 8/10 ans',
  'G 11/12': 'Garçons 11/12 ans',
  'G 13/14': 'Garçons 13/14 ans',
  'G 15/16': 'Garçons 15/16 ans',
  'G 17/18': 'Garçons 17/18 ans'
} as const
export const MATCH_FORMATS = {
  1: ['3 sets à 6 jeux', 'Jeu Décisif à 6/6'],
  2: ['2 sets à 6 jeux', 'Jeu Décisif à 6/6', '3ème set = SJD à 10 points'],
  3: [
    '2 sets à 4 jeux',
    'Point décisif à 40A',
    'Jeu Décisif à 4/4',
    '3ème set = SJD à 10 points'
  ],
  4: [
    '2 sets à 6 jeux',
    'Point décisif à 40A',
    'Jeu Décisif à 6/6',
    '3ème set = SJD à 10 points'
  ],
  5: [
    '2 sets à 3 jeux',
    'Point décisif à 40A',
    'Jeu Décisif à 2/2',
    '3ème set = SJD à 10 points'
  ],
  6: [
    '2 sets à 4 jeux',
    'Point décisif à 40A',
    'Jeu Décisif à 3/3',
    '3ème set = SJD à 10 points'
  ],
  7: [
    '2 sets à 5 jeux',
    'Point décisif à 40A',
    'Jeu Décisif à 4/4',
    '3ème set = SJD à 10 points'
  ]
} as const

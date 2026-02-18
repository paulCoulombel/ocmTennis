import { format, isValid, Locale } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

export const addUnit = (value: string | number, unit: string) => {
  const stringifiedValue = typeof value === 'string' ? value : value.toString()
  return stringifiedValue + unit
}

export const formatMinsIntoHours = (mins: number) => {
  if (mins < 60) {
    return `${mins} min`
  }
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  return `${hours}h${minutes === 0 ? '' : ` ${minutes}`}`
}

export const formatRentabilityPeriod = (
  { years, months }: { years: number; months: number },
  locale: string = 'fr',
) => {
  let returnString = ''
  switch (locale) {
    case 'fr':
      if (years > 0) {
        returnString += `${years} an${years > 1 ? 's' : ''}`
      }
      if (months > 0) {
        returnString += years > 0 ? ' et ' : ''
        // cspell:disable-next-line
        returnString += `${months} mois`
      } else if (months < 0 && years < 0) {
        // cspell:disable-next-line
        returnString = 'supérieure à 20 ans'
      }
      return returnString
    default:
      if (years > 0) {
        returnString += `${years} an${years > 1 ? 's' : ''}`
      }
      if (months > 0) {
        returnString += years > 0 ? ' et ' : ''
        // cspell:disable-next-line
        returnString += `${months} mois`
      } else {
        returnString = 'more than 20 years'
      }
      return returnString
  }
}

/**
 * Rounds a number to a given precision
 * @param value
 * @param precision
 * @returns The value rounded to the precision
 * @example customRound(1.2345, 2) => 1.23
 */
export const customRoundFloat = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Rounds a number to a given precision
 * @param value
 * @param precision
 * @returns The value rounded to the precision
 * @example customRound(127.2, 0) => 127
 * @example customRound(127.2, 1) => 130
 * @example customRound(127.2, 2) => 100
 */
export const customRoundUnit = (value: number, precision: number) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value / multiplier) * multiplier
}

export const formatDate = (
  dateAsString: string,
  pattern = 'dd/MM/yy HH:mm:ss',
  locale: string = 'fr',
) => {
  const date = new Date(dateAsString)
  if (!isValid(date)) return dateAsString

  const localeMap = {
    fr: fr,
  } as const satisfies Record<string, Locale>
  if (!Array.from(Object.keys(localeMap)).includes(locale)) {
    locale = 'fr'
  }
  //cspell:ignore dateFnsLocale
  const dateFnsLocale = localeMap[locale as keyof typeof localeMap]
  return format(date, pattern, {
    locale: dateFnsLocale,
  })
}

export const capitalizeString = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number)
}

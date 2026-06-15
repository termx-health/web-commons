import {FormatWidth, getLocaleDateFormat, getLocaleTimeFormat} from '@angular/common';
import {LIB_CONTEXT} from '../../core-util.context';

export function getLocale(): string {
  return LIB_CONTEXT.locale;
}

// https://angular.io/api/common/DatePipe#custom-format-options

/**
 * Short, all-numeric date format (e.g. en-GB -> dd/MM/yyyy, en-US -> M/d/yyyy).
 * Used for date *inputs*, where the value is typed and must be easy to enter/parse.
 */
export function getDateFormat(locale: string = getLocale()): string {
  const localeFormat = getLocaleDateFormat(locale, FormatWidth.Short);
  return localeFormat.replace('yy', 'yyyy');
}

/**
 * Medium date format with an abbreviated month name (e.g. en-GB -> d MMM y -> 15 Jun 2026).
 * Used for *displaying* dates: the worded month removes the day/month-order ambiguity between
 * locales (e.g. 06/07 reads as different dates in en-GB vs en-US).
 */
export function getDateDisplayFormat(locale: string = getLocale()): string {
  return getLocaleDateFormat(locale, FormatWidth.Medium);
}

export function getTimeFormat(locale: string = getLocale()): string {
  return getLocaleTimeFormat(locale, FormatWidth.Short);
}

/** Input date-time format: short numeric date + short time. */
export function getDateTimeFormat(locale: string = getLocale()): string {
  return getDateFormat(locale) + ' ' + getTimeFormat(locale);
}

/** Display date-time format: worded-month date + short time. */
export function getDateTimeDisplayFormat(locale: string = getLocale()): string {
  return getDateDisplayFormat(locale) + ' ' + getTimeFormat(locale);
}


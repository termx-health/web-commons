import {Pipe, PipeTransform} from '@angular/core';
import {getDateTimeDisplayFormat} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {LocalDatePipe} from './local-date.pipe';

@Pipe({name: 'localDateTime', pure: false})
export class LocalDateTimePipe extends LocalDatePipe implements PipeTransform {
  public override transform(date?: Date | string, format?: string, locale: string = LIB_CONTEXT.locale): string | undefined {
    return super.transform(date, format || getDateTimeDisplayFormat(locale), locale);
  }
}

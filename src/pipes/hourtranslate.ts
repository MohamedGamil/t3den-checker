import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'hourtranslate',
})
export class HourtranslatePipe implements PipeTransform {
  
  private t: {am: string, pm: string} = {am: '', pm: ''};

  constructor(private translate: TranslateService) {
    this.translate.get(['AM', 'PM']).subscribe(vals => {
      this.t.am = vals.AM;
      this.t.pm = vals.PM;
    });
  }

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any = false, ...args) {
  	if ( !! value ) {
      let v      = (''+value).toLowerCase();
      let hour   = v.replace(/(am|pm)/g, '');
      let period = v.indexOf('am') > -1 ? 'am' : 'pm';

      if ( v.indexOf('am') > -1 ||  v.indexOf('pm') > -1 ) {
        return hour + ' ' + this.t[period];
      }
  	}

  	return value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'utm',
})
export class UtmParamsPipe implements PipeTransform {
  constructor() {}

  private _defaults: any = {
    utm_source: 't3den',
    utm_medium: 'app',
    utm_campaign: 'price-checker'
  };
  
  transform(
    value: any = false, 
    utm_source?: any, 
    utm_medium?: any, 
    utm_campaign?: any
  ) {
  	if ( !! value ) {
      let url: string = '';
      let params: any = {
        utm_campaign: !! utm_campaign ? utm_campaign : this._defaults.utm_campaign,
        utm_source: !! utm_source ? utm_source : this._defaults.utm_source,
        utm_medium: !! utm_medium ? utm_medium : this._defaults.utm_medium,
      };

      url  = value;
      url += ( url.indexOf('?') > -1 ? '&' : '?' );
      url += `utm_source=${params.utm_source}&`;
      url += `utm_medium=${params.utm_medium}&`;
      url += `utm_campaign=${params.utm_campaign}`;

      // console.warn('------- URL: ', url, value, arguments);
    	return url;
  	}

  	return value;
  }

  private _addParams() {

  }
}

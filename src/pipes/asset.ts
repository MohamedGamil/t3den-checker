import { Pipe, PipeTransform } from '@angular/core';
import { Api } from '../providers/api';


@Pipe({
  name: 'asset',
})
export class AssetPipe implements PipeTransform {
  
  constructor(public api: Api) {

  }

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any = false, ...args) {
  	if ( !! value ) {
  		if ( value.image ) {
  			value = value.image;
  		}
  		
    	return this.api.asset(value);
  	}

  	return value;
  }
}

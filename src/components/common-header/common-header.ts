import { Component, Input } from '@angular/core';
import { Helper } from '../../providers/helper';


/**
 * Generated class for the CommonHeaderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'common-header',
  templateUrl: 'common-header.html'
})
export class CommonHeaderComponent {
  @Input('pageTitle') pageTitle: string;
  @Input('menuToggle') menuToggle: boolean = true;
  @Input('borderBottom') bBottom: boolean  = true;
  @Input('logo') logo: boolean             = true;
  @Input('hero') hero: boolean             = false;

  constructor( private helper: Helper ) {
    console.log('Hello CommonHeaderComponent Component');
  }
  
  ngAfterViewInit() {
    // console.info(this.menuToggle);
  }

  ngDoCheck() {
    // console.warn('------', this.helper.menuDirection);
  }
}

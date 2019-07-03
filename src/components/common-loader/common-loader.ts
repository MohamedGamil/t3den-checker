import { Component, Input } from '@angular/core';


/**
 * Generated class for the CommonLoaderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'common-loader',
  templateUrl: 'common-loader.html'
})
export class CommonLoaderComponent {
  @Input('when') when: boolean = false;
  @Input('bar') isBar: boolean = false;

  constructor() {
    console.log('Hello CommonLoaderComponent Component');
  }
}

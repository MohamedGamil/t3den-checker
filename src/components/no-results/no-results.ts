import { Component, Input } from '@angular/core';
import { Helper } from '../../providers/helper';


/**
 * Generated class for the NoResultsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'no-results',
  templateUrl: 'no-results.html'
})
export class NoResultsComponent {
  @Input('data') data: any[]      = [];
  @Input('logo') logo: boolean    = true;
  @Input('phrase') phrase: string = null;
  private visible: boolean        = false;

  constructor( private helper: Helper ) {
    console.log('Hello NoResultsComponent Component');
  }

  ngDoCheck() {
    if ( typeof(this.data.length) != 'undefined' ) {
      this.visible = (this.data.length === 0);
    }
  }
}

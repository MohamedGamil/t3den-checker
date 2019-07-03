import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Helper } from '../../providers/providers';


/**
 * Generated class for the PulsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pulse',
  templateUrl: 'pulse.html',
})
export class PulsePage {

  constructor(
    public helper: Helper, 
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulsePage');
  }

  ionViewDidEnter() {
    this.helper.disableMenu();
  }

  ionViewDidLeave() {
    this.helper.enableMenu();
  }
}

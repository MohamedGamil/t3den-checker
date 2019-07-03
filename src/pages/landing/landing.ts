import { animate, Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as ROUTES from '../pages';


/**
 * Landing Page
 */
@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone
  ) {
  }

  ionViewDidEnter() {
    this.redirect();
  }

  redirect() {
    setTimeout(() => {
      this.navCtrl.setRoot(ROUTES.Checker);
    }, 2000);
  }
}

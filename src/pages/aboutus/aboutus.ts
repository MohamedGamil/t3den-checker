import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController } from 'ionic-angular';
import { Api } from '../../providers/api';
import { Helper } from '../../providers/helper';
import { Util } from '../../providers/util';
import { UtmParamsPipe } from '../../pipes/utm-params';
import * as ROUTES from '../pages';


/**
 * Generated class for the AboutusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {
  currentPage: any   = {
    title: ''
  };

  isPending: boolean = false;

  constructor(
    public util: Util,
    public navCtrl: NavController,
    public navParams: NavParams,
    public helper: Helper,
    public api: Api,
    public view: ViewController,
    public menu: MenuController
  ) {
  }

  ionViewDidEnter() {
    this.util.adBanner();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');

    this.util.initGoogleAnalytics().then(() => {
      this.util.gaTrack('About Page');
    });
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Settings, Coins, Util } from '../../providers/providers';


/**
 * Generated class for the CheckerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checker',
  templateUrl: 'checker.html',
})
export class CheckerPage {
  @ViewChild('slides') slides: ElementRef;
  @ViewChild('navSlides') navSlides: ElementRef;

  private loading: boolean = true;
  private items: any[]     = [];
  private active: number   = 0;

  constructor(
    public util: Util, 
    public coins: Coins, 
    public events: Events, 
    public settings: Settings, 
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.items = [
      { 
        currency: 'BTC',
        icon: 'BTC-alt'
      },
      { 
        currency: 'ETH',
        icon: 'ETH-alt'
      },
      { 
        currency: 'LTC',
        icon: 'LTC-alt'
      },
    ];
  }

  ionViewDidLoad() {
    // this.events.subscribe('bar:loading', () => {
    //   this.loading = true;
    // });

    // this.events.subscribe('bar:done', () => {
    //   this.loading = false;
    // });

    this.util.initGoogleAnalytics().then(() => {
        this.util.gaTrack( 'Price Checker Page' );
    }, err => console.warn(err));
  }

  ionViewDidEnter() {
    // console.warn('-- Slides', this.slides);
    // console.warn('-- Nav Slides', this.navSlides);
    this.initSliders();
    this.util.adBanner();
  }

  initSliders() {
    if ( this.navSlides && this.navSlides['lockSwipes'] ) {
      this.navSlides['lockSwipes'](true);
    }

    this.settings.load().then(settings => {
      this.slideTo(settings.defaultCurrency);
    });
  }

  updateActive(event) {
    // console.warn(event);
    this.active = this.slides['getActiveIndex']();
    this.forceQuery();
  }

  slideTo(name) {
    let index = this.getIndex(name);

    if ( this.slides && this.slides['slideTo'] && index > -1 ) {
      this.active = index;
      this.slides['slideTo'](index);
    }
  }

  forceQuery() {
    if ( this.slides['_slides'] && this.slides['_slides'][this.active] ) {
      this.events.publish( `pricewidget:${this.slides['_slides'][this.active].classList[0]}` );
    }
  }

  getCoin(name) {
    return this.coins.getSupportedCoin(name);
  }

  getIndex(name) {
    return this.coins.supportedCoins().indexOf(name);
  }
}

import { Component, Input, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Helper, Coins, Settings, Util } from '../../providers/providers';
import * as ROUTES from '../../pages/pages';


/**
 * Generated class for the PriceWidgetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'price-widget',
  templateUrl: 'price-widget.html'
})
export class PriceWidgetComponent {
  @Input('currency') currency: string = 'BTC';
  @Input('ticker') ticker: boolean    = true;

  private _cssIconClass: any  = {};
  private _settings: any      = {};
  private _dist: string       = 'USD';
  private _localFiat: string  = 'USD';
  private _delimiter: string  = '';
  private _sInterval: number  = 0;
  private _period: number     = 1;
  private _coinBase: number   = 1;
  private _coinValue: number  = 0;
  private _coinResult: number = 0;
  private _busy: boolean      = false;
  private _ready: boolean     = false;
  private _canToast: boolean  = false;
  private _evPrefix: string   = 'pricewidget:';

  static _hasInitedInterval   = false;
  static _intervalKey         = 0;

  constructor(
    private translate: TranslateService,
    private modal: ModalController,
    private alert: AlertController,
    private events: Events,
    private nav: NavController,
    private params: NavParams,
    private zone: NgZone,
    private settings: Settings,
    private util: Util,
    private coins: Coins,
    private helper: Helper
  ) {
    console.log('Hello PriceWidgetComponent Component');
  }

  ngAfterViewInit() {
    for ( let coin of this.coins.supportedCoins(true) ) {
      this._cssIconClass[coin.value] = coin.icon;
    }
    
    this.initInterval();
    this.syncSettings()
      .then(() => {
        this._dist = this._localFiat;
        this.query(true);
      });

    this.util.debounce(() => {
        this.syncSettings(true);
      }, 
      4000)
      .call(null);

    this.events.subscribe(
      this.eventTopic,
      () => this.query(true)
    );
  }

  ngOnDestroy() {
    this.resetInterval();
  }

  ngDoCheck() {
    this.currency = this.currency.toUpperCase();
  }

  initInterval() {
    if ( !! PriceWidgetComponent._hasInitedInterval ) {
      return;
    }

    setTimeout(() => {
      this.zone.run(() => this._canToast = true);
    }, 20000);

    PriceWidgetComponent._hasInitedInterval = true;
    PriceWidgetComponent._intervalKey       = setInterval(() => 
    {
      this.query();
      // console.warn(`-- INTERVAL #${PriceWidgetComponent._intervalKey} WILL COMMENCE NOW`);
    }, this._period * 60 * 1000);

    // console.warn(`-- INIT INTERVAL #${PriceWidgetComponent._intervalKey}  @ ${this._period} mins.`);
  }

  resetInterval() {
    // console.warn(`-- INTERVAL #${PriceWidgetComponent._intervalKey} WILL BE CLEARED.`);
    
    clearInterval(this._sInterval);
    this._sInterval = 0;
    
    clearInterval(
      PriceWidgetComponent._intervalKey
    );
    PriceWidgetComponent._intervalKey = 0;

    // console.warn('---- DONE');
  }

  query( forceQuery: boolean = false ) {
    if ( ! forceQuery && (this._busy || ! this.ticker) ) {
      return;
    }

    this._ready = false;
    this._busy  = true;

    this.coins.query(this.currency, this._dist)
    .then(res => {
      this._ready     = true;
      this._busy      = false;
      this._coinValue = res.value;
    })
    .catch(() => {
      this._ready = true;
      this._busy = false;

      if (this._canToast) {
        this.helper.showToast(this.translate.instant('TICKER_ERROR'), '1500', 'bottom');
      }
      // this.util.debounce(() => {
      // }, 1000)
      // .call(null);
    });
  }

  selectDistCurrency() {
    let curr  = this.coins.allCurrencies();
    let alert = this.alert.create();

    alert.setTitle(
      this.translate.instant('SELECT_FIAT_CURRENCY')
    );

    for( let c in curr ) {
      let C = curr[c];
      let l = (this.helper.lang == 'ar' ? C.country_ar : C.country);
      
      alert.addInput({
        type: 'radio',
        label: `${c} - ${l}`,
        value: c,
        checked: this._dist === c
      });
    }

    alert.addButton({
      text: this.translate.instant('CANCEL'),
      cssClass: 'alert-btn-cancel'
    });

    // if ( this._dist != this._localFiat ) {
    //   alert.addButton({
    //     text: this._localFiat,
    //     cssClass: 'alert-btn-ok',
    //     handler: () => {
    //       this._dist = this._localFiat;
    //       this.query();
    //     }
    //   });
    // }

    alert.addButton({
      text: this.translate.instant('OK'),
      cssClass: 'alert-btn-ok',
      handler: curr => {
        this._dist = curr;
        this.query();
        // this.settings.setValue('localCurrency', curr);
      }
    });

    alert.present();
  }

  syncSettings(doRecheck?: boolean) {
    let driver = this.settings.load();
    let update = (setts) => {
      // console.warn('---- SETTS', setts);
      let oldDist     = this._localFiat;
      this._period    = setts.updateInterval;
      this._localFiat = setts.localCurrency;
      this._delimiter = setts.numbersFormat;

      if ( this._localFiat !== oldDist ) {
        this._dist = this._localFiat;
        this.query(true);
      }
    };

    if ( !! doRecheck ) {
      this._sInterval = setInterval(() => {
          this.settings.load()
          .then(setts => {
            update(setts);
          });
      }, 6 * 1000);
    }
    else {
      return driver
      .then(setts => {
        update(setts);
      });
    }
  }

  formatResult( result: any ): string {
    let delimiter = this._delimiter;
    let delChar   = '';
    let parts     = [];
    let separated = [];
    let formatted = '';
        formatted = ('' + result).toLowerCase();
        parts     = formatted.split('.');
        separated = parts[0].split('').reverse();
    
    if ( delimiter == 'comma' ) {
      delChar = ',';
    }
    else if ( delimiter == 'dots' ) {
      delChar = '.';
    }

    let chars = [];
    separated.forEach((char, idx) => {
      if ( (idx % 3) == 0  && idx > 0 ) {
        chars.push(delChar);
      }

      chars.push(char);
    });

    formatted = chars.reverse().join('');

    if ( parts.length > 1 ) {
      formatted = `${formatted}.${parts[1]}`;
    }
    else {
      formatted = `${formatted}.00`;
    }

    return formatted;
  }

  updatePricing() {
    // this.
  }

  viewChart() {
    this.nav.push(ROUTES.Pulse, {
      currency: this.currency
    });
    // let modal = this.modal.create(ROUTES.Pulse, {
    //   currency: this.currency
    // });

    // modal.present();
  }

  get eventTopic(): string {
    return this._evPrefix + this.currency;
  }

  get coinName(): string {
    return this.translate.instant( this.currency );
  }

  get coinSymbol(): string {
    return this.currency;
  }

  get iconClass(): string {
    return this._cssIconClass[this.currency];
  }

  get distCurrency(): string {
    return (this._dist + '').toUpperCase();
  }

  get result(): string {
    let val = Math.abs(this._coinValue * this._coinBase) * 100;
    let result: string;
        result = this.formatResult( Math.round(val) / 100 );

    return result;
  }
}

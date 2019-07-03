import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Helper, Settings, Util, Coins } from '../../providers/providers';
import { Observable } from 'rxjs';
import { DEFAULT_LANG } from '../../app/shared/constants';
import * as ROUTES from '../pages';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  private Form: any;

  private fields: any = {
    numbersFormat: 'comma',
    defaultCurrency: 'BTC',
    localCurrency: 'USD',
    updateInterval: '10',
    lang: DEFAULT_LANG
  };

  private formats: any[] = [
    {
      label: 'SETTINGS_LABEL_COMMA',
      value: 'comma',
    },
    {
      label: 'SETTINGS_LABEL_DOTS',
      value: 'dots',
    },
    {
      label: 'SETTINGS_LABEL_PLAIN',
      value: 'plain',
    }
  ];

  private virtualCurrencies: any[] = [
    {
      label: 'BTC - Bitcoin',
      value: 'BTC',
    },
    {
      label: 'ETH - Ethereum',
      value: 'ETH',
    },
    {
      label: 'LTC - Litecoin',
      value: 'LTC',
    },
    {
      label: 'DASH',
      value: 'DASH',
    },
    {
      label: 'XRP - Ripple',
      value: 'XRP',
    },
    {
      label: 'XEM - NEM',
      value: 'XEM',
    },
    {
      label: 'XMR - Monero',
      value: 'XMR',
    },
    {
      label: 'ZEC - ZCASH',
      value: 'ZEC',
    },
  ];

  private intervalRanges: any[] = [
    {
      label: '20 Min.',
      value: '20',
    },
    {
      label: '15 Min.',
      value: '15',
    },
    {
      label: '10 Min.',
      value: '10',
    },
    {
      label: '5 Min.',
      value: '5',
    },
    {
      label: '1 Min.',
      value: '1',
    },
  ];

  private selectOpts: any = {
    currency: {
      mode: 'md',
    },
    interval: {
      mode: 'md',
    },
    format: {
      mode: 'md',
    },
    local: {
      mode: 'md',
    },
    lang: {
      mode: 'md',
    },
  };

  private _isFirstSave: boolean = true;

  constructor(
    public coins: Coins,
    public settings: Settings,
    public helper: Helper,
    public util: Util,
    public z: NgZone,
    public nav: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    this.Form = formBuilder.group({
      // updateInterval: ['', Validators.compose([Validators.required])],
      // numbersFormat: ['', Validators.compose([Validators.required])],
      // defaultCurrency: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(4), Validators.required])],
      // localCurrency: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(4), Validators.required])],
    });
  }

  ionViewDidLoad() {
    this.settings.load().then(data => {
      this.fields = this.util.extend(this.fields, data);
    });

    this.selectOpts.currency.title = this.translate.instant('SETTINGS_DEFAULT_CURRENCY');
    this.selectOpts.local.title    = this.translate.instant('SETTINGS_LOCAL_CURRENCY');
    this.selectOpts.interval.title = this.translate.instant('SETTINGS_INTERVAL');
    this.selectOpts.format.title   = this.translate.instant('SETTINGS_FORMAT');
    this.selectOpts.lang.title     = this.translate.instant('SETTINGS_LANG');

    this.virtualCurrencies = [];
    let coins              = this.coins.supportedCoins(true);

    for ( let c of coins ) {
      this.virtualCurrencies.push({
        label: c.label,
        value: c.value,
      });
    }

    this.util.initGoogleAnalytics().then(() => {
      this.util.gaTrack( 'Settings Page' );
    });
  }

  ionViewDidEnter() {
    this.util.adBanner();
  }

  submit() {
    // console.warn(this.fields);
    if (this.Form.valid == false) {
    }
  }

  updateLang() {
    this.helper.switchLocale(this.fields.lang);
  }

  updateChanges( key: string ) {
    this.util.debounce(() => {
      this.settings.merge({
        numbersFormat: this.fields.numbersFormat,
        defaultCurrency: this.fields.defaultCurrency,
        localCurrency: this.fields.localCurrency,
        updateInterval: this.fields.updateInterval,
        lang: this.fields.lang,
      }).then(() => {
        if (this.helper.getLocale() != this.fields.lang) {
          this.updateLang();
        }
      });
    })
    .call(null);

    // .then(
    //     if ( this._isFirstSave ) {
    //       this._isFirstSave = false;
    //       return;
    //     }
    //     this.helper.showToast(this.translate.instant('SETTINGS_SAVED'), '1000', 'bottom');
    //   }, 500)
    //   // .call(null);
  }

  get localCurrencies(): any[] {
    let all  = this.coins.allCurrencies();
    let opts = [];
    
    for ( let key in all ) {
      let r = all[key];
      opts.push({
        label: this.helper.lang == 'ar' ? r.country_ar : r.country,
        value: key
      });
    }

    return opts;
  }
}

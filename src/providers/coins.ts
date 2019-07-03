import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Api } from './api';
import { Util } from './util';
import { Helper } from './helper';
import { CURRENCIES, CURRENCIES_LITE, SUPPORTED_COINS } from '../app/shared/constants';


@Injectable()
export class Coins {

  private _coindesk: string     = 'http://api.coindesk.com/v1/bpi';
  private _cc: string           = 'https://min-api.cryptocompare.com/data';
  private _defCurrency: string  = 'USD';

  constructor(
    private events: Events, 
    private api: Api, 
    private util: Util, 
    private helper: Helper
  ) {
  }


  /**
   * Get All Currencies
   * 
   * @returns 
   * @memberof Coins
   */
  allCurrencies(getAll: boolean = false) {
    return !! getAll ? CURRENCIES : CURRENCIES_LITE;
  }


  /**
   * Supported Coins
   * 
   * @param {boolean} [asOptsArray] 
   * @returns {any[]} 
   * @memberof Coins
   */
  supportedCoins(detailed: boolean = false): any[] {
    let coins: any[] = [];

    for ( let idx in SUPPORTED_COINS ) {
      let coin = SUPPORTED_COINS[idx];

      coins.push(
        !! detailed
        ? {
          icon: coin.icon_class,
          value: coin.currency,
          label: coin.label,
        }
        : idx
      );
    }

    return coins;
  }

  getSupportedCoin(crypto: string) {
    return SUPPORTED_COINS[crypto] || {};
  }


  /**
   * Get coins prices
   * 
   * @param {string} [crypto='BTC'] 
   * @param {string} [currencyCode] 
   * @returns {Promise<any>} 
   * @memberof Coins
   */
  query(crypto: string = 'BTC', currencyCode?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let driver: any;
          crypto = crypto.toLocaleUpperCase();

      if ( this.supportedCoins().indexOf(crypto) === -1 ) {
        console.warn('-- Unsupported Cryptocurrency!')
        return;
      }

      switch(crypto) {
        case 'BTC':
          driver = this.getBtc(currencyCode);
          break;
        default:
          driver = this.getOther(crypto, currencyCode);
          break;
      }

      this.events.publish('bar:loading', crypto, currencyCode, driver);

      if ( !! driver ) {
        let dial = (_call: Function, _keys) => {
          this.api.resetBaseUrl();
          this.events.publish('bar:done', _keys);
          // console.warn('---', this.supportedCoins() );
          // console.warn('---', _call == resolve, _keys);
          _call(_keys);
        };

        driver
        .then(res => {
          dial(resolve, res);
        })
        .catch(err => {
          dial(reject, err);
        });
      }
    });
  }
  

  /**
   * Get Bitcoin Prices
   * Uses the (coindesk.com) API
   *
   * @param {string} [currencyCode] 
   * @returns {Promise<any>} 
   * @memberof Coins
   */
  getBtc(currencyCode?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpoint     = 'currentprice';
      let code: string = !!currencyCode ? currencyCode : this._defCurrency;

      if (!!code && code.length === 3) {
        endpoint += '/' + code;
      }

      this.api
        .setBaseUrl(this._coindesk)
        .request('get', `${endpoint}.json`, {}, {
          debounce: false
        })
        .subscribe(
          res => {
            if (res && res.time && res.bpi) {
              let data = !!currencyCode ? res.bpi[code.toUpperCase()] : res.bpi;

              resolve({
                value: data['rate_float'] ? data.rate_float : data,
                time: res.time
              });
            }
            else {
              reject(new Error("Unable to get prices data!"));
            }
          },
          err => {
            // console.warn("ERROR", err);
            reject(err);
          }
        );
    });
  }


  /**
   * Get Ethereum Price
   * 
   * @param {string} [currencyCode] 
   * @returns {Promise<any>} 
   * @memberof Coins
   */
  getOther(from: string, currencyCode?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpoint     = 'price';
      let code: string = (!!currencyCode ? currencyCode : this._defCurrency).toUpperCase();

      this.api
        .setBaseUrl(this._cc)
        .request('get', endpoint, {
          fsym: from,
          tsyms: `BTC,${currencyCode}`
        }, {
          debounce: true
        })
        .subscribe(
          res => {
            if (res) {
              let price = res[code] ? res[code] : -1;

              if ( price === -1 ) {
                this.convertCurrency(res.BTC, code).then(_res => {
                  resolve({
                    value: _res.value,
                    time: _res.time
                  })
                }).catch(err => {
                  reject(new Error("Unable to get convert price to local currency!"));
                });
              }
              else {
                resolve({
                  value: res[code],
                  time: +(new Date())
                });
              }
            }
            else {
              reject(new Error("Unable to get prices data!"));
            }
          },
          err => {
            // console.warn("ERROR", err);
            reject(err);
          }
        );
    });
  }


  /**
   * Get a Cryptocurrency Rate From BTC's Current Rate
   * 
   * @private
   * @param {number} ratio 
   * @param {string} currency 
   * @returns {Promise<any>} 
   * @memberof Coins
   */
  private convertCurrency( ratio: number, currency: string ): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpoint = 'currentprice';
      let code: string = !!currency ? currency : this._defCurrency;

      if (!!code && code.length === 3) {
        endpoint += '/' + code;
      }

      this.api
        .setBaseUrl(this._coindesk)
        .request('get', `${endpoint}.json`)
        .subscribe(
          res => {
            if (res && res.time && res.bpi) {
              let rate = res.bpi[code].rate_float;

              resolve({
                value: rate * ratio,
                time: res.time
              });
            }
            else {
              reject(new Error("Unable to get prices data!"));
            }
          },
          err => {
            // console.warn("ERROR", err);
            reject(err);
          }
        );
    });
  }
}

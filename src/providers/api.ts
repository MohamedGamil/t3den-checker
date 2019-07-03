import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Headers, Http, Request, RequestMethod, RequestOptions, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { SHARE_LINK, API_BASE } from '../app/shared/constants';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  // -- Configuration & API Endpoint Setup
  // Sharable Link: Used by `Sharer` Provider
  shareLink: string        = SHARE_LINK;

  // Base API URI
  base: string             = API_BASE;

  // API Endpoint URL
  url: string              = '';     // API Endpoints URL

  // Assets Endpoint URL
  assets: string           = 'storage'; // Assets Prefix URL

  // Language Query Paramater Key
  localeKeyword: string    = 'local';

  // oneSignalAppId: string   = '';
  // googleProjectNumber: any = '';

  // Allowed HTTP-Request Methods
  allowedMethods: string[] = ['get', 'post', 'put', 'options', 'delete', 'head', 'patch'];

  private _ignoredToken: string      = 'token=false';
  private _skipEventTrigger: boolean = false;
  private _sendLocaleParam: boolean  = false;
  private _obase: any;
  private _ourl: any;
  private _oassets: any;

  constructor(
    private translate: TranslateService,
    private events: Events,
    private http: Http,
    private storage: Storage
  ) {
    this._obase   = this.base;
    this._ourl    = this.url;
    this._oassets = this.assets;
    this.resetBaseUrl();
  }


  /**
   * Send Localization Parameter
   *
   * @returns  this
   * @memberof Api
   */
  sendLocale() {
    this._sendLocaleParam = true;
    return this;
  }


  /**
   * Send an API request, then returns the request object
   *
   * @param {string} [method='get']
   * @param {string} endpoint
   * @param {*} [params={}]
   * @param {*} [options={}]
   * @returns {Observable<Response>}
   * @memberof Api
   */
  request( method: string = 'get', endpoint: string, params: any = {}, options: any = {}) {
    let lang: string          = this.translate.currentLang;
    let url: string           = this.url + '/' + endpoint + '?';
    let queryParams: string[] = [];
    let endpointParams        = endpoint.split('?');
    let httpMethod            = (this.allowedMethods.indexOf(method.trim().toLocaleLowerCase()) > -1 ? method : this.allowedMethods[0]);
    let lastKey: any          = Object.keys(params).pop();
    let newData: string       = '';
    options                   = {
      retryDelay: typeof(options.retryDelay) != 'undefined' ? options.retryDelay : 500,
      debounce: typeof(options.debounce) != 'undefined' ? options.debounce : false,
      debounceDuration: typeof(options.debounceDuration) != 'undefined' ? options.debounceDuration : 500,
      timeout: typeof(options.timeout) != 'undefined' ? options.timeout : 10000,
      retry: typeof(options.retry) != 'undefined' ? options.retry : false,
      json: typeof(options.json) != 'undefined' ? options.json : true,
    };

    for( let i in params ) {
      let k = i;
      let v = params[i];

      if ( v && v.length > 0 && v.unshift ) {
        for( let ii in v ) {
          newData += k+'[]='+ v[ii] + '&';
        }

        continue;
      }

      // if ( typeof(v) == 'undefined' || !!v || (v+'').trim().length === 0 ) {
      //   continue;
      // }

      newData += k+'='+ v +(i == lastKey ? "" : "&");
    }

    if ( this._sendLocaleParam === true ) {
      queryParams.push( `${this.localeKeyword}=${lang}` );
    }

    if ( endpointParams.length > 0 ) {
      endpoint    = endpointParams.shift();

      for( let param of endpointParams ) {
        if ( this._ignoredToken === ( param.trim().toLocaleLowerCase() ) ) {
          continue;
        }

        queryParams.push( param );
      }
    }

    let reqOpts: any    = {
      method : httpMethod,
      url    : url + queryParams.join('&'),
      params : newData
    };

    // console.warn('------- ', params, reqOpts);

    let apiRequest: any = this.http.request(new Request( reqOpts )).share();

    apiRequest.subscribe(
    (res) => {
      if ( ! this._skipEventTrigger ) {
        this.events.publish('api:success', res, reqOpts, options);
      }
      else {
        this._skipEventTrigger = false;
      }
    },
    (res) => {
      this.events.publish('api:error', (res._body && res._body[0] === '{' ? JSON.parse(res._body) : {message: 'API Error!'}), reqOpts, options);
    });

    if ( !!options.retry ) {
      apiRequest = apiRequest.retryWhen(error => error.delay(options.retryDelay));
    }

    if ( !!options.debounce ) {
      // apiRequest = apiRequest.debounceTime(options.debounceDuration);
    }

    if ( options.timeout > 0 ) {
      apiRequest = apiRequest.timeout(options.timeout);
    }

    if ( !!options.json ) {
      apiRequest = apiRequest.map((res: Response) => res.json());
    }

    return apiRequest;
  }


  /*
   * Alias for `this.request()`
   */
  send(...args) {
    return this.request.apply(this, args);
  }


  /**
   * Skip Emitting Events For The Next API Call
   *
   * @returns {Api}
   * @memberof Api
   */
  silent() {
    this._skipEventTrigger = true;
    return this;
  }


  /**
   * Get Full Asset URL
   *
   * @param {string} assetUrl
   * @returns {string}
   * @memberof Api
   */
  asset(assetUrl: string) {
    return this.assets + '/' + assetUrl;
  }

  /**
   * Set Base API URL
   *
   * @param {any} newUrl
   * @memberof Api
   */
  setBaseUrl( newUrl ) {
    this.url    = newUrl + this._ourl;
    this.assets = newUrl + this._oassets;
    return this;
  }

  /**
   * Reset Base API URL to default
   *
   * @memberof Api
   */
  resetBaseUrl() {
    this.setBaseUrl(this._obase);
  }
}

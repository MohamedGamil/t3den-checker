import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GATRACKINGCODE, APP_VERSION, GOOGLEPUBID, GOOGLEBANNER, GOOGLEINTER } from '../app/shared/constants';

export declare var cordova: any;
export declare var window: any;

/**
 * Utility Functions
 */
@Injectable()
export class Util {

    constructor(
        private platform: Platform,
    ) {
    }


    /**
     * Extend 1 or more Objects
     *
     * @template A
     * @param {A} a
     * @returns {A}
     * @memberof Util
     */
    extend<A>(a: A): A;
    extend<A, B>(a: A, b: B): A & B;
    extend<A, B, C>(a: A, b: B, c: C): A & B & C;
    extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
    extend(...args: any[]): any {
        const newObj = {};
        for (const obj of args) {
            for (const key in obj) {
                //copy all the fields
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }


    /**
     * Debounce a Callback
     *
     * @param {() => void} func
     * @param {number} [wait=50]
     * @returns
     * @memberof Util
     */
    debounce(func: () => void, wait = 50) {
        let h: number = 0;
        return () => {
            clearTimeout(h);
            h = setTimeout(() => {
                func();
            }, wait);
        };
    }


    /**
     * Get Timestamp
     *
     * @returns
     * @memberof Util
     */
    time() {
        return (window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now());
    }


    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     *
     * @param {any} min
     * @param {any} max
     * @returns
     * @memberof Util
     */
    random(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Transform First Charachter to Uppercase & Return String
     *
     * @param {string} str
     * @returns {string}
     * @memberof Util
     */
    ucfirst( str: string ): string {
        return str.charAt(0).toUpperCase() + str.substr(1, str.length);
    }


    initGoogleAnalytics(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.warn(JSON.stringify(Object.keys(window.ga), null, 2));
            if ( !! window && !! window.ga ) {
              console.info('GA Started with tracking id: '+ GATRACKINGCODE);
              window.ga.startTrackWithId(GATRACKINGCODE);
              resolve({ok: true});
            } else {
              console.warn('GA Plugin not found!');
              reject(new Error('Google Analytics Plugin is unavailable!'));
            }

            // resolve(true);
        });
        /* return this.ga
            .startTrackerWithId(GATRACKINGCODE)
            .then(() => {
                this.ga.setAllowIDFACollection(true);
                this.ga.setAppVersion(APP_VERSION);
            })
            .catch(e => console.warn(e)); */
    }


    gaTrack(name: string, newSession: boolean = false, url?: string) {
        console.log('Tracking...');
        if ( !! window && !! window.ga ) {
          window.ga.trackView(name, url, newSession);
          console.info('GA Tracking View: '+ name);
        } else {
          console.warn('GA Not Present!');
        }
        // return this.ga.trackView(name, url, newSession);
    }

    adBanner() {
        if ( !! window && !! window.plugins && !! window.plugins.AdMob ) {
            let admobid: any = {
                banner: GOOGLEBANNER,
                interstitial: GOOGLEINTER
            };

            window.plugins.AdMob.setOptions( {
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
                bannerAtTop: false, // set to true, to put banner at top
                overlap: false, // banner will overlap webview
                offsetTopBar: false, // set to true to avoid ios7 status bar overlap
                isTesting: false, // receiving test ad
                autoShow: true // auto show interstitial ad when loaded
            });

            window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown
            window.plugins.AdMob.requestInterstitialAd();
        } else {
            //alert( 'admob plugin not ready' );
            console.warn('Admob FAILED!');
        }

        /*
        const bannerConfig: AdMobFreeBannerConfig = {
            id: GOOGLEBANNER,
            isTesting: false,
            autoShow: false,
            // isTesting: false,
        };

        this.ad.banner.config(bannerConfig);

        this.ad.banner.prepare()
            .then(() => {
                this.ad.banner.show();
                console.warn('--- Banner Created!');
            })
            .catch(e => console.warn(e));

        const interConfig: AdMobFreeInterstitialConfig = {
            id: GOOGLEINTER,
            isTesting: false,
            autoShow: false,
            // isTesting: false,
        };

        this.ad.interstitial.config(interConfig);

        this.ad.interstitial.prepare()
            .then(() => {
                this.ad.interstitial.show();
                console.warn('--- Interstitial Created!');
            })
            .catch(e => console.warn(e));
        */
    }


    private get _isNative(): boolean {
        let platforms = this.platform.platforms();
        return ( platforms.indexOf('core') === -1 && platforms.indexOf('mobileweb') === -1 );
    }
}

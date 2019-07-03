import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyApp } from './app.component';

import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { Pro } from '@ionic-native/pro';
import * as ProClient from '@ionic/pro';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { PipesModule } from '../pipes/pipes.module';

import { Settings, Api, Helper, Util, Sharer, ConnectivityService, Coins } from '../providers/providers';
import { APP_ID, APP_VERSION } from './shared/constants';


/*
 * Ionic Pro Client INIT &
 * Error Monitoring Service
 */
const IonicPro = ProClient.Pro.init( APP_ID, {
  appVersion: APP_VERSION
});


@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings( storage, {
    lang: 'ar',
    updateInterval: '10',
    numbersFormat: 'comma',
    defaultCurrency: 'BTC',
    localCurrency: 'USD'
  });
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      menuType: 'overlay'
    }),
    IonicStorageModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Api,
    Helper,
    Util,
    Sharer,
    ConnectivityService,
    Coins,

    Pro,
    Network,
    Camera,
    SplashScreen,
    StatusBar,
    SocialSharing,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },

    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: MyErrorHandler }
  ]
})
export class AppModule { }

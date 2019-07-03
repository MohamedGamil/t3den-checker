import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, Config, Events, App, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppInfo, DeployInfo, Pro } from '@ionic-native/pro';
import { TranslateService } from '@ngx-translate/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Settings, Helper, Sharer, Util } from '../providers/providers';
import { DEFAULT_LANG, APP_VERSION } from './shared/constants';
import * as ROUTES from '../pages/pages';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private supportedLocale: string[] = ['ar', 'en'];

  pages: any[] = ROUTES.PAGES;
  rootPage     = ROUTES.FirstRunPage;
  pagesList    = {};
  @ViewChild(Nav) nav: Nav;

  constructor(
    // private pro: Pro,
    private app: App,
    private events: Events,
    private loadingBar: SlimLoadingBarService,
    private storage: Storage,
    private translate: TranslateService,
    private platform: Platform,
    private settings: Settings,
    private sharer: Sharer,
    private util: Util,
    private helper: Helper,
    private config: Config,
    private statusBar: StatusBar,
    private zone: NgZone,
    private menu: MenuController,
    private splashScreen: SplashScreen
  ) {
    this.initTranslate();
    this.initPlatformEvents();
    this.initPages();
    this.initLoadingBar();
  }

  initTranslate() {
    let defLang  = !! DEFAULT_LANG ? DEFAULT_LANG : 'ar';
    let distLang = defLang;

    // Set the default language for translation strings, and the current language.
    this.config.set('ios', 'backButtonText', '');
    this.translate.setDefaultLang( defLang );

    this.translate.onLangChange.subscribe(event => {
      this.zone.run(() => {
        let $html = document.getElementsByTagName('html')[0];
        $html.classList.remove('lang-ar');
        $html.classList.remove('lang-en');
        $html.classList.add('lang-' + event.lang);
      });
    });

    if (this.translate.getBrowserLang() !== undefined) {
      distLang = this.translate.getBrowserLang();
    }

    this.settings.load().then(async () => {
      let prefLang = await this.settings.getValue('lang');
      this.translate.use( (this.supportedLocale.indexOf(prefLang) > -1) ? prefLang : distLang );
      this.activateLocalizedMenu();
    });
  }

  initPlatformEvents() {
    this.platform.ready().then(() => {
      console.log('-- PLATFORM READY!');
      this.events.publish('platform:ready');
      this.activateLocalizedMenu();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(err => {
      console.log(err);
    });

    this.platform.pause.subscribe(() => {
      console.log('-- PLATFORM PAUSED!');
      this.events.publish('platform:pause');
    });

    this.platform.resume.subscribe(() => {
      console.log('-- PLATFORM RESUMED!');
      this.events.publish('platform:resume');
    });
  }

  initPages() {
    this.pages.forEach((item, idx) => {
      // let id             = item.title.replace( /PAGE\_/g, '').toLowerCase();
      let id             = item.component.toLowerCase();
      item.className     = 'menu-item-'+ id;
      this.pagesList[id] = item;
      this.pages[idx]    = item;
    });
  }

  hasLinkAccess(p: any): boolean {
    let access = false;

    if ( p.access === 'any' ) {
      access = true;
    }

    if ( (p.access === 'guest' && !this.isLoggedin()) || (p.access === 'user' && !!this.isLoggedin()) ) {
      access = true;
    }

    if ( p.component && p.component === '$action' ) {
      access = false;
    }

    return access;
  }

  getActive() {
    let active: any = this.nav.getActive();

    if ( active && active.component ) {
      if ( active.component.name === 'TabsPage' && active.instance.getActive()) {
        active = active.instance.getActive();
      }

      active = (active.component && active.component.name ? active.component.name : active);
    }

    return active;
  }

  switchLocale(lang?: string) {
    this.settings.setValue('lang', this.helper.switchLocale(lang));
  }

  getLocale() {
    return this.helper.getLocale();
  }

  activateLocalizedMenu() {
    this.helper.activateLocalizedMenu();
  }

  initLoadingBar() {
    this.events.subscribe('bar:loading', () => {
      this.loadingBar.start();
    });

    this.events.subscribe('bar:done', () => {
      this.loadingBar.complete();
    });
  }

  isLoggedin() {
    return false;
  }

  isNative() {
		return this.helper.isNative();
  }

  openPage(page) {
    if ( ! page.component && this.pagesList[page] ) {
      page = this.pagesList[page];
    }

    if ( ! page || ! page.component ) {
      page = {
        component: ROUTES.MainPage,
        params: {
          // tab: ROUTES.MainPageDefTab
        }
      };
    }

    let active = this.getActive();
    let prev   = this.nav.getPrevious();
    let target = page.component;

    // if ( target === ROUTES.MainPage ) {
    //   for( let k in ROUTES.MainPageTabs ) {
    //     if ( page.selectedComponent && page.selectedComponent === ROUTES.MainPageTabs[k] ) {
    //       target = ROUTES.MainPageTabs[k];
    //     }
    //   }
    // }

    // console.warn(active, target, prev, active == target);

    if ( active !== target ) {
      if ( prev && prev.component.name === target /* && prev.component !== ROUTES.MainPage */ ) {
        this.nav.pop();
        return;
      }

      this.nav.push( page.component, (page.params || {}), {
        animate: true,
        direction: 'forward'
      });
    }
  }

  get appVersion(): string {
    return APP_VERSION;
  }
}

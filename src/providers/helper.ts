import { Injectable, NgZone } from '@angular/core';
import { Platform, AlertController, LoadingController, Loading, ToastController, App, MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from './user';
import * as ROUTES from '../pages/pages';


/**
 * Helper class contains commonly used generic functions.
 */
@Injectable()
export class Helper {

    loading: Loading;
    defaultTab: number = 0;
    defaultPage: any = null;

    constructor(
        public zone: NgZone,
        public translate: TranslateService,
        public app: App,
        public menu: MenuController,
        public user: User,
        public platform: Platform,
        public toastCtrl: ToastController,
        // public navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) {
        this.defaultPage = ROUTES.MainPage;

        if (!!ROUTES['MainPageDefTab']) {
            this.defaultTab = ROUTES['MainPageDefTab'];
        }
    }

    dismissIfPresented() {
        if (this.loading) {
            this.loading.dismiss().catch(() => { });
        }
    }

    showAlert(title, text = null) {
        if (!text) {
            text = title;
            title = 'خطأ';
        }

        this.dismissIfPresented();

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: ['حسنا']
        });

        alert.present();
    }

    showLoading(loadingMessage = "جاري تحميل البيانات رجاء الانتظار .....") {
        this.loading = this.loadingCtrl.create({
            content: loadingMessage
        });
        this.loading.present();
    }

    showToast(message = '!', duration: string = 'short', position: string = 'top', cssClass: string = 'helper-toast') {
        this.dismissIfPresented();
        let toastDuration = (duration == 'short' ? 4000 : parseInt(duration));
        let toast = this.toastCtrl
            .create({
                message: message,
                duration: toastDuration,
                position: position,
                cssClass: cssClass
            });

        // toast.dismissAll();
        toast.present();

        // Make sure to dismiss this lil' madafakinfaka
        setTimeout(() => {
            this.zone.run(() => {
                toast.dismiss().catch(err => { });
            });
        }, (toastDuration * 2 + 1000));
    }

    switchLocale(lang?: string): string {
        let distLang   = !! lang ? lang : (this.getLocale() == 'en' ? 'ar' : 'en');
        let currLang   = this.lang;
        let activeNav  = this.app.getActiveNav().getActive();
        let activeComp = activeNav.component;
        let currParams = activeNav.getNavParams();
        
        if ( currLang === distLang ) {
            return;
        }

        this.translate.use( distLang );
        this.app
            .getActiveNav()
            .setRoot(activeComp, currParams)
            .then(() => {
                setTimeout(() => {
                    this.zone.run(() => {
                        this.activateLocalizedMenu();
                    });
                }, 500);
            }).catch(err => {
                console.warn(err);
            });
        
        return distLang;
    }

    getLocale() {
        return this.translate.currentLang;
    }

    langDir() {
        return this.getLocale() == 'ar' ? 'rtl' : 'ltr';
    }

    isNative() {
        let platforms = this.platform.platforms();
        return (platforms.indexOf('core') === -1 && platforms.indexOf('mobileweb') === -1);
    }

    softPopToRoot() {
        if (!this.defaultPage) {
            console.warn('-- UNABLE TO SOFT-POP TO ROOT!');
            return;
        }

        setTimeout(() => {
            this.zone.run(() => {
                let alt  = ROUTES['UserLogin'] ? ROUTES['UserLogin'] : ROUTES.FirstRunPage;
                let page = this.user.current() ? this.defaultPage : alt;
                
                this.app.getRootNav().setRoot(page, {
                    tab: this.defaultTab
                }, {
                    animate: true,
                    direction: 'back'
                });
            });
        }, 1000);
    }

    handleApiError(err, toastPlacement: string = 'top') {
        try {
            let disMsg: string[] = [];
            let msg: any = JSON.parse(err._body).message;
            let fmsg: string = '';

            if (typeof (msg) != 'string') {
                let fKey: string = Object.keys(msg).shift();

                if (typeof (msg[fKey]) == 'string' && fKey == '0') {
                    for (let m of msg) {
                        disMsg.push(m);
                    }
                }
                else {
                    for (let m of msg[fKey]) {
                        disMsg.push(m);
                    }
                }

                fmsg = disMsg.join(" \n");
            }
            else {
                fmsg = msg;
            }

            this.showToast(fmsg, "6000", toastPlacement, 'white-space-pre');
        }
        catch (e) {
            console.warn(e);
            this.showToast(this.translate.instant('UNEXPECTED_ERROR'), '6000', toastPlacement);
        }
    }

    activateLocalizedMenu() {
        if (this.getLocale() == 'ar') {
            this.menu.enable(true, 'right');
            this.menu.enable(false, 'left');
        }
        else {
            this.menu.enable(true, 'left');
            this.menu.enable(false, 'right');
        }
    }

    enableMenu() {
        this.activateLocalizedMenu();
    }

    disableMenu() {
        this.menu.enable(false, 'right');
        this.menu.enable(false, 'left');
    }

    get menuDirection(): string {
        return this.getLocale() == 'ar' ? 'right' : 'left';
    }

    get lang(): string {
        return this.getLocale();
    }
}
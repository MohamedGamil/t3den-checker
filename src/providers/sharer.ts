import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Api } from './api';


/**
  * Sharer: Sharing Manager.
  * Supports Windows, iOS, Android and Web-Share
  * 
  * @author   Mohamed Gamil
  */
@Injectable()
export class Sharer {

    private shareLink: string;
    private shareMessage: string;
    private shareSubject: string;
    private shareFile: string;

    constructor(
        private api: Api,
        private platform: Platform,
        private social: SocialSharing,
        private translate: TranslateService
    ) {
        // -- Default file
        this.shareFile = 'assets/img/app-share-screen.png';
        this.shareLink = this.api.shareLink;
        
        this.shareMessage = this.translate.instant('APP_DESC');
        // this.shareSubject = this.translate.instant('APP_NAME');
        // this.shareSubject = ( this.translate.currentLang == 'ar' ) ? 'إن بوينت' : 'Le-Jamali';
        this.shareSubject = 'T3DEN Cyrpto Price Checker';
    }

    sheet(msg?: string, subject?: string, file?: string, link?: string) {
        subject = !!subject ? subject : this.shareSubject;
        file    = !!file ? file : this.shareFile;
        link    = !!link ? link : this.shareLink;
        msg     = !!msg ? msg : this.shareMessage;

        if ( this.isNative() ) {
            // return this.social.share(msg, subject, file, link);
            this.social.shareWithOptions({
                // subject: subject,
                message: `${this.shareSubject}: ${link}`,
                // url: link
            });

            return true;
        }
        else {
            return this.web(msg, subject, link);
        }
    }

    private isNative() {
        let platforms = this.platform.platforms();
        return ( platforms.indexOf('core') === -1 && platforms.indexOf('mobileweb') === -1 );
    }

    private web(msg: string, subject: string, link?: string) {
        let ret: any    = false;
        let lnk: string = link || this.shareLink;

        try {
            let nav = window.navigator || navigator;
            
            if (  ! nav || ! nav['share'] ) {
                return;
            }

            ret = nav['share']({
                url: lnk,
                text: msg,
                title: subject
            });
        } catch(err) {
            console.log( err );
        }

        return ret;
    }
}
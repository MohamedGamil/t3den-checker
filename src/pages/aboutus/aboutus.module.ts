import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AboutusPage } from './aboutus';

@NgModule({
  declarations: [
    AboutusPage
  ],
  imports: [
    IonicPageModule.forChild(AboutusPage),
    TranslateModule.forChild({ loader: AboutusPage }),
    ComponentsModule,
    PipesModule
  ]
})
export class AboutusPageModule {}

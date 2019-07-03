import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CheckerPage } from './checker';

@NgModule({
  declarations: [
    CheckerPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckerPage),
    TranslateModule.forChild({ loader: CheckerPage }),
    ComponentsModule,
    PipesModule
  ],
})
export class CheckerPageModule {}

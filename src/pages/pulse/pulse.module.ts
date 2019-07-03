import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { PulsePage } from './pulse';

@NgModule({
  declarations: [
    PulsePage,
  ],
  imports: [
    IonicPageModule.forChild(PulsePage),
    TranslateModule.forChild({ loader: PulsePage }),
    ComponentsModule,
    PipesModule
  ],
})
export class PulsePageModule {}

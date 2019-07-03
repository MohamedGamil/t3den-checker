import { NgModule } from '@angular/core';
import { AssetPipe } from './asset';
import { HourtranslatePipe } from './hourtranslate';
import { LocalizedDatePipe } from './localized-date';
import { UtmParamsPipe } from './utm-params';

@NgModule({
    declarations: [
        AssetPipe,
        UtmParamsPipe,
        HourtranslatePipe,
        LocalizedDatePipe
    ],
    exports: [
        AssetPipe,
        UtmParamsPipe,
        HourtranslatePipe,
        LocalizedDatePipe
    ]
})
export class PipesModule { }
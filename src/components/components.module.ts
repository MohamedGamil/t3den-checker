import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { PipesModule } from '../pipes/pipes.module';
import { CommonHeaderComponent } from './common-header/common-header';
import { NoResultsComponent } from './no-results/no-results';
import { CommonLoaderComponent } from './common-loader/common-loader';
import { PriceWidgetComponent } from './price-widget/price-widget';


@NgModule({
	declarations: [
		CommonHeaderComponent,
		NoResultsComponent,
		CommonLoaderComponent,
    	PriceWidgetComponent,
	],
	imports: [
		IonicModule,
		Ionic2RatingModule,
		PipesModule,
		TranslateModule.forChild({loader: CommonHeaderComponent}),
		TranslateModule.forChild({loader: PriceWidgetComponent}),
		TranslateModule.forChild({loader: NoResultsComponent}),
	],
	exports: [
		CommonHeaderComponent,
    	NoResultsComponent,
    	CommonLoaderComponent,
    	PriceWidgetComponent,
	]
})
export class ComponentsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MegaModule} from './mega/mega.module';
import {ProgressiveModule} from './progressive/progressive.module';
import {IcfcModule} from './icfc/icfc.module';
import {LaxmiModule} from './laxmi/laxmi.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MegaModule,
        ProgressiveModule,
        IcfcModule,
        LaxmiModule,
    ]
})
export class CadDocumentTemplateModule {
}

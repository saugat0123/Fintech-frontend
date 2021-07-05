import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MegaModule} from './mega/mega.module';
import {ProgressiveModule} from './progressive/progressive.module';
import {IcfcModule} from './icfc/icfc.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MegaModule,
        ProgressiveModule,
        IcfcModule,
    ]
})
export class CadDocumentTemplateModule {
}

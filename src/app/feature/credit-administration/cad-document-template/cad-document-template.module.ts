import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MegaModule} from './mega/mega.module';
import {ProgressiveModule} from './progressive/progressive.module';
import {IcfcModule} from './icfc/icfc.module';
import {SampleIcfcLegalDocumentModule} from './sample-icfc-legal-document/sample-icfc-legal-document.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MegaModule,
        ProgressiveModule,
        IcfcModule,
        SampleIcfcLegalDocumentModule
    ]
})
export class CadDocumentTemplateModule {
}

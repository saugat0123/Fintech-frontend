import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CadDocumentCoreComponent} from './cad-document-core/cad-document-core.component';
import {SrdbOfferLetterComponent} from './cad-document-core/srdb-offer-letter/srdb-offer-letter.component';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbAccordionModule, NbDatepickerModule} from '@nebular/theme';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../@core/core.module';
import {OfferLetterUploadComponent} from './offer-letter-upload/offer-letter-upload.component';
import {OfferLetterActionComponent} from './offer-letter-action/offer-letter-action.component';
import {RouterModule} from '@angular/router';
import {cadDocumentRoute} from './cad-document-routing';
import {PostApprovalDocApproveComponent} from './post-approval-doc-approve/post-approval-doc-approve.component';
import {CadLoginComponent} from './cad-login/cad-login.component';
import {ExcelOfferLetterComponent} from './cad-document-core/excel-offer-letter/excel-offer-letter.component';
import {DpNoteGuarantorComponent} from './cad-document-core/excel-offer-letter/dp-note-guarantor/dp-note-guarantor.component';
import { DpNoteBorrowerComponent } from './cad-document-core/excel-offer-letter/dp-note-borrower/dp-note-borrower.component';
import { PledgeDeedFirstComponent } from './cad-document-core/excel-offer-letter/pledge-deed-first/pledge-deed-first.component';
import { PgFirmComponent } from './cad-document-core/excel-offer-letter/pg-firm/pg-firm.component';
import { PgRetailLoanComponent } from './cad-document-core/excel-offer-letter/pg-retail-loan/pg-retail-loan.component';
import { ContinuationDeedComponent } from './cad-document-core/excel-offer-letter/continuation-deed/continuation-deed.component';
import { CorporateGteeComponent } from './cad-document-core/excel-offer-letter/corporate-gtee/corporate-gtee.component';


const COMPONENTS = [
    CadDocumentCoreComponent,
    SrdbOfferLetterComponent,
    OfferLetterUploadComponent,
    OfferLetterActionComponent,
    DpNoteGuarantorComponent,
    ExcelOfferLetterComponent

];

@NgModule({
    declarations: [...COMPONENTS, PostApprovalDocApproveComponent, CadLoginComponent],
    imports: [
        CommonModule,
        ThemeModule,
        FormsModule,
        ReactiveFormsModule,
        NbDatepickerModule,
        NgxPrintModule,
        CoreModule,
        NbAccordionModule,
        RouterModule.forChild(cadDocumentRoute),
    ], entryComponents: [PostApprovalDocApproveComponent, CadLoginComponent]
})
export class CadDocumentsModule {
}

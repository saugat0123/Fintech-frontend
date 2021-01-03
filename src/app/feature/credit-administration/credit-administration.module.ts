import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnassignedLoanComponent} from './component/unassigned-loan-list/unassigned-loan.component';
import {RouterModule} from '@angular/router';
import {routes} from './credit-administration-routing';
import {ThemeModule} from '../../@theme/theme.module';
import {AssignPopUpComponent} from './component/assign-pop-up/assign-pop-up.component';
import {LoanListComponent} from './component/loan-list/loan-list.component';
import {VerifyPopUpComponent} from './component/verify-pop-up/verify-pop-up.component';
import {CadWorkFlowBaseComponent} from './cad-work-flow/cad-work-flow-base/cad-work-flow-base.component';
import {OfferLetterBaseComponent} from './cad-work-flow/cad-work-flow-base/offer-letter-base/offer-letter-base.component';
import {LegalAndDisbursementComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/legal-and-disbursement.component';
import {CadActionComponent} from './cad-work-flow/cad-work-flow-base/cad-action/cad-action.component';
import {ExposureComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/exposure/exposure.component';
import {MegaOfferLetterTemplateModule} from './mega-offer-letter-template/mega-offer-letter-template.module';
import {CadDocumentTemplateModule} from './cad-document-template/cad-document-template.module';
import {NbDialogModule} from '@nebular/theme';
import {OfferLetterListComponent} from './component/offer-letter-list/offer-letter-list.component';
import {CadOfferLetterProfileComponent} from './cad-offerletter-profile/cad-offerletter-profile.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DocumentChecklistComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/document-checklist/document-checklist.component';
import { FeesCommissionComponent } from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/fees-commission/fees-commission.component';
import {CoreModule} from '../../@core/core.module';
import { CadOfferLetterModalComponent } from './cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import { CommentComponent } from './comment/comment.component';
import { OfferLetterDocumentUploadComponent } from './cad-offerletter-profile/offer-letter-document-upload/offer-letter-document-upload.component';


@NgModule({
    declarations: [UnassignedLoanComponent,
        AssignPopUpComponent,
        LoanListComponent,
        VerifyPopUpComponent,
        CadWorkFlowBaseComponent,
        OfferLetterBaseComponent,
        LegalAndDisbursementComponent,
        CadActionComponent,
        ExposureComponent,
        OfferLetterListComponent,
        CadOfferLetterProfileComponent,
        DocumentChecklistComponent,
        FeesCommissionComponent,
        CadOfferLetterModalComponent,
        CommentComponent,
        OfferLetterDocumentUploadComponent],
    imports: [
        ThemeModule,
        CommonModule,
        NbDialogModule.forRoot(),
        MegaOfferLetterTemplateModule,
        CadDocumentTemplateModule,
        RouterModule.forChild(routes),
        NgSelectModule,
        CoreModule
    ],
    entryComponents: [AssignPopUpComponent, VerifyPopUpComponent , CadOfferLetterModalComponent]
})
export class CreditAdministrationModule {
}

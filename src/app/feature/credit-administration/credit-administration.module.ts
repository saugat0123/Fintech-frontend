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
import {OfferLetterListComponent} from './component/offer-letter/offer-letter-list/offer-letter-list.component';
import {CadOfferLetterProfileComponent} from './cad-offerletter-profile/cad-offerletter-profile.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DocumentChecklistComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/document-checklist/document-checklist.component';
import {FeesCommissionComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/fees-commission/fees-commission.component';
import {CoreModule} from '../../@core/core.module';
import {CadOfferLetterModalComponent} from './cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {CommentComponent} from './comment/comment.component';
import {OfferLetterDocumentUploadComponent} from './cad-offerletter-profile/offer-letter-document-upload/offer-letter-document-upload.component';
import {OfferLetterApprovedComponent} from './component/offer-letter/offer-letter-approved/offer-letter-approved.component';
import {LegalReviewPendingComponent} from './component/legal/legal-review-pending/legal-review-pending.component';
import {LegalReviewApprovedComponent} from './component/legal/legal-review-approved/legal-review-approved.component';
import {DisbursementApprovedComponent} from './component/disbursement/disbursement-approved/disbursement-approved.component';
import {DisbursementPendingComponent} from './component/disbursement/disbursement-pending/disbursement-pending.component';
import {CadDocumentListComponent} from './component/cad-document-list/cad-document-list.component';
import {GeneralDocumentComponent} from './cad-offerletter-profile/customer-document/cad-general-document/general-document.component';
import {CadLoanDocumentComponent} from './cad-offerletter-profile/customer-document/cad-loan-document/cad-loan-document.component';
import {FilterComponent} from './component/filter/filter.component';
import {CustomerInsuranceComponent} from './cad-offerletter-profile/customer-document/cad-general-document/customer-insurance/customer-insurance.component';
import {CadSummaryComponent} from './cad-work-flow/cad-summary/cad-summary.component';
import {CadChecklistDocTemplateModalComponent} from './cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {MegaModule} from './cad-document-template/mega/mega.module';
import {ProfileViewComponent} from './cad-view/profile-view/profile-view.component';
import {ExposureViewComponent} from './cad-view/exposure-view/exposure-view.component';
import {FeesCommissionsViewComponent} from './cad-view/fees-commissions-view/fees-commissions-view.component';
import {DocumentChecklistViewComponent} from './cad-view/document-checklist-view/document-checklist-view.component';
import {CustomOfferLetterDocumentComponent} from './cad-offerletter-profile/cad-offer-letter-modal/custom-offer-letter-document/custom-offer-letter-document.component';
import {UpdateCustomerCadInfoComponent} from './cad-offerletter-profile/update-customer-cad-info/update-customer-cad-info.component';
import {AdditionalDocumentComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/additional-document/additional-document.component';
import {AddAdditionalDocumentComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/additional-document/add-additional-document/add-additional-document.component';
import { DocumentChecklistLiteComponent } from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/document-checklist-lite/document-checklist-lite.component';


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
        OfferLetterDocumentUploadComponent,
        OfferLetterApprovedComponent,
        LegalReviewPendingComponent,
        LegalReviewApprovedComponent,
        DisbursementApprovedComponent,
        DisbursementPendingComponent,
        CadDocumentListComponent,
        FilterComponent,
        CadDocumentListComponent,
        GeneralDocumentComponent,
        CadLoanDocumentComponent,
        CustomerInsuranceComponent,
        CadSummaryComponent,
        CadChecklistDocTemplateModalComponent,
        ProfileViewComponent,
        ExposureViewComponent,
        FeesCommissionsViewComponent,
        DocumentChecklistViewComponent,
        CustomOfferLetterDocumentComponent,
        UpdateCustomerCadInfoComponent,
        AdditionalDocumentComponent,
        AddAdditionalDocumentComponent,
        DocumentChecklistLiteComponent],
    imports: [
        ThemeModule,
        CommonModule,
        NbDialogModule.forRoot(),
        MegaOfferLetterTemplateModule,
        CadDocumentTemplateModule,
        RouterModule.forChild(routes),
        NgSelectModule,
        CoreModule,
        MegaModule,
    ],
    entryComponents: [AssignPopUpComponent,
        VerifyPopUpComponent,
        CadOfferLetterModalComponent,
        ExposureComponent,
        CadChecklistDocTemplateModalComponent,
        CustomOfferLetterDocumentComponent,
        UpdateCustomerCadInfoComponent,
        AddAdditionalDocumentComponent]
})
export class CreditAdministrationModule {
}

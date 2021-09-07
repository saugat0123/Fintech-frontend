import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPrintModule} from 'ngx-print';
import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {BasicInfoComponent} from './component/loan-main-template/basic-info/basic-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CompanyInfoComponent} from './component/loan-main-template/company-info/company-info.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbDatepickerModule, NbTooltipModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {LoanActionComponent} from './loan-action/loan-action.component';
import {LoanFormService} from './component/loan-form/service/loan-form.service';
// tslint:disable-next-line:max-line-length

// tslint:disable-next-line:max-line-length

import {ReadmoreModelComponent} from './component/readmore-model/readmore-model.component';
import {CoreModule} from '../../@core/core.module';
import {environment} from '../../../environments/environment';

import {AgmCoreModule} from '@agm/core';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
// tslint:disable-next-line:max-line-length
import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterActionComponent} from './loan-offer-letter/offer-letter-action/offer-letter-action.component';
import {GroupComponent} from './component/loan-main-template/group/group.component';
import {GroupDetailComponent} from './component/loan-main-template/group/group-detail/group-detail.component';
import {SecurityDetailComponent} from './component/loan-main-template/group/security-detail/security-detail.component';
import {LoanMainNepaliTemplateComponent} from './component/loan-main-nepali-template/loan-main-nepali-template.component';
import {CustomerInfoNepaliComponent} from './component/loan-main-nepali-template/customer-info-nepali/customer-info-nepali.component';
import {ApplicantFamilyInfoPrintComponent} from './component/loan-main-nepali-template/applicant-family-info/applicant-family-info-print/applicant-family-info-print.component';
import {BikeKarjaPrintComponent} from './component/loan-main-nepali-template/bike-karja/bike-karja-print/bike-karja-print.component';
import {CustomerAssociateComponent} from './component/loan-main-template/customer-associate/customer-associate.component';
import {CustomerModule} from '../customer/customer.module';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {LoanActionModalComponent} from './loan-action/loan-action-modal/loan-action-modal.component';
import {LoanActionVerificationComponent} from './loan-action/loan-action-verification/loan-action-verification.component';
import {LoanActionCombinedModalComponent} from './loan-action/loan-action-combined-modal/loan-action-combined-modal.component';
import {GuarantorAdderComponent} from './component/loan-main-template/guarantor-adder/guarantor-adder.component';
import {GuarantorDetailComponent} from './component/loan-main-template/guarantor-adder/guarantor-detail/guarantor-detail.component';
import {LoanSummaryModule} from './component/loan-summary/loan-summary.module';
import {SummaryBaseComponent} from './summary-base/summary-base.component';
import {QuillModule} from 'ngx-quill';
import {AngularDraggableModule} from 'angular2-draggable';
import {LoanInformationDetailViewModule} from '../loan-information-detail-view/loan-information-detail-view.module';
import {AssignedOfferLetterComponent} from './loan-offer-letter/assigned-offer-letter/assigned-offer-letter.component';
import { PostApprovalFormComponent } from './loan-offer-letter/post-approval-form/post-approval-form.component';
import {TransferDocComponent} from './transfer-doc/transfer-doc.component';
import {MicroLoanSummaryComponent} from './component/micro-loan-summary/micro-loan-summary.component';
import {MicroIndividualComponent} from './component/micro-loan-summary/micro-individual/micro-individual.component';
import {MicroInstitutionComponent} from './component/micro-loan-summary/micro-institution/micro-institution.component';
import {MicroProposalSummaryComponent} from './component/micro-loan-summary/micro-proposal-summary/micro-proposal-summary.component';
import {BorrowerPortfolioSummaryComponent} from './component/micro-loan-summary/borrower-portfolio-summary/borrower-portfolio-summary.component';
import {MicroLoanModule} from '../micro-loan/micro-loan.module';
import {MicroBaselRiskExposureSummaryComponent} from './component/micro-loan-summary/micro-basel-risk-exposure-summary/micro-basel-risk-exposure-summary.component';
import {MarketingActivitiesSummaryComponent} from './component/micro-loan-summary/marketing-activities-summary/marketing-activities-summary.component';
import {CustomerWiseLoanPullComponent} from './component/loan-pull/customer-wise-loan-pull/customer-wise-loan-pull.component';
import {NepaliPatroModule} from 'nepali-patro';
import { GammaLoanSummaryComponent } from './component/gamma-loan-summary/gamma-loan-summary.component';
import {CbsGroupModule} from '../cbs-group/cbs-group.module';
import {ApprovalSheetComponent} from './component/loan-summary/approval-sheet/approval-sheet.component';
import {TransferLoanModule} from '../transfer-loan/transfer-loan.module';

const COMPONENTS = [
    LoanFormComponent,
    BasicInfoComponent,
    CompanyInfoComponent,
    KycInfoComponent,
    DmsLoanFileComponent,
    LoanActionComponent,
    ReadmoreModelComponent,
    LoanPullComponent,
    LoanPullComponent,
    LoanOfferLetterComponent,
    OfferLetterActionComponent,
    GroupComponent,
    GroupDetailComponent,
    SecurityDetailComponent,

    LoanMainNepaliTemplateComponent,
    CustomerInfoNepaliComponent,
    LoanMainNepaliTemplateComponent,
    ApplicantFamilyInfoPrintComponent,
    BikeKarjaPrintComponent,
    CustomerAssociateComponent,
    CustomerAssociateComponent,
    LoanActionModalComponent,
    LoanActionVerificationComponent,
    LoanActionCombinedModalComponent,
    GuarantorAdderComponent,
    GuarantorDetailComponent,
    MicroLoanSummaryComponent,
    MicroIndividualComponent,
    MicroInstitutionComponent,
    MicroProposalSummaryComponent,
    BorrowerPortfolioSummaryComponent,
    MicroBaselRiskExposureSummaryComponent,
    MarketingActivitiesSummaryComponent,
    GammaLoanSummaryComponent,
    ApprovalSheetComponent
];

const ENTRY_COMPONENTS = [
    ReadmoreModelComponent,
    LoanMainNepaliTemplateComponent,
    CustomerInfoNepaliComponent,
    CustomerAssociateComponent,
    LoanActionModalComponent,
    LoanActionVerificationComponent,
    LoanActionCombinedModalComponent,
    GuarantorDetailComponent,
    ApprovalSheetComponent,
];

const modules = {

    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],

        ['clean'],                                         // remove formatting button
        // link and image, video
    ]
};

@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [...COMPONENTS, SummaryBaseComponent, AssignedOfferLetterComponent, PostApprovalFormComponent, TransferDocComponent, CustomerWiseLoanPullComponent],
    imports: [
        ThemeModule,
        CommonModule,
        LoanRoutingModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbDatepickerModule,
        NgxPrintModule,
        CoreModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP_API_KEY
        }),
        CustomerModule,
        NepaliCalendarModule,
        ReportingModule,
        LoanInformationTemplateModule,
        LoanInformationViewModule,
        LoanSummaryModule,
        QuillModule.forRoot({modules: modules}),
        AngularDraggableModule,
        LoanInformationDetailViewModule,
        NbTooltipModule,
        MicroLoanModule,
        NepaliPatroModule,
        CbsGroupModule,
        TransferLoanModule
    ],

    providers: [
        DatePipe,
        LoanFormService,
        NgbActiveModal
    ],

    entryComponents: [...ENTRY_COMPONENTS],
    exports: [
        KycInfoComponent,
        MicroProposalSummaryComponent,
        MicroBaselRiskExposureSummaryComponent,
        CustomerWiseLoanPullComponent,
        ApprovalSheetComponent
    ]
})
export class LoanModule {
}

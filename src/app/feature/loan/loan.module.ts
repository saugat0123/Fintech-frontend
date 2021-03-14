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
import {BirthMarkLetterNepaliComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/birth-mark-letter/birth-mark-letter-nepali.component';
// tslint:disable-next-line:max-line-length
import {BirthMarkLetterPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/birth-mark-letter/birth-mark-letter-print/birth-mark-letter-print.component';
import {SuccessOfferLetterComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/success-offer-letter/success-offer-letter.component';
// tslint:disable-next-line:max-line-length
import {SuccessOfferLetterPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/success-offer-letter/success-offer-letter-print/success-offer-letter-print.component';

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
import {DhitoLikhatManjurinamaComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/dhito-likhat-manjurinama/dhito-likhat-manjurinama.component';
import {DhristiBandhakComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/dhristi-bandhak/dhristi-bandhak.component';
import {JamaniTamsukComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/jamani-tamsuk/jamani-tamsuk.component';
import {KararnamaComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/kararnama/kararnama.component';
import {KarjatamsukComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/karjatamsuk/karjatamsuk.component';
import {ManjurinamaComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/manjurinama/manjurinama.component';
import {PratigyaPatraComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/pratigya-patra/pratigya-patra.component';
import {LoanMainNepaliTemplateComponent} from './component/loan-main-nepali-template/loan-main-nepali-template.component';
import {CustomerInfoNepaliComponent} from './component/loan-main-nepali-template/customer-info-nepali/customer-info-nepali.component';
import {DhitoLikhatPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/dhito-likhat-manjurinama/dhito-likhat-print/dhito-likhat-print.component';
import {ApplicantFamilyInfoComponent} from './component/loan-main-nepali-template/applicant-family-info/applicant-family-info.component';
import {KarjaTamsukPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/karjatamsuk/karja-tamsuk-print/karja-tamsuk-print.component';
import {KararnamaPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/kararnama/kararnama-print/kararnama-print.component';
import {DhristiBandhakPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/dhristi-bandhak/dhristi-bandhak-print/dhristi-bandhak-print.component';
import {ManjurinamaLetterPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/manjurinama/manjurinama-letter-print/manjurinama-letter-print.component';
import {JamaniBasekoComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko.component';
import {JamaniBasekoPrintComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko-print/jamani-baseko-print.component';
import {BikeKarjaComponent} from './component/loan-main-nepali-template/bike-karja/bike-karja.component';
import {HayarParchesKarjaNibedanComponent} from './component/loan-main-nepali-template/hayar-parches-karja-nibedan/hayar-parches-karja-nibedan.component';
import {PratigyaPatraPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/pratigya-patra/pratigya-patra-print/pratigya-patra-print.component';

import {JamaniTamsukLetterPrintComponent} from '../cad-documents/cad-document-core/srdb-offer-letter/jamani-tamsuk/jamani-tamsuk-letter-print/jamani-tamsuk-letter-print.component';
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
import { RoleHierarchyModelComponent } from './loan-action/role-hierarchy-model/role-hierarchy-model.component';
import {TransferDocComponent} from './transfer-doc/transfer-doc.component';
import {MicroLoanSummaryComponent} from './component/micro-loan-summary/micro-loan-summary.component';
import { MicroSynopsisCreditworthinessComponent } from './component/micro-loan-summary/micro-synopsis-creditworthiness/micro-synopsis-creditworthiness.component';
import { MicroIndividualComponent } from './component/micro-loan-summary/micro-individual/micro-individual.component';
import { MicroInstitutionComponent } from './component/micro-loan-summary/micro-institution/micro-institution.component';
import {MicroProposalSummaryComponent} from './component/micro-loan-summary/micro-proposal-summary/micro-proposal-summary.component';
import { BorrowerPortfolioSummaryComponent } from './component/micro-loan-summary/borrower-portfolio-summary/borrower-portfolio-summary.component';
import {MicroLoanModule} from '../micro-loan/micro-loan.module';
import {MicroBaselRiskExposureSummaryComponent} from './component/micro-loan-summary/micro-basel-risk-exposure-summary/micro-basel-risk-exposure-summary.component';
import { MarketingActivitiesSummaryComponent } from './component/micro-loan-summary/marketing-activities-summary/marketing-activities-summary.component';

const COMPONENTS = [
    LoanFormComponent,
    BasicInfoComponent,
    CompanyInfoComponent,
    KycInfoComponent,
    DmsLoanFileComponent,
    LoanActionComponent,
    BirthMarkLetterNepaliComponent,
    BirthMarkLetterPrintComponent,
    SuccessOfferLetterComponent,
    SuccessOfferLetterPrintComponent,
    SuccessOfferLetterPrintComponent,
    ReadmoreModelComponent,

    LoanPullComponent,
    LoanPullComponent,
    LoanOfferLetterComponent,
    OfferLetterActionComponent,
    GroupComponent,
    GroupDetailComponent,
    SecurityDetailComponent,
    DhitoLikhatManjurinamaComponent,
    DhristiBandhakComponent,
    JamaniTamsukComponent,
    KararnamaComponent,
    KarjatamsukComponent,
    ManjurinamaComponent,
    PratigyaPatraComponent,
    LoanMainNepaliTemplateComponent,
    CustomerInfoNepaliComponent,
    LoanMainNepaliTemplateComponent,
    DhitoLikhatPrintComponent,
    PratigyaPatraPrintComponent,
    ApplicantFamilyInfoComponent,
    KarjaTamsukPrintComponent,
    KararnamaPrintComponent,
    ManjurinamaLetterPrintComponent,
    JamaniBasekoComponent,
    JamaniBasekoPrintComponent,
    DhristiBandhakPrintComponent,
    BikeKarjaComponent,
    HayarParchesKarjaNibedanComponent,
    JamaniTamsukLetterPrintComponent,
    ApplicantFamilyInfoPrintComponent,
    BikeKarjaPrintComponent,
    CustomerAssociateComponent,
    CustomerAssociateComponent,
    LoanActionModalComponent,
    LoanActionVerificationComponent,
    LoanActionCombinedModalComponent,
    GuarantorAdderComponent,
    GuarantorDetailComponent,
    RoleHierarchyModelComponent,
    MicroLoanSummaryComponent,
    MicroSynopsisCreditworthinessComponent,
    MicroIndividualComponent,
    MicroInstitutionComponent,
    MicroProposalSummaryComponent,
    BorrowerPortfolioSummaryComponent,
    MicroBaselRiskExposureSummaryComponent,
    MarketingActivitiesSummaryComponent
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
    RoleHierarchyModelComponent
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
    declarations: [...COMPONENTS, SummaryBaseComponent, AssignedOfferLetterComponent, PostApprovalFormComponent, TransferDocComponent],
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
        MicroLoanModule
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
        MicroBaselRiskExposureSummaryComponent
    ]
})
export class LoanModule {
}

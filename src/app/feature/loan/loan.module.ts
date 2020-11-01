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
import {NbDatepickerModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {LoanActionComponent} from './loan-action/loan-action.component';
import {LoanFormService} from './component/loan-form/service/loan-form.service';
import {BirthMarkLetterNepaliComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-nepali.component';
// tslint:disable-next-line:max-line-length
import {BirthMarkLetterPrintComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-print/birth-mark-letter-print.component';
import {SuccessOfferLetterComponent} from './component/offer-letter/success-offer-letter/success-offer-letter.component';
// tslint:disable-next-line:max-line-length
import {SuccessOfferLetterPrintComponent} from './component/offer-letter/success-offer-letter/success-offer-letter-print/success-offer-letter-print.component';

import {ReadmoreModelComponent} from './component/readmore-model/readmore-model.component';
import {CoreModule} from '../../@core/core.module';
import {environment} from '../../../environments/environment';

import {AgmCoreModule} from '@agm/core';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
// tslint:disable-next-line:max-line-length

import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterActionComponent} from './loan-offer-letter/offer-letter-action/offer-letter-action.component';
import {OfferLetterUploadComponent} from './component/offer-letter/offer-letter-upload/offer-letter-upload.component';
import {OfferLetterComponent} from './component/offer-letter/offer-letter.component';
import {GroupComponent} from './component/loan-main-template/group/group.component';
import {GroupDetailComponent} from './component/loan-main-template/group/group-detail/group-detail.component';
import {SecurityDetailComponent} from './component/loan-main-template/group/security-detail/security-detail.component';
import {DhitoLikhatManjurinamaComponent} from './component/offer-letter/dhito-likhat-manjurinama/dhito-likhat-manjurinama.component';
import {DhristiBandhakComponent} from './component/offer-letter/dhristi-bandhak/dhristi-bandhak.component';
import {JamaniTamsukComponent} from './component/offer-letter/jamani-tamsuk/jamani-tamsuk.component';
import {KararnamaComponent} from './component/offer-letter/kararnama/kararnama.component';
import {KarjatamsukComponent} from './component/offer-letter/karjatamsuk/karjatamsuk.component';
import {ManjurinamaComponent} from './component/offer-letter/manjurinama/manjurinama.component';
import {PratigyaPatraComponent} from './component/offer-letter/pratigya-patra/pratigya-patra.component';
import {LoanMainNepaliTemplateComponent} from './component/loan-main-nepali-template/loan-main-nepali-template.component';
import {CustomerInfoNepaliComponent} from './component/loan-main-nepali-template/customer-info-nepali/customer-info-nepali.component';
import {DhitoLikhatPrintComponent} from './component/offer-letter/dhito-likhat-manjurinama/dhito-likhat-print/dhito-likhat-print.component';
import {ApplicantFamilyInfoComponent} from './component/loan-main-nepali-template/applicant-family-info/applicant-family-info.component';
import {KarjaTamsukPrintComponent} from './component/offer-letter/karjatamsuk/karja-tamsuk-print/karja-tamsuk-print.component';
import {KararnamaPrintComponent} from './component/offer-letter/kararnama/kararnama-print/kararnama-print.component';
import {DhristiBandhakPrintComponent} from './component/offer-letter/dhristi-bandhak/dhristi-bandhak-print/dhristi-bandhak-print.component';
import {ManjurinamaLetterPrintComponent} from './component/offer-letter/manjurinama/manjurinama-letter-print/manjurinama-letter-print.component';
import {JamaniBasekoComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko.component';
import {JamaniBasekoPrintComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko-print/jamani-baseko-print.component';
import {BikeKarjaComponent} from './component/loan-main-nepali-template/bike-karja/bike-karja.component';
import {HayarParchesKarjaNibedanComponent} from './component/loan-main-nepali-template/hayar-parches-karja-nibedan/hayar-parches-karja-nibedan.component';
import {PratigyaPatraPrintComponent} from './component/offer-letter/pratigya-patra/pratigya-patra-print/pratigya-patra-print.component';

import {JamaniTamsukLetterPrintComponent} from './component/offer-letter/jamani-tamsuk/jamani-tamsuk-letter-print/jamani-tamsuk-letter-print.component';
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
import { SummaryBaseComponent } from './summary-base/summary-base.component';
import {QuillModule} from 'ngx-quill';
import { AngularDraggableModule } from 'angular2-draggable';
import {HayerPurchaseComponent} from "./component/offer-letter/hayer-purchase/hayer-purchase.component";
import {RetailHousingLoanComponent} from "./component/offer-letter/retail-housing-loan/retail-housing-loan.component";
import {RetailProfessionalLoanComponent} from "./component/offer-letter/retail-professional-loan/retail-professional-loan.component";
import {SmeComponent} from "./component/offer-letter/sme/sme.component";
import {RetailEducationalLoanEnglishComponent} from "./component/offer-letter/retail-educational-loan-english/retail-educational-loan-english.component";
import {RetailMortgageLoanComponent} from "./component/offer-letter/retail-mortgage-loan/retail-mortgage-loan.component";
import {RetailMortgageComponent} from "./component/offer-letter/retail-mortgage/retail-mortgage.component";
import {RetailEducationalLoanComponent} from "./component/offer-letter/retail-educational-loan/retail-educational-loan.component";
import {HayerPurchasePrintComponent} from "./component/offer-letter/hayer-purchase/hayer-purchase-print/hayer-purchase-print.component";
import {RetailEducationalLoanPrintComponent} from "./component/offer-letter/retail-educational-loan/retail-educational-loan-print/retail-educational-loan-print.component";
import {RetailEducationalLoanEnglishPrintComponent} from "./component/offer-letter/retail-educational-loan-english/retail-educational-loan-english-print/retail-educational-loan-english-print.component";
import {RetailHousingLoanPrintComponent} from "./component/offer-letter/retail-housing-loan/retail-housing-loan-print/retail-housing-loan-print.component";
import {RetailMortgagePrintComponent} from "./component/offer-letter/retail-mortgage/retail-mortgage-print/retail-mortgage-print.component";
import {RetailMortgageLoanPrintComponent} from "./component/offer-letter/retail-mortgage-loan/retail-mortgage-loan-print/retail-mortgage-loan-print.component";
import {RetailProfessionalLoanPrintComponent} from "./component/offer-letter/retail-professional-loan/retail-professional-loan-print/retail-professional-loan-print.component";
import {SmePrintComponent} from "./component/offer-letter/sme/sme-print/sme-print.component";

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
  OfferLetterUploadComponent,
  OfferLetterComponent,
    OfferLetterComponent,
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
  HayerPurchasePrintComponent,
  RetailEducationalLoanPrintComponent,
  RetailEducationalLoanEnglishPrintComponent,
  RetailHousingLoanPrintComponent,
  RetailMortgagePrintComponent,
  RetailMortgageLoanPrintComponent,
  RetailProfessionalLoanPrintComponent,
  SmePrintComponent,
  HayerPurchaseComponent,
  RetailEducationalLoanComponent,
  RetailMortgageComponent,
  RetailEducationalLoanEnglishComponent,
  RetailHousingLoanComponent,
  RetailMortgageLoanComponent,
  RetailProfessionalLoanComponent,
  SmeComponent,
  ApplicantFamilyInfoPrintComponent,
  BikeKarjaPrintComponent,
  CustomerAssociateComponent,
    CustomerAssociateComponent,
  LoanActionModalComponent,
  LoanActionVerificationComponent,
  LoanActionCombinedModalComponent,
  GuarantorAdderComponent,
  GuarantorDetailComponent,
];

const ENTRY_COMPONENTS = [
  ReadmoreModelComponent,
  LoanMainNepaliTemplateComponent,
  CustomerInfoNepaliComponent,
  CustomerAssociateComponent,
  LoanActionModalComponent,
  LoanActionVerificationComponent,
  LoanActionCombinedModalComponent,
  GuarantorDetailComponent
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
  declarations: [...COMPONENTS,
    SummaryBaseComponent,
    HayerPurchaseComponent,
    RetailHousingLoanComponent, RetailProfessionalLoanComponent,
    SmeComponent, RetailEducationalLoanEnglishComponent,
    RetailMortgageLoanComponent, RetailMortgageComponent, RetailEducationalLoanComponent],
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
    AngularDraggableModule
  ],

  providers: [
    DatePipe,
    LoanFormService,
    NgbActiveModal
  ],

  entryComponents: [...ENTRY_COMPONENTS],
  exports: []
})
export class LoanModule {
}

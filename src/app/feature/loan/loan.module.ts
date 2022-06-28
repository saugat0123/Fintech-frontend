import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPrintModule} from 'ngx-print';
import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
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
import {CustomerModule} from '../customer/customer.module';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanActionModalComponent} from './loan-action/loan-action-modal/loan-action-modal.component';
import {LoanActionVerificationComponent} from './loan-action/loan-action-verification/loan-action-verification.component';
import {LoanActionCombinedModalComponent} from './loan-action/loan-action-combined-modal/loan-action-combined-modal.component';
import {QuillModule} from 'ngx-quill';
import {AngularDraggableModule} from 'angular2-draggable';
import {AssignedOfferLetterComponent} from './loan-offer-letter/assigned-offer-letter/assigned-offer-letter.component';
import { PostApprovalFormComponent } from './loan-offer-letter/post-approval-form/post-approval-form.component';
import {TransferDocComponent} from './transfer-doc/transfer-doc.component';
import {CustomerWiseLoanPullComponent} from './component/loan-pull/customer-wise-loan-pull/customer-wise-loan-pull.component';
import {NepaliPatroModule} from 'nepali-patro';
import {TransferLoanModule} from '../transfer-loan/transfer-loan.module';
import {CreditAdministrationModule} from '../credit-administration/credit-administration.module';

const COMPONENTS = [
    LoanFormComponent,
    LoanActionComponent,
    ReadmoreModelComponent,

    LoanPullComponent,
    LoanPullComponent,
    LoanOfferLetterComponent,
    OfferLetterActionComponent,
    LoanActionModalComponent,
    LoanActionVerificationComponent,
    LoanActionCombinedModalComponent,
];

const ENTRY_COMPONENTS = [
    ReadmoreModelComponent,
    LoanActionModalComponent,
    LoanActionVerificationComponent,
    LoanActionCombinedModalComponent,
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
    declarations: [...COMPONENTS, AssignedOfferLetterComponent, PostApprovalFormComponent, TransferDocComponent, CustomerWiseLoanPullComponent],
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
    LoanInformationTemplateModule,
    QuillModule.forRoot({modules: modules}),
    AngularDraggableModule,
    NbTooltipModule,
    NepaliPatroModule,
    TransferLoanModule,
    CreditAdministrationModule
  ],

    providers: [
        DatePipe,
        LoanFormService,
        NgbActiveModal
    ],

    entryComponents: [...ENTRY_COMPONENTS],
    exports: [
        // KycInfoComponent,
        // MicroProposalSummaryComponent,
        // MicroBaselRiskExposureSummaryComponent
        CustomerWiseLoanPullComponent
    ]
})
export class LoanModule {
}

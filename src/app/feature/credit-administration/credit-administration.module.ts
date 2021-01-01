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
import {DisbursementComponent} from './cad-work-flow/cad-work-flow-base/legal-and-disbursement/disbursement/disbursement.component';
import {MegaOfferLetterTemplateModule} from './mega-offer-letter-template/mega-offer-letter-template.module';
import {CadDocumentTemplateModule} from './cad-document-template/cad-document-template.module';
import {NbDialogModule} from '@nebular/theme';
import { OfferLetterListComponent } from './component/offer-letter-list/offer-letter-list.component';
import { CadOfferLetterProfileComponent } from './cad-offerletter-profile/cad-offerletter-profile.component';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
    declarations: [UnassignedLoanComponent,
        AssignPopUpComponent,
        LoanListComponent,
        VerifyPopUpComponent,
        CadWorkFlowBaseComponent,
        OfferLetterBaseComponent,
        LegalAndDisbursementComponent,
        CadActionComponent,
        DisbursementComponent,
        OfferLetterListComponent,
        CadOfferLetterProfileComponent],
    imports: [
        ThemeModule,
        CommonModule,
        NbDialogModule.forRoot(),
        MegaOfferLetterTemplateModule,
        CadDocumentTemplateModule,
        RouterModule.forChild(routes),
        NgSelectModule
    ],
    entryComponents: [AssignPopUpComponent, VerifyPopUpComponent]
})
export class CreditAdministrationModule {
}

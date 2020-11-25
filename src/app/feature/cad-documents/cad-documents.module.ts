import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CadDocumentCoreComponent} from './cad-document-core/cad-document-core.component';
import {MegaOfferLetterComponent} from './cad-document-core/mega-offer-letter/mega-offer-letter.component';
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
import {HayerPurchaseComponent} from './cad-document-core/mega-offer-letter/hayer-purchase/hayer-purchase.component';
import {HayerPurchasePrintComponent} from './cad-document-core/mega-offer-letter/hayer-purchase/hayer-purchase-print/hayer-purchase-print.component';
import {RetailEducationalLoanComponent} from './cad-document-core/mega-offer-letter/retail-educational-loan/retail-educational-loan.component';
import {RetailEducationalLoanPrintComponent} from './cad-document-core/mega-offer-letter/retail-educational-loan/retail-educational-loan-print/retail-educational-loan-print.component';
import {RetailEducationalLoanEnglishComponent} from './cad-document-core/mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english.component';
import {RetailEducationalLoanEnglishPrintComponent} from './cad-document-core/mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english-print/retail-educational-loan-english-print.component';
import {RetailHousingLoanComponent} from './cad-document-core/mega-offer-letter/retail-housing-loan/retail-housing-loan.component';
import {RetailHousingLoanPrintComponent} from './cad-document-core/mega-offer-letter/retail-housing-loan/retail-housing-loan-print/retail-housing-loan-print.component';
import {RetailMortgageComponent} from './cad-document-core/mega-offer-letter/retail-mortgage/retail-mortgage.component';
import {RetailMortgagePrintComponent} from './cad-document-core/mega-offer-letter/retail-mortgage/retail-mortgage-print/retail-mortgage-print.component';
import {RetailMortgageLoanComponent} from './cad-document-core/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component';
import {RetailMortgageLoanPrintComponent} from './cad-document-core/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan-print/retail-mortgage-loan-print.component';
import {RetailProfessionalLoanComponent} from './cad-document-core/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {RetailProfessionalLoanPrintComponent} from './cad-document-core/mega-offer-letter/retail-professional-loan/retail-professional-loan-print/retail-professional-loan-print.component';
import {SmeComponent} from './cad-document-core/mega-offer-letter/sme/sme.component';
import {SmePrintComponent} from './cad-document-core/mega-offer-letter/sme/sme-print/sme-print.component';
import {PostApprovalDocApproveComponent} from './post-approval-doc-approve/post-approval-doc-approve.component';
import { CadLoginComponent } from './cad-login/cad-login.component';


const COMPONENTS = [
    CadDocumentCoreComponent,
    MegaOfferLetterComponent,
    SrdbOfferLetterComponent,
    OfferLetterUploadComponent,
    OfferLetterActionComponent,
    HayerPurchaseComponent,
    HayerPurchasePrintComponent,
    RetailEducationalLoanComponent,
    RetailEducationalLoanPrintComponent,
    RetailEducationalLoanEnglishComponent,
    RetailEducationalLoanEnglishPrintComponent,
    RetailHousingLoanComponent,
    RetailHousingLoanPrintComponent,
    RetailHousingLoanPrintComponent,
    RetailMortgageComponent,
    RetailMortgagePrintComponent,
    RetailMortgageLoanComponent,
    RetailMortgageLoanPrintComponent,
    RetailProfessionalLoanComponent,
    RetailProfessionalLoanPrintComponent,
    SmeComponent,
    SmePrintComponent,

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
        RouterModule.forChild(cadDocumentRoute)
    ], entryComponents: [PostApprovalDocApproveComponent]
})
export class CadDocumentsModule {
}

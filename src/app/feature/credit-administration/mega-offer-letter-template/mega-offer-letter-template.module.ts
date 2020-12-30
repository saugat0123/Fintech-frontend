import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CadDocumentCoreComponent} from '../../cad-documents/cad-document-core/cad-document-core.component';
import {MegaOfferLetterComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/mega-offer-letter.component';
import {SrdbOfferLetterComponent} from '../../cad-documents/cad-document-core/srdb-offer-letter/srdb-offer-letter.component';
import {OfferLetterUploadComponent} from '../../cad-documents/offer-letter-upload/offer-letter-upload.component';
import {OfferLetterActionComponent} from '../../cad-documents/offer-letter-action/offer-letter-action.component';
import {HayerPurchaseComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/hayer-purchase/hayer-purchase.component';
import {HayerPurchasePrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/hayer-purchase/hayer-purchase-print/hayer-purchase-print.component';
import {RetailEducationalLoanComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-educational-loan/retail-educational-loan.component';
import {RetailEducationalLoanPrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-educational-loan/retail-educational-loan-print/retail-educational-loan-print.component';
import {RetailEducationalLoanEnglishComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english.component';
import {RetailEducationalLoanEnglishPrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english-print/retail-educational-loan-english-print.component';
import {RetailHousingLoanComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-housing-loan/retail-housing-loan.component';
import {RetailHousingLoanPrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-housing-loan/retail-housing-loan-print/retail-housing-loan-print.component';
import {RetailMortgageComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-mortgage/retail-mortgage.component';
import {RetailMortgagePrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-mortgage/retail-mortgage-print/retail-mortgage-print.component';
import {RetailMortgageLoanComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component';
import {RetailMortgageLoanPrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan-print/retail-mortgage-loan-print.component';
import {RetailProfessionalLoanComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {RetailProfessionalLoanPrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/retail-professional-loan/retail-professional-loan-print/retail-professional-loan-print.component';
import {SmeComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/sme/sme.component';
import {SmePrintComponent} from '../../cad-documents/cad-document-core/mega-offer-letter/sme/sme-print/sme-print.component';

const COMPONENTS = [
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
  declarations: [...COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class MegaOfferLetterTemplateModule { }

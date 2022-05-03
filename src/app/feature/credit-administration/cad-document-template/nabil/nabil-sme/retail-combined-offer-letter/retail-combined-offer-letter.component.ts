import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {
  Section1CustomerOfferLetterTypeComponent
} from './retail-combined-offer-letter-sections/section1-customer-offer-letter-type/section1-customer-offer-letter-type.component';
import {
  Section2LoanTypeRetailComponent
} from './retail-combined-offer-letter-sections/section2-loan-type-retail/section2-loan-type-retail.component';
import {
  Section7InterestAndEmiPaymentRelatedComponent
} from './retail-combined-offer-letter-sections/section7-interest-and-emi-payment-related/section7-interest-and-emi-payment-related.component';
import {
  Section8LoanDisbursementRelatedClauseComponent
} from './retail-combined-offer-letter-sections/section8-loan-disbursement-related-clause/section8-loan-disbursement-related-clause.component';
import {
  Section18RequiredSecurityDocumentsComponent
} from './retail-combined-offer-letter-sections/section18-required-security-documents/section18-required-security-documents.component';
import {
  Section19ToSection22Component
} from './retail-combined-offer-letter-sections/section19-to-section22/section19-to-section22.component';

@Component({
  selector: 'app-retail-combined-offer-letter',
  templateUrl: './retail-combined-offer-letter.component.html',
  styleUrls: ['./retail-combined-offer-letter.component.scss']
})
export class RetailCombinedOfferLetterComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @ViewChild('section1' , {static: false}) section1: Section1CustomerOfferLetterTypeComponent;
  @ViewChild('section2', {static: false}) section2: Section2LoanTypeRetailComponent;
  @ViewChild('section7', {static: false}) section7: Section7InterestAndEmiPaymentRelatedComponent;
  @ViewChild('section8', {static: false}) section8: Section8LoanDisbursementRelatedClauseComponent;
  @ViewChild('section18', {static: false}) section18: Section18RequiredSecurityDocumentsComponent;
  @ViewChild('section22', {static: false}) section22: Section19ToSection22Component;

  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo: any;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  offerLetterData;
  allFreeText;
  constructor(private dialogRef: NbDialogRef<RetailCombinedOfferLetterComponent>,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService
  ) { }

  ngOnInit() {
    this.checkOfferLetterData();
  }

  checkOfferLetterData() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc) &&
    !ObjectUtil.isEmpty(this.customerApprovedDoc.offerDocumentList)) {
      if (this.customerApprovedDoc.offerDocumentList.length > 0) {
        this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
          this.offerLetterDocument = new OfferDocument();
          this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
        } else {
          const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
          if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
            this.offerLetterData = this.offerLetterDocument;
            this.allFreeText = JSON.parse(this.offerLetterData.supportedInformation);
          }
          this.existingOfferLetter = true;
        }
      }
    }
  }

  onSubmit() {
    this.spinner = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER)
            .toString()) {
          offerLetterPath.supportedInformation = this.setFreeText();
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.COMBINED_LETTER);
      offerDocument.supportedInformation = this.setFreeText();
    }

    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.dialogRef.close();
      // this.routerUtilsService.reloadCadProfileRoute(this.customerApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      // this.routerUtilsService.reloadCadProfileRoute(this.customerApprovedDoc.id);
    });
  }

  setFreeText() {
    const section1FreeText = this.section1.form.get('freetext1').value ? this.section1.form.get('freetext1').value : '';
    const section2FreeText = this.section2.setTextAreaValue();
    const section7FreeText = this.section7.form.get('freeDate').value ? this.section7.form.get('freeDate').value : '';
    const section8FreeText = this.section8.setTextAreaValue();
    const section18FreeText = this.section18.form.get('freeText2').value ? this.section18.form.get('freeText2').value : '';
    // const section22FreeText = {
    //   freeText2: this.section22.form.get('freeText2').value ? this.section22.form.get('freeText2').value : '',
    //   // freeText3: this.section22.form.get('freeText3').value ? this.section22.form.get('freeText3').value : '',
    //   // freeText4: this.section22.form.get('freeText4').value ? this.section22.form.get('freeText4').value : '',
    //   freeText5: this.section22.form.get('freeText5').value ? this.section22.form.get('freeText5').value : '',
    //   freeTable: this.section22.form.get('freeTable').value,
    //   textField: this.section22.form.get('textField').value ? this.section22.form.get('textField').value : '',
    // }

    const freeTextVal = {
      section1: section1FreeText,
      section2: section2FreeText,
      section7: section7FreeText,
      section8: section8FreeText,
      section18: section18FreeText,
      // section22: section22FreeText
    };
    return JSON.stringify(freeTextVal);
  }

  close() {
    this.dialogRef.close();
  }

}

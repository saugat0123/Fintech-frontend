import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {Section10SecurityDocumentsComponent} from "./combined-letter-sections/section10-security-documents/section10-security-documents.component";
import {OfferDocument} from "../../../../model/OfferDocument";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {Section2LoanTypeComponent} from "./combined-letter-sections/section2-loan-type/section2-loan-type.component";
import {Section3SecurityAndCollateralComponent} from "./combined-letter-sections/section3-security-and-collateral/section3-security-and-collateral.component";
import {Section9OtherClauseComponent} from "./combined-letter-sections/section9-other-clause/section9-other-clause.component";
import {Section1IntroductionComponent} from "./combined-letter-sections/section1-introduction/section1-introduction.component";
import {RouterUtilsService} from "../../../../utils/router-utils.service";

@Component({
  selector: 'app-combined-offer-letter',
  templateUrl: './combined-offer-letter.component.html',
  styleUrls: ['./combined-offer-letter.component.scss']
})
export class CombinedOfferLetterComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo: any;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  offerLetterData;
  allFreeText;
  @ViewChild('section1', {static: false}) section1: Section1IntroductionComponent;
  @ViewChild('section2', {static: false}) section2: Section2LoanTypeComponent;
  @ViewChild('section3', {static: false}) section3: Section3SecurityAndCollateralComponent;
  @ViewChild('section9', {static: false}) section9: Section9OtherClauseComponent;
  @ViewChild('section10', {static: false}) section10: Section10SecurityDocumentsComponent;

  constructor(private dialogRef: NbDialogRef<CombinedOfferLetterComponent>,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
    }
    this.checkOfferLetterData();
  }

  close() {
    this.dialogRef.close();
  }


  checkOfferLetterData() {
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
    const section1FreeText = this.section1.section1.get('firstAdditionalDetails').value ? this.section1.section1.get('firstAdditionalDetails').value : '';
    const section2FreeText = {
      freeText1: this.section2.form.get('freeTextOne').value ? this.section2.form.get('freeTextOne').value : '',
      freeText2: this.section2.form.get('freeTextTwo').value ? this.section2.form.get('freeTextTwo').value : '',
      freeText3: this.section2.form.get('freeTextThree').value ? this.section2.form.get('freeTextThree').value : '',
      freeText4: this.section2.form.get('freeTextFour').value ? this.section2.form.get('freeTextFour').value : '',
      freeText5: this.section2.form.get('freeTextFive').value ? this.section2.form.get('freeTextFive').value : '',
      freeText6: this.section2.form.get('freeTextSix').value ? this.section2.form.get('freeTextSix').value : '',
      freeText7: this.section2.form.get('freeTextSeven').value ? this.section2.form.get('freeTextSeven').value : '',
      freeText8: this.section2.form.get('freeTextEight').value ? this.section2.form.get('freeTextEight').value : '',
      freeText9: this.section2.form.get('freeTextNine').value ? this.section2.form.get('freeTextNine').value : '',
      freeText10: this.section2.form.get('freeTextFifteen').value ? this.section2.form.get('freeTextFifteen').value : '',
      freeText11: this.section2.form.get('freeTextSixteen').value ? this.section2.form.get('freeTextSixteen').value : '',
      // freeTextOthers: this.section2.form.get('otherFreeTexts').value ? this.section2.form.get('otherFreeTexts').value : '',
    }
    const section3FreeText = {
      freeText1: this.section3.form.get('freeText1').value ? this.section3.form.get('freeText1').value : '',
      freeText2: this.section3.form.get('freeText2').value ? this.section3.form.get('freeText2').value : '',
      freeText3: this.section3.form.get('freeText3').value ? this.section3.form.get('freeText3').value : '',
      freeText4: this.section3.form.get('freeText4').value ? this.section3.form.get('freeText4').value : '',
      freeText5: this.section3.form.get('freeText5').value ? this.section3.form.get('freeText5').value : '',
    }
    const section9FreeText = {
      freeText1: this.section9.form.get('freeText1').value ? this.section9.form.get('freeText1').value : '',
    }
    const section10FreeText = this.section10.form.get('additionalGuarantorDetails').value ? this.section10.form.get('additionalGuarantorDetails').value : '';
    const freeTextVal = {
      section1: section1FreeText,
      section2: section2FreeText,
      section3: section3FreeText,
      section9: section9FreeText,
      section10: section10FreeText,
    };
    return JSON.stringify(freeTextVal);
  }
}

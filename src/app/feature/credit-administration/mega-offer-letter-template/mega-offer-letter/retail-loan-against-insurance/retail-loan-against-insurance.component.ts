import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {OfferDocument} from "../../../model/OfferDocument";
import {CadDocStatus} from "../../../model/CadDocStatus";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {MegaOfferLetterConst} from "../../../mega-offer-letter-const";
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {Router} from "@angular/router";
import {ToastService} from "../../../../../@core/utils";
import {RouterUtilsService} from "../../../utils/router-utils.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {NbDialogRef} from "@nebular/theme";
import {CadOfferLetterModalComponent} from "../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";

@Component({
  selector: 'app-retail-loan-against-insurance',
  templateUrl: './retail-loan-against-insurance.component.html',
  styleUrls: ['./retail-loan-against-insurance.component.scss']
})
export class RetailLoanAgainstInsuranceComponent implements OnInit {
  retailLoanAgainstInsurance: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) { }

  ngOnInit(): void {
    this.buildForm();
    this.checkOfferLetterData();
  }
  buildForm(){
    this.retailLoanAgainstInsurance = this.formBuilder.group({
      offerLetterDate: [undefined],
      borrowerName: [undefined],
      borrowerAddress: [undefined],
      borrowerContactNo: [undefined],
      borrowerName1: [undefined],
      termLoanDebitLimitAmount: [undefined],
      termLoanDebitLimitAmountWord: [undefined],
      termLoanPurpose: [undefined],
      termLoanPremiumRate: [undefined],
      termLoanYearlyInterest: [undefined],
      termLoanFirstInstallment: [undefined],
      termLoanInstallmentRate: [undefined],
      termLoanInstallmentRateWords: [undefined],
      termLoanServiceChargeRate: [undefined],
      termLoanServiceChargeRateWords: [undefined],
      termLoanCustomAmount: [undefined],
      overdraftDebitLimitAmount: [undefined],
      overdraftDebitLimitAmountWords: [undefined],
      overdraftPurpose: [undefined],
      overdraftTimePeriod: [undefined],
      overdraftPremiumRate: [undefined],
      overdraftYearlyInterest: [undefined],
      overdraftServiceChargeRate: [undefined],
      overdraftServiceChargeRateWords: [undefined],
      overdraftCustomAmount: [undefined],
      demandLoanPremiumRate: [undefined],
      demandLoanPremiumRateWords: [undefined],
      demandLoanServiceChargeRate: [undefined],
      demandLoanServiceChargeRateWords: [undefined],
      demandLoanCustomAmount: [undefined],
      insuranceCompanyName: [undefined],
      borrowerInsuranceNo: [undefined],
      borrowerName2: [undefined],
      borrowerAddress2: [undefined],
      borrowerContactNo2: [undefined],
      pageCount: [undefined],
      identityCardNo: [undefined],
      identityCardNo1: [undefined],
      borrowerName3: [undefined],
      offerLetterDate2: [undefined],
    });
  }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log(initialInfo);
        this.initialInfoPrint = initialInfo;
        console.log(this.offerLetterDocument);
        this.existingOfferLetter = true;
        this.retailLoanAgainstInsurance.patchValue(initialInfo, {emitEvent: false});
        this.initialInfoPrint = initialInfo;
      }
    }
  }


  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE)
            .toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.retailLoanAgainstInsurance.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_LOAN_AGAINST_INSURANCE);
      offerDocument.initialInformation = JSON.stringify(this.retailLoanAgainstInsurance.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Retail Loan Against Insurance Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Retail Loan Against Insurance Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }

}

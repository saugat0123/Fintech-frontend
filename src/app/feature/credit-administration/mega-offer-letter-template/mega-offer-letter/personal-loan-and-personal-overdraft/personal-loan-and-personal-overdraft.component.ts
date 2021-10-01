import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
  selector: 'app-personal-loan-and-personal-overdraft',
  templateUrl: './personal-loan-and-personal-overdraft.component.html',
  styleUrls: ['./personal-loan-and-personal-overdraft.component.scss']
})
export class PersonalLoanAndPersonalOverdraftComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  nepData;
  external = [];
  offerLetterData;
  tempData;
  loanHolderInfo;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<PersonalLoanAndPersonalOverdraftComponent>
  ) { }

  ngOnInit() {
    this.buildPersonal();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      console.log('data', this.tempData);
    }
    this.checkOfferLetterData(); }
  buildPersonal() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      purposeofLoan: [undefined],
      loanAmountinFigure: [undefined],
      loanAmountinWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanAdminFeeinFigure: [undefined],
      loanAdminFeeinWords: [undefined],
      loanadminFee: [undefined],
      emiInFigure: [undefined],
      emiInWords: [undefined],
      loanExpiryDate: [undefined],
      nameofGuarantors: [undefined],
      guaranteedAmountInFigure: [undefined],
      guaranteedAmountInWords: [undefined],
      nameofBranch: [undefined],
      accountNumberOfCustomer: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      NameofCustomer: [undefined],
      accountofCustomer: [undefined],
      relationshipofficerName: [undefined],
      branchName: [undefined],
      date: [undefined],
      district: [undefined],
      wardNum: [undefined],
      freeText: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
    });
  }
  setLoanConfigData(data: any) {
    let cadNepData = {
      numberNepali: ')',
      nepaliWords: 'सुन्य',
    };
    const customerAddress =
        data.permanentMunicipality + ' , ' +
        data.permanentWard + ' , ' +
        data.permanentProvince + ' , ' +
        data.permanentDistrict;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
      cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
    }
    this.form.patchValue({
      customerName: data.name ? data.name : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: cadNepData.numberNepali,
      loanNameInWords: cadNepData.nepaliWords,
    });
  }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.fillForm();
        this.initialInfoPrint = initialInfo;
      }
    } else {
      this.fillForm();
    }
  }
  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    this.form.patchValue({
      customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountinWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      referenceNumber: this.tempData.referenceNumber.ct ? this.tempData.referenceNumber.ct : '',
      dateofApproval: this.tempData.dateofApproval.ct ? this.tempData.dateofApproval.ct : '',
      dateofApplication: this.tempData.dateofApplication.ct ? this.tempData.dateofApplication.ct : '',
      purposeofLoan: this.tempData.purposeofLoan.ct ? this.tempData.purposeofLoan.ct : '',
      loanadminFee: this.tempData.loanadminFee.ct ? this.tempData.loanadminFee.ct : '',
      emiInFigure: this.tempData.emiInFigure.ct ? this.tempData.emiInFigure.ct : '',
      emiInWords: this.tempData.emiInWords.ct ? this.tempData.emiInWords.ct : '',
      loanExpiryDate: this.tempData.loanExpiryDate.ct ? this.tempData.loanExpiryDate.ct : '',
      nameofGuarantors: this.tempData.nameofGuarantors.ct ? this.tempData.nameofGuarantors.ct : '',
      guaranteedAmountInFigure: this.tempData.guaranteedAmountInFigure.ct ? this.tempData.guaranteedAmountInFigure.ct : '',
      guaranteedAmountInWords: this.tempData.guaranteedAmountInWords.ct ? this.tempData.guaranteedAmountInWords.ct : '',
      nameofBranch : this.tempData.nameofBranch.ct ? this.tempData.nameofBranch.ct : '',
      accountNumberOfCustomer: this.tempData.accountNumberOfCustomer.ct ? this.tempData.accountNumberOfCustomer.ct : '',
      relationshipofficerName: this.tempData.relationshipofficerName.ct ? this.tempData.relationshipofficerName.ct : '',
      branchName: this.tempData.branchName.ct ? this.tempData.branchName.ct : '',
      date: this.tempData.date.ct ? this.tempData.date.ct : '',
      district : this.tempData.district.ct ? this.tempData.district.ct : '',
      wardNum : this.tempData.wardNum.ct ? this.tempData.wardNum.ct : '',
      witnessName : this.tempData.witnessName.ct ? this.tempData.witnessName.ct : '',
      staffName : this.tempData.staffName.ct ? this.tempData.staffName.ct : '',
    });
    // this.retailProfessionalLoan.patchValue(this.loanHolderInfo);
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
  close() {
    this.ref.close();
  }
}

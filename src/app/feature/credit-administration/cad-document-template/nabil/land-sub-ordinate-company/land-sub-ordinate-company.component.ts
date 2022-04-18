import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-land-sub-ordinate-company',
  templateUrl: './land-sub-ordinate-company.component.html',
  styleUrls: ['./land-sub-ordinate-company.component.scss']
})
export class LandSubOrdinateCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  nepData;
  isInstitutional = false;
  clientType;
  loanHolderNepData: any;
  initialInfoPrint;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  offerDocumentDetails: any;
  totalAmount;
  totalAmountInWord;
  supportedInfo;
  spinner = false;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              public engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
      // this.cadData.cadFileList.forEach(singleCadFile => {
      //   if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
      //     this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
      //     const initialInfo = JSON.parse(singleCadFile.initialInformation);
      //     this.initialInfoPrint = initialInfo;
      //     this.form.patchValue(initialInfo);
      //   }
      // });
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData ?
          JSON.parse(this.cadData.loanHolder.nepData) :
          this.cadData.loanHolder.nepData;
    }
    this.setTotalAmount();
    this.patchFreeText();
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      nameOfBranch: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      WitnessWardNumber: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipality2: [undefined],
      WitnessWardNumber2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      bankStaff: [undefined],
      borrowerName: [undefined],
      borrowerAddress: [undefined],
      freeText1: [undefined],
      freeText2: [undefined],
      loanProviderName: [undefined],
      loanProviderAddress: [undefined],
      freeText3: [undefined],
      freeText4: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      borrowerAuthorizedPerson: [undefined],
      borrowerAuthorizedPersonAddress: [undefined],
      loanProviderAuthorizedPerson: [undefined],
      loanProviderAuthorizedPersonAddress: [undefined],
    });
  }

  fillForm() {
    const customerAddress = this.individualData.registeredMunicipality.ct + '-' +
        this.individualData.permanentWard.ct + ', ' + this.individualData.registeredDistrict.ct + ', ' +
        this.individualData.registeredProvince.ct;
    this.form.patchValue({
      date: this.supportedInfo ? this.supportedInfo.date : '',
      nameOfBranch: this.individualData.branch ? this.individualData.branch.ct : '',
      borrowerName: this.individualData.name ? this.individualData.name.ct : '',
      borrowerAddress: customerAddress ? customerAddress : '',
      witnessDistrict: this.supportedInfo ? this.supportedInfo.witnessDistrict : '',
      witnessMunicipality: this.supportedInfo ? this.supportedInfo.witnessMunicipality : '',
      WitnessWardNumber: this.supportedInfo ? this.supportedInfo.WitnessWardNumber : '',
      witnessAge: this.supportedInfo ? this.supportedInfo.witnessAge : '',
      witnessName: this.supportedInfo ? this.supportedInfo.witnessName : '',
      witnessDistrict2: this.supportedInfo ? this.supportedInfo.witnessDistrict2 : '',
      witnessMunicipality2: this.supportedInfo ? this.supportedInfo.witnessMunicipality2 : '',
      WitnessWardNumber2: this.supportedInfo ? this.supportedInfo.WitnessWardNumber2 : '',
      witnessAge2: this.supportedInfo ? this.supportedInfo.witnessAge2 : '',
      witnessName2: this.supportedInfo ? this.supportedInfo.witnessName2 : '',
      bankStaff: this.supportedInfo ? this.supportedInfo.bankStaff : '',
      freeText1: this.supportedInfo ? this.supportedInfo.freeText1 : '',
      freeText2: this.supportedInfo ? this.supportedInfo.freeText2 : '',
      loanProviderName: this.supportedInfo ? this.supportedInfo.loanProviderName : '',
      loanProviderAddress: this.supportedInfo ? this.supportedInfo.loanProviderAddress : '',
      freeText3: this.supportedInfo ? this.supportedInfo.freeText3 : '',
      freeText4: this.supportedInfo ? this.supportedInfo.freeText4 : '',
      amount: this.supportedInfo ? this.supportedInfo.amount : '',
      amountInWords: this.supportedInfo ? this.supportedInfo.amountInWords : '',
      borrowerAuthorizedPerson: this.supportedInfo ? this.supportedInfo.borrowerAuthorizedPerson : '',
      borrowerAuthorizedPersonAddress: this.supportedInfo ? this.supportedInfo.borrowerAuthorizedPersonAddress : '',
      loanProviderAuthorizedPerson: this.supportedInfo ? this.supportedInfo.loanProviderAuthorizedPerson : '',
      loanProviderAuthorizedPersonAddress: this.supportedInfo ? this.supportedInfo.loanProviderAuthorizedPersonAddress : '',
    });
  }

  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.totalAmount = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT : '';
        this.totalAmountInWord = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT ) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigure) ?
            this.offerDocumentDetails.loanLimitAmountFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigureWords) ?
            this.offerDocumentDetails.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInFigure) ?
            this.offerDocumentDetails.totalLimitInFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInWords) ?
            this.offerDocumentDetails.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitFigure) ?
            this.offerDocumentDetails.totalLimitFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitWords) ?
            this.offerDocumentDetails.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.totalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.totalAmountInWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.totalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigure) ?
            this.offerDocumentDetails.loanAmountFigure.ct : '';
        this.totalAmountInWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigureWords) ?
            this.offerDocumentDetails.loanAmountFigureWords.ct : '';
      }
    }
  }

  setFreeText() {
    const free1 = {
      date: this.form.get('date') ? this.form.get('date').value : '',
      freeText1: this.form.get('freeText1').value ? this.form.get('freeText1').value : '',
      freeText2: this.form.get('freeText2').value ? this.form.get('freeText2').value : '',
      freeText3: this.form.get('freeText3').value ? this.form.get('freeText3').value : '',
      freeText4: this.form.get('freeText4').value ? this.form.get('freeText4').value : '',
      loanProviderName: this.form.get('loanProviderName') ? this.form.get('loanProviderName').value : '',
      loanProviderAddress: this.form.get('loanProviderAddress') ? this.form.get('loanProviderAddress').value : '',
      borrowerAuthorizedPerson: this.form.get('borrowerAuthorizedPerson') ? this.form.get('borrowerAuthorizedPerson').value : '',
      borrowerAuthorizedPersonAddress: this.form.get('borrowerAuthorizedPersonAddress') ? this.form.get('borrowerAuthorizedPersonAddress').value : '',
      loanProviderAuthorizedPerson: this.form.get('loanProviderAuthorizedPerson') ? this.form.get('loanProviderAuthorizedPerson').value : '',
      loanProviderAuthorizedPersonAddress: this.form.get('loanProviderAuthorizedPersonAddress') ? this.form.get('loanProviderAuthorizedPersonAddress').value : '',
      witnessDistrict: this.form.get('witnessDistrict') ? this.form.get('witnessDistrict').value : '',
      witnessMunicipality: this.form.get('witnessMunicipality') ? this.form.get('witnessMunicipality').value : '',
      WitnessWardNumber: this.form.get('WitnessWardNumber') ? this.form.get('WitnessWardNumber').value : '',
      witnessAge: this.form.get('witnessAge') ? this.form.get('witnessAge').value : '',
      witnessName: this.form.get('witnessName') ? this.form.get('witnessName').value : '',
      witnessDistrict2: this.form.get('witnessDistrict2') ? this.form.get('witnessDistrict2').value : '',
      witnessMunicipality2: this.form.get('witnessMunicipality2') ? this.form.get('witnessMunicipality2').value : '',
      WitnessWardNumber2: this.form.get('WitnessWardNumber2') ? this.form.get('WitnessWardNumber2').value : '',
      witnessAge2: this.form.get('witnessAge2') ? this.form.get('witnessAge2').value : '',
      witnessName2: this.form.get('witnessName2') ? this.form.get('witnessName2').value : '',
      bankStaff: this.form.get('bankStaff') ? this.form.get('bankStaff').value : '',
      amount: this.form.get('amount') ? this.form.get('amount').value : '',
      amountInWords: this.form.get('amountInWords') ? this.form.get('amountInWords').value : '',
    };
    return JSON.stringify(free1);
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
  }
  submit() {
    let flag = true;
    this.spinner = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          // singleCadFile.initialInformation = JSON.stringify(this.form.value);
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.form.value);
        this.initialInfoPrint = cadFile.initialInformation;
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      this.initialInfoPrint = cadFile.initialInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.spinner = false;
      this.dialogRef.close();
    });
  }
  public translateNumber(figure, words): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.form.get(figure).value);
    const numberTrans = this.engToNepNumberPipe.transform(this.form.get(figure).value, true);
    this.form.get(words).patchValue(transformValue);
    this.form.get(figure).patchValue(numberTrans);
  }
}

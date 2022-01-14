import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NabilDocumentChecklist } from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-supplementary-aggrement-proprietorship',
  templateUrl: './supplementary-aggrement-proprietorship.component.html',
  styleUrls: ['./supplementary-aggrement-proprietorship.component.scss']
})
export class SupplementaryAggrementProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  supplementaryAgreementProprietorship: FormGroup;
  individualData;
  finalAmount;
  loanAmountWord;
  supportedInfo;
  initialInfo;
  sanctionDate;
  offerLetterConst = NabilDocumentChecklist;
  freeTextVal: Array<any> = new Array<any>();
  nepData;
  constructor(private  formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              public engToNepaliDate: EngNepDatePipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      let totalLoan = 0;
      this.cadData.assignedLoan.forEach(val => {
        const proposedAmount = val.proposal.proposedLimit;
        totalLoan = totalLoan + proposedAmount;
      });
      this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
      this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    }
    this.setFreeInfo();
    this.fillForm();
  }
  buildForm() {
    this.supplementaryAgreementProprietorship = this.formBuilder.group({
      date: [undefined],
      bankAddress: [undefined],
      firmName: [undefined],
      dateOfHypothecation: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      dateOfTrustReceipt: [undefined],
      letterOfCreditNo: [undefined],
      letterOfCreditIssuedDate: [undefined],
      totalLoanAmountInFigure: [undefined],
      bankStaff: [undefined],
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
      securityFreeText: this.formBuilder.array([])
    });
    this.addTextArea();
  }
  setFreeText() {
    for (let i = 0; i < this.supplementaryAgreementProprietorship.get('securityFreeText')['length']; i++) {
      const free = {
        freeTexts: this.supplementaryAgreementProprietorship.get(['securityFreeText', i, 'freeTexts'])
            ? this.supplementaryAgreementProprietorship.get(['securityFreeText', i, 'freeTexts']).value : '',
      };
      this.freeTextVal.push(free);
    }
    const tempFree = {
      freeTextVal : this.freeTextVal,
      date: this.supplementaryAgreementProprietorship.get('date') ? this.supplementaryAgreementProprietorship.get('date').value : '',
      witnessDistrict: this.supplementaryAgreementProprietorship.get('witnessDistrict') ? this.supplementaryAgreementProprietorship.get('witnessDistrict').value : '',
      witnessMunicipality: this.supplementaryAgreementProprietorship.
      get('witnessMunicipality') ? this.supplementaryAgreementProprietorship.get('witnessMunicipality').value : '',
      WitnessWardNumber: this.supplementaryAgreementProprietorship.get('WitnessWardNumber') ? this.supplementaryAgreementProprietorship.get('WitnessWardNumber').value : '',
      witnessAge: this.supplementaryAgreementProprietorship.
      get('witnessAge') ? this.supplementaryAgreementProprietorship.get('witnessAge').value : '',
      witnessName: this.supplementaryAgreementProprietorship.get('witnessName') ? this.supplementaryAgreementProprietorship.get('witnessName').value : '',
      witnessDistrict2: this.supplementaryAgreementProprietorship.get('witnessDistrict2') ? this.supplementaryAgreementProprietorship.get('witnessDistrict2').value : '',
      witnessMunicipality2: this.supplementaryAgreementProprietorship.
      get('witnessMunicipality2') ? this.supplementaryAgreementProprietorship.get('witnessMunicipality2').value : '',
      WitnessWardNumber2: this.supplementaryAgreementProprietorship.
      get('WitnessWardNumber2') ? this.supplementaryAgreementProprietorship.get('WitnessWardNumber2').value : '',
      witnessAge2: this.supplementaryAgreementProprietorship.get('witnessAge2') ? this.supplementaryAgreementProprietorship.get('witnessAge2').value : '',
      witnessName2: this.supplementaryAgreementProprietorship.get('witnessName2') ? this.supplementaryAgreementProprietorship.get('witnessName2').value : '',
      bankStaff: this.supplementaryAgreementProprietorship.
      get('bankStaff') ? this.supplementaryAgreementProprietorship.get('bankStaff').value : '',
    };
    return JSON.stringify(tempFree);
  }
  fillForm() {
    // for sanction letter date
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      console.log('hire', this.cadData);
      if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
          this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName !== 'DDSL Without Subsidy' &&
          this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter' &&
          this.cadData.offerDocumentList[0].docName !== 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        const dateOfApproval = this.initialInfo.smeGlobalForm.dateOfApprovalType ?
            this.initialInfo.smeGlobalForm.dateOfApprovalType : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.engToNepaliDate.transform(this.initialInfo.smeGlobalForm.dateOfApproval ?
              this.initialInfo.smeGlobalForm.dateOfApprovalCT : '', true);
        } else {
          this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalNepali ?
              this.initialInfo.smeGlobalForm.dateOfApprovalNepali.nDate : '';
        }
      }
    }
    let totalAmount = 0;
    this.cadData.assignedLoan.map(x => {
      const proposedAmount =  x.proposal.proposedLimit;
      totalAmount = totalAmount + proposedAmount;
    });
    const loanAmountInFigure = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalAmount));
    const loanAmountInWords = this.nepaliCurrencyWordPipe.transform(totalAmount);
    this.supplementaryAgreementProprietorship.patchValue({
      bankAddress: this.individualData.branch ? this.individualData.branch.ct : '',
      firmName: this.individualData.name ? this.individualData.name.ct : '',
      sanctionLetterIssuedDate: this.sanctionDate ? this.sanctionDate : '',
      loanAmountInFigure: loanAmountInFigure ? loanAmountInFigure : '',
      loanAmountInWords: loanAmountInWords ? loanAmountInWords : '',
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
      date: this.supportedInfo ? this.supportedInfo.date : '',
    });
    if (!ObjectUtil.isEmpty(this.supportedInfo.freeTextVal)) {
      for (let val = 0; val < this.supportedInfo.freeTextVal.length - 1; val++) {
        this.addTextArea();
      }
      for (let i = 0; i < this.supportedInfo.freeTextVal.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.supplementaryAgreementProprietorship.get(['securityFreeText', i, 'freeTexts']).patchValue(this.supportedInfo.freeTextVal[i].freeTexts);
      }
    }
  }
  setFreeInfo() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        document.id = this.documentId;
        cadFile.supportedInformation = this.setFreeText();
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }
    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
  addTextArea() {
    (this.supplementaryAgreementProprietorship.get('securityFreeText') as FormArray).push(
        this.formBuilder.group({
          freeTexts: [undefined]
        })
    );
  }
  removeAtIndex(i: number) {
    (this.supplementaryAgreementProprietorship.get('securityFreeText') as FormArray).removeAt(i);
  }
}

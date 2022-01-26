import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../@core/utils/ObjectUtil";
import {EngToNepaliNumberPipe} from "../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../@core/pipe/currency-formatter.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CadFile} from "../../../../../model/CadFile";
import {Document} from "../../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../../@theme/model/Alert";
import {CreditAdministrationService} from "../../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../../@core/utils";
import {NbDialogRef} from "@nebular/theme";
import {CadOfferLetterModalComponent} from "../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";
import {RouterUtilsService} from "../../../../../utils/router-utils.service";
import {EngNepDatePipe} from "nepali-patro";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-power-of-attorney-company',
  templateUrl: './power-of-attorney-company.component.html',
  styleUrls: ['./power-of-attorney-company.component.scss']
})
export class PowerOfAttorneyCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  powerOfAttorneyCompanyForm: FormGroup;
  companyInfo: any;
  offerDocumentDetails: any;
  loanHolderNepData: any;
  finalAmount;
  loanAmountWord;
  spinner = false;
  freeText;
  dateArray: Array<any> = new Array<any>();

  constructor(private formBuilder: FormBuilder,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              public englishNepaliDatePipe: EngNepDatePipe,
              public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.setData();
    this.buildForm();
  }

  setData() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
      this.companyInfo.forEach(val => {
        const date = this.englishNepaliDatePipe.transform(this.datePipe.transform(val.ownerCitizenshipIssuedDateCT), true);
        this.dateArray.push(date);
      })
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.freeText = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
  }

  buildForm() {
    this.powerOfAttorneyCompanyForm = this.formBuilder.group({
      districtOfCompany: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      vdcCompany: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
      wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      streetName: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      nameOfBorrower: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
      freeText1: [this.freeText ? this.freeText.freeText1 : ''],
      freeText2: [this.freeText ? this.freeText.freeText2 : ''],

      branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      sanctionLetterIssuedDate: [this.setApprovalDate()],
      loanAmountInFigure: [this.finalAmount ? this.finalAmount : ''],
      loanAmountInWords: [this.loanAmountWord ? this.loanAmountWord : ''],

      authorizedDistrict: [undefined],
      authorizedVDC: [undefined],
      authorizedWardNumber: [undefined],
      authorizedName: [undefined],
      authorizedCitizenship: [undefined],
      authorizedDateOfIssue: [undefined],
      authorizedIdentity: [undefined],

      sakshiDistrict1: [this.freeText ? this.freeText.sakshiDistrict1 : ''],
      sakshiDistrict2: [this.freeText ? this.freeText.sakshiDistrict2 : ''],
      sakshiMunicipality1: [this.freeText ? this.freeText.sakshiMunicipality1 : ''],
      sakshiMunicipality2: [this.freeText ? this.freeText.sakshiMunicipality2 : ''],
      sakshiAge1: [this.freeText ? this.freeText.sakshiAge1 : ''],
      sakshiAge2: [this.freeText ? this.freeText.sakshiAge2 : ''],
      sakshiWard1: [this.freeText ? this.freeText.sakshiWard1 : ''],
      sakshiWard2: [this.freeText ? this.freeText.sakshiWard2 : ''],
      sakshiName1: [this.freeText ? this.freeText.sakshiName1 : ''],
      sakshiName2: [this.freeText ? this.freeText.sakshiName2 : ''],
      nameOfBankStaff: [this.freeText ? this.freeText.nameOfBankStaff : ''],
    });
  }

  setFreeText() {
    const free = {
      freeText1: this.powerOfAttorneyCompanyForm.get('freeText1').value ? this.powerOfAttorneyCompanyForm.get('freeText1').value : '',
      freeText2: this.powerOfAttorneyCompanyForm.get('freeText2').value ?this.powerOfAttorneyCompanyForm.get('freeText2').value : '',
      sakshiDistrict1: this.powerOfAttorneyCompanyForm.get('sakshiDistrict1').value ? this.powerOfAttorneyCompanyForm.get('sakshiDistrict1').value : '',
      sakshiDistrict2: this.powerOfAttorneyCompanyForm.get('sakshiDistrict2').value ? this.powerOfAttorneyCompanyForm.get('sakshiDistrict2').value : '',
      sakshiMunicipality1: this.powerOfAttorneyCompanyForm.get('sakshiMunicipality1').value ? this.powerOfAttorneyCompanyForm.get('sakshiMunicipality1').value : '',
      sakshiMunicipality2: this.powerOfAttorneyCompanyForm.get('sakshiMunicipality2').value ? this.powerOfAttorneyCompanyForm.get('sakshiMunicipality2').value : '',
      sakshiAge1: this.powerOfAttorneyCompanyForm.get('sakshiAge1').value ? this.powerOfAttorneyCompanyForm.get('sakshiAge1').value : '',
      sakshiAge2: this.powerOfAttorneyCompanyForm.get('sakshiAge2').value ? this.powerOfAttorneyCompanyForm.get('sakshiAge2').value : '',
      sakshiWard1: this.powerOfAttorneyCompanyForm.get('sakshiWard1').value ? this.powerOfAttorneyCompanyForm.get('sakshiWard1').value : '',
      sakshiWard2: this.powerOfAttorneyCompanyForm.get('sakshiWard2').value ? this.powerOfAttorneyCompanyForm.get('sakshiWard2').value : '',
      sakshiName1: this.powerOfAttorneyCompanyForm.get('sakshiName1').value ? this.powerOfAttorneyCompanyForm.get('sakshiName1').value : '',
      sakshiName2: this.powerOfAttorneyCompanyForm.get('sakshiName2').value ? this.powerOfAttorneyCompanyForm.get('sakshiName2').value : '',
      nameOfBankStaff: this.powerOfAttorneyCompanyForm.get('nameOfBankStaff').value ? this.powerOfAttorneyCompanyForm.get('nameOfBankStaff').value : '',
    }
    return JSON.stringify(free);
  }

  setApprovalDate() {
    let approvalDate;
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        approvalDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : ''
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en : '';
        approvalDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
      const dateOfApprovalType = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType ?
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApproval ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali : '';
        approvalDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
      const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (sanctionLetterDate === 'AD') {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
        approvalDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
      } else {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
        approvalDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
      }
    }
    return approvalDate ? approvalDate : '';
  }

  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.powerOfAttorneyCompanyForm.value);
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.powerOfAttorneyCompanyForm.value);
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }
}

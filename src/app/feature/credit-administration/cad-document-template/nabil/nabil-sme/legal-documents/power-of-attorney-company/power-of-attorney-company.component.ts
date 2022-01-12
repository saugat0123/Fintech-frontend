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

  constructor(private formBuilder: FormBuilder,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private englishNepaliDatePipe: EngNepDatePipe,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.setData();
    this.buildForm();
  }

  setData() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
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
    });
  }

  setFreeText() {
    const free = {
      freeText1: this.powerOfAttorneyCompanyForm.get('freeText1').value,
      freeText2: this.powerOfAttorneyCompanyForm.get('freeText2').value
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
      approvalDate = this.englishNepaliDatePipe.transform(this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT ?
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT :
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT, true);
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

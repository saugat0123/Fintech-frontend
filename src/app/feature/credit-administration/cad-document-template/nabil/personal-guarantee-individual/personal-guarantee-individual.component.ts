import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "../../../../../@core/utils";
import { RouterUtilsService } from "../../../utils/router-utils.service";
import { CreditAdministrationService } from "../../../service/credit-administration.service";
import { NepaliCurrencyWordPipe } from "../../../../../@core/pipe/nepali-currency-word.pipe";
import { EngToNepaliNumberPipe } from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import { CurrencyFormatterPipe } from "../../../../../@core/pipe/currency-formatter.pipe";
import { NepaliToEngNumberPipe } from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import { NepaliPercentWordPipe } from "../../../../../@core/pipe/nepali-percent-word.pipe";
import { CustomerApprovedLoanCadDocumentation } from "../../../model/customerApprovedLoanCadDocumentation";
import { NepaliNumberAndWords } from "../../../model/nepaliNumberAndWords";
import { NabilDocumentChecklist } from "../../../../admin/modal/nabil-document-checklist.enum";
import { ObjectUtil } from "../../../../../@core/utils/ObjectUtil";
import { CadFile } from "../../../model/CadFile";
import { Document } from "../../../../admin/modal/document";
import { Alert, AlertType } from "../../../../../@theme/model/Alert";
import { NbDialogRef } from "@nebular/theme";
import { CadOfferLetterModalComponent } from "../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component";
import { EngNepDatePipe } from "nepali-patro";
import { ProposalCalculationUtils } from "../../../../loan/component/loan-summary/ProposalCalculationUtils";
import { LoanDataKey } from "../../../../../@core/utils/constants/loan-data-key";

@Component({
  selector: "app-personal-guarantee-individual",
  templateUrl: "./personal-guarantee-individual.component.html",
  styleUrls: ["./personal-guarantee-individual.component.scss"],
})
export class PersonalGuaranteeIndividualComponent implements OnInit, OnChanges {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  guarantorindividualGroup: FormGroup;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  individualData;
  taggedGuarantorsDetailsInLoan = [];
  loanHolderNepData: any;
  offerDocumentDetails: any;
  nepaliNumber = new NepaliNumberAndWords();
  guarantorsNepData = [];
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  docName: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private routerUtilService: RouterUtilsService,
    private administrationService: CreditAdministrationService,
    private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    private engToNepNumberPipe: EngToNepaliNumberPipe,
    private currencyFormatPipe: CurrencyFormatterPipe,
    private nepToEngNumberPipe: NepaliToEngNumberPipe,
    private englishNepaliDatePipe: EngNepDatePipe,
    private nepPercentWordPipe: NepaliPercentWordPipe,
    private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
    private routerUtilsService: RouterUtilsService
  ) {}

  ngOnChanges() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
        ? JSON.parse(this.cadData.loanHolder.nepData)
        : this.cadData.loanHolder.nepData;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
      new Set(
        this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
      )
    ).map((val) => JSON.parse(val));
  }

  ngOnInit() {
    this.buildForm();
    // if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
    //   this.cadData.cadFileList.forEach(individualCadFile => {
    //     if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
    //       const initialInfo = JSON.parse(individualCadFile.initialInformation);
    //       this.initialInfoPrint = initialInfo;
    //       this.guarantorindividualGroup.patchValue(initialInfo);
    //     }
    //   });
    // }
    // if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
    //   this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    // }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
        ? JSON.parse(this.cadData.loanHolder.nepData)
        : this.cadData.loanHolder.nepData;
      this.individualData = this.cadData.loanHolder;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList[0] ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
      new Set(
        this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
      )
    ).map((val) => JSON.parse(val));
  }

  buildForm() {
    this.guarantorindividualGroup = this.formBuilder.group({
      individualGuarantors: this.formBuilder.array([]),
    });
    this.taggedGuarantorsDetailsForm();
    this.calulation();
  }

  removeIndividualGuarantors(i) {
    (
      this.guarantorindividualGroup.get("individualGuarantors") as FormArray
    ).removeAt(i);
  }

  refreshGuarantors() {
    this.buildForm();
  }

  addIndividualGuarantorsForm() {
    (
      this.guarantorindividualGroup.get("individualGuarantors") as FormArray
    ).push(this.initIndividualGuarantors());
  }

  initIndividualGuarantors() {
    return this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      father_husbandName: [undefined],
      district: [undefined],
      VDCMunicipality: [undefined],
      ward: [undefined],
      temporarydistrict: [undefined],
      temporaryVDCMunicipality: [undefined],
      temporaryward: [undefined],
      borrowerName: [undefined],
      loanPurpose: [undefined],
      dateOfApproval: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      guarantorName: [undefined],
      guarantorFatherOrHusbandName: [undefined],
      guarantorGrandFatherName: [undefined],

      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWard: [undefined],

      guarantorTemporaryDistrict: [undefined],
      guarantorTemporaryMunicipality: [undefined],
      guarantorTemporaryWard: [undefined],

      guarantorCitizenNumber: [undefined],
      guarantorCitzenIssuedPlace: [undefined],
      guarantorCitzenIssuedDate: [undefined],
      gurantedAmount: [undefined],

      year: [undefined],
      month: [undefined],
      day: [undefined],
      date: [undefined],
      freeText: [undefined],
    });
  }

  taggedGuarantorsDetailsForm() {
      console.log('Personal guarantee data',this.offerDocumentDetails);
      let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
    todayDate = todayDate.replace(',', '').split(' ');
    const daysInNumber = new Date().getDay();

    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        const individualGuarantorNepData = val.nepData
          ? JSON.parse(val.nepData)
          : val.nepData;
        this.guarantorsNepData.push(individualGuarantorNepData);
        if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
          return;
        }
        let approvedDate: any;
        this.docName = this.cadData.offerDocumentList ? this.cadData.offerDocumentList[0].docName : '';
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails)) {
              // tslint:disable-next-line:max-line-length
              // approvedDate = (this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en.eDate) ? (this.offerDocumentDetails.dateOfApproval.en.eDate) : (this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en) ? (this.offerDocumentDetails.dateOfApproval.en) : ((this.offerDocumentDetails.loan.nepaliDateOfApproval && this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate) ? (this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate) : (''));
              if ((this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '') === 'AD') {
                  // tslint:disable-next-line:max-line-length
                  approvedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
              } else if (this.docName === 'Auto Loan' && this.offerDocumentDetails.dateOfApproval.en.eDate) {
                  approvedDate = this.offerDocumentDetails.dateOfApproval.en.eDate;
              } else if (this.docName === 'Mortage Loan' && this.offerDocumentDetails.dateofApproval.en.eDate) {
                  approvedDate = this.offerDocumentDetails.dateofApproval.en.eDate;
              } else {
                  // tslint:disable-next-line:max-line-length
                  approvedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en.eDate : '';
              }
          }
        let citznIssuedDate: any;
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDate)) {
            citznIssuedDate = individualGuarantorNepData.citizenIssuedDate && individualGuarantorNepData.citizenIssuedDate.en.eDate ? individualGuarantorNepData.citizenIssuedDate.en.eDate : individualGuarantorNepData.citizenIssuedDate.en ? individualGuarantorNepData.citizenIssuedDate.en : '';
        }
        (
          this.guarantorindividualGroup.get("individualGuarantors") as FormArray
        ).push(
          this.formBuilder.group({
            branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
            grandFatherName: [this.loanHolderNepData.grandFatherName ? this.loanHolderNepData.grandFatherName.ct
                : this.loanHolderNepData.fatherInLawName ? this.loanHolderNepData.fatherInLawName.ct : ''],
            father_husbandName: [this.loanHolderNepData.fatherName ? this.loanHolderNepData.fatherName.ct
                : this.loanHolderNepData.husbandName ? this.loanHolderNepData.husbandName.ct : ''],
            district: [this.loanHolderNepData.permanentDistrict ? this.loanHolderNepData.permanentDistrict.ct : ''],
            VDCMunicipality: [
              this.loanHolderNepData.permanentMunicipality ? this.loanHolderNepData.permanentMunicipality.ct : '',
            ],
            ward: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
            temporarydistrict: [undefined],
            temporaryVDCMunicipality: [undefined],
            temporaryward: [undefined],
            borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
            loanPurpose: [this.offerDocumentDetails.loanPurpose ? this.offerDocumentDetails.loanPurpose.ct : this.offerDocumentDetails.purposeOfLoan && this.offerDocumentDetails ? this.offerDocumentDetails.purposeOfLoan.ct : this.offerDocumentDetails.vehicleName ? (this.offerDocumentDetails.vehicleName.ct + ' नामको सवारी साधन एक थान व्यक्तिगत प्रयोजनका लागि खरिद') : this.offerDocumentDetails.loan.purposeOfLoanCT ? this.offerDocumentDetails.loan.purposeOfLoanCT : ('')],
            dateOfApproval: [this.englishNepaliDatePipe.transform(approvedDate || '', true)  || ''],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            guaranteAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
            guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
            guarantorFatherOrHusbandName: [
              individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : ''
            ],
            guarantorGrandFatherName: [
              individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : individualGuarantorNepData.fatherInLawName ? individualGuarantorNepData.fatherInLawName.ct : ''
            ],

            guarantorPermanentDistrict: [
              individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : '',
            ],
            guarantorPermanentMunicipality: [
              individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : '',
            ],
            guarantorPermanentWard: [
              individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : '',
            ],

            guarantorTemporaryDistrict: [
              individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : '',
            ],
            guarantorTemporaryMunicipality: [
              individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : '',
            ],
            guarantorTemporaryWard: [
              individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : '',
            ],

            guarantorCitizenNumber: [
              individualGuarantorNepData.citizenNumber ? individualGuarantorNepData.citizenNumber.ct : '',
            ],
            guarantorCitzenIssuedPlace: [
              individualGuarantorNepData.issuedPlace ? individualGuarantorNepData.issuedPlace.ct : '',
            ],
            guarantorCitzenIssuedDate: [
              this.englishNepaliDatePipe.transform(citznIssuedDate || '', true)  || ''
            ],
            gurantedAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount ? individualGuarantorNepData.gurantedAmount.en : ''))],
            year: [undefined],
            month: [undefined],
            day: [undefined],
            //date: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],
              date: [undefined],
            freeText: [undefined],
          })
        );
      });
    }
  }


  calulation() {
    if (ObjectUtil.isEmpty(this.cadData.nepData)) {
        const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
        this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
        this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
        this.nepaliNumber.engNumber = number;
    } else {
        this.nepaliNumber = JSON.parse(this.cadData.nepData);
    }

  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(
      this.guarantorindividualGroup.get(numLabel).value
    );
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.guarantorindividualGroup.get(wordLabel).patchValue(returnVal);
  }
  submit() {
    let flag = true;
    if (
      !ObjectUtil.isEmpty(this.cadData) &&
      !ObjectUtil.isEmpty(this.cadData.cadFileList)
    ) {
      this.cadData.cadFileList.forEach((singleCadFile) => {
        if (
          singleCadFile.customerLoanId === this.customerLoanId &&
          singleCadFile.cadDocument.id === this.documentId
        ) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(
            this.guarantorindividualGroup.value
          );
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(
          this.guarantorindividualGroup.value
        );
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(
        this.guarantorindividualGroup.value
      );
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(
      () => {
        this.toastService.show(
          new Alert(AlertType.SUCCESS, "Successfully saved ")
        );
        this.dialogRef.close();
        this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      },
      (error) => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, "Failed to save "));
        this.dialogRef.close();
      }
    );
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import { NepaliNumberAndWords } from '../../../model/nepaliNumberAndWords';
import { NepaliToEngNumberPipe } from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import { EngNepDatePipe } from 'nepali-patro';
import { NepaliCurrencyWordPipe } from '../../../../../@core/pipe/nepali-currency-word.pipe';
import { EngToNepaliNumberPipe } from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import { CurrencyFormatterPipe } from '../../../../../@core/pipe/currency-formatter.pipe';
import { ProposalCalculationUtils } from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-personal-guarantee-company',
  templateUrl: './personal-guarantee-company.component.html',
  styleUrls: ['./personal-guarantee-company.component.scss']
})
export class PersonalGuaranteeCompanyComponent implements OnInit {

  personalGuaranteeCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  nepData;
  guarantorData;
  submitted = false;

  taggedGuarantorsDetailsInLoan = [];
  loanHolderNepData: any;
  offerDocumentDetails: any;
  nepaliNumber = new NepaliNumberAndWords();
  freeText: Array<any> = new Array<any>();
  cadFreeText;
  loanPurpose = 'व्यापार/ व्यवसाय संचालन';
  spinner = false;
  cadInitialInfo;

    constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private englishNepaliDatePipe: EngNepDatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private routerUtilsService: RouterUtilsService,
              private datePipe: DatePipe) { }
  // ngOnInit(): void {
  //   this.buildForm();
  //   const guarantorList = this.cadData.loanHolder.guarantors.guarantorList;
  //   if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
  //     this.cadData.cadFileList.forEach(singleCadFile => {
  //       if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
  //         this.personalGuaranteeCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
  //       }
  //     });
  //   }
  //   if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
  //     this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
  //     this.guarantorData = Object.values(this.nepData.guarantorDetails);
  //   }
  //   if (!ObjectUtil.isEmpty(guarantorList)) {
  //     const guarantorDetails = this.personalGuaranteeCompany.get('personalGuaranteeCompany') as FormArray;
  //     console.log('list' , guarantorList);
  //     console.log('details' , guarantorDetails);
  //     // guarantorList.forEach(e => {
  //     //   guarantorDetails.push(
  //     //       this.formBuilder.group({
  //     //         guarantorName : e.name,
  //     //         date : e.issuedYear,
  //     //         guarantorIssueDistrict : e.issuedPlace,
  //     //         guarantorAddress : e.district,
  //     //         guarantorRelationship : e.relationship,
  //     //         citizenshipNo : e.citizenNumber
  //     //       })
  //     //   ); }
  //     // );
  //   }
  // }

  ngOnInit() {
    this.loadPersonalGuarantorData();
    this.buildForm();
    this.fillGuarantee();
  }

    fillGuarantee() {
        if (this.cadData.cadFileList.length > 0) {
            this.cadInitialInfo = JSON.parse(this.cadData.cadFileList[0].supportedInformation);
            // this.cadFreeText = this.cadInitialInfo.guaranteeCompanies;
            const free = this.personalGuaranteeCompany.value;
            if (this.cadInitialInfo !== null) {
                for (let val = 0; val < free.guaranteeCompanies.length; val++) {
                    this.personalGuaranteeCompany.get(['guaranteeCompanies', val, 'freeText']).patchValue(this.cadInitialInfo ? this.cadInitialInfo[val].freeText : '');
                }
            }
        }
    }


  loadPersonalGuarantorData() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
        ? JSON.parse(this.cadData.loanHolder.nepData)
        : this.cadData.loanHolder.nepData;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
      new Set(
        this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
      )
    ).map((val) => JSON.parse(val));
  }

  buildForm() {
    this.personalGuaranteeCompany = this.formBuilder.group({
      guaranteeCompanies: this.formBuilder.array([]),
    });
    this.calulation();
    this.taggedPersonalGuarantorsDetailsForm();
  }

  initIndividualGuarantors() {
    return this.formBuilder.group({});
  }

  taggedPersonalGuarantorsDetailsForm() {
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        const individualGuarantorNepData = val.nepData
          ? JSON.parse(val.nepData)
          : val.nepData;
        if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
          return;
        }
          console.log('individualGuarantorNepData: ', individualGuarantorNepData);
          (this.personalGuaranteeCompany.get("guaranteeCompanies") as FormArray).push(
              this.formBuilder.group({
                  branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                  actDetails: [this.loanHolderNepData.actName.ct ? this.loanHolderNepData.actName.ct : ''],
                  actYearInFigure: [this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np :
                                    this.loanHolderNepData.actYear.en ? this.engToNepNumberPipe.transform((this.loanHolderNepData.actYear.en).toString()) : ''],
                  authorizedBodyName: [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : 'नेपाल सरकार'],
                  headDepartment: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                  registrationDate: [this.setRegistrationDate()],
                  registrationNo: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.ct : ''],
                  location: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
                  municipalityName: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
                  wardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
                  streetAddress: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
                  loaneeName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                  loanPurpose: [this.setLoanPurpose()],
                  letterIssuedDate: [this.setApprovalDate()],
                  loanAmount: [this.nepaliNumber.numberNepali],
                  loanAmountInWord: [this.nepaliNumber.nepaliWords],

                  approvedLoanAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount.en))],
                  approvedLoanAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                  freeText: [undefined],

                  guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                  guarantorFatherOrHusbandName: [individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : ''],
                  grandFatherOrFatherInLaw: [individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : individualGuarantorNepData.fatherInLawName ? individualGuarantorNepData.fatherInLawName.ct : ''],
                  permanentDistrict: [individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : '',],
                  permanentMunicipalities: [individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : '',],
                  permanentWard: [individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : '',],

                  temporaryDistrict: [individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : '',],
                  temporaryMunicipalities: [individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : '',],
                  temporaryWard: [individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : '',],

                  citizenshipNo: [individualGuarantorNepData.citizenNumber ? individualGuarantorNepData.citizenNumber.ct : '',],
                  issuedBy: [individualGuarantorNepData.issuedPlace ? individualGuarantorNepData.issuedPlace.ct : '',],
                  issuedDate: [this.englishNepaliDatePipe.transform(individualGuarantorNepData.citizenIssuedDate.en.eDate ? individualGuarantorNepData.citizenIssuedDate.en.eDate : individualGuarantorNepData.citizenIssuedDate.en, true) || ''
                  ],
              })
      );
      })
    }
  }

    setRegistrationDate() {
        let expiryDate = '';
        if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
            expiryDate = this.englishNepaliDatePipe.transform(this.loanHolderNepData.registrationDate.np, true);
        } else {
            expiryDate = this.loanHolderNepData.registrationDate.en.nDate;
        }
        return expiryDate;
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

    setLoanPurpose() {
        let loanKoPurpose = '';
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
            loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
        }
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
            loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
        }
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
            loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
        }
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.mortgageEquityTermForm) {
            loanKoPurpose = this.offerDocumentDetails.mortgageEquityTermForm.purposeOfLoanCT;
        }
        if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.autoLoanMasterForm) {
            loanKoPurpose = this.offerDocumentDetails.autoLoanMasterForm.purposeOfLoanCT;
        }
        return loanKoPurpose ? loanKoPurpose : this.loanPurpose;
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

  setFreeText() {
    const free = this.personalGuaranteeCompany.value;
    for (let val = 0; val < free.guaranteeCompanies.length; val++) {
        const tempFreeText = {
            freeText: this.personalGuaranteeCompany.get(['guaranteeCompanies', val, 'freeText']) ? this.personalGuaranteeCompany.get(['guaranteeCompanies', val, 'freeText']).value : '',
            }
            this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
    }

    submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          // singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
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
    console.log(this.personalGuaranteeCompany.value);
  }

}

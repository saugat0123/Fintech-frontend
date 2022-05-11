import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {EngNepDatePipe} from 'nepali-patro';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {DatePipe} from '@angular/common';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
  selector: 'app-negative-lien-individual',
  templateUrl: './negative-lien-individual.component.html',
  styleUrls: ['./negative-lien-individual.component.scss']
})
export class NegativeLienIndividualComponent implements OnInit {
  @Input() cadData;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  initialInfoPrint;
  negativeLienForm: FormGroup;
  documentConstant = NabilDocumentChecklist;
  spinner = false;
  individualData;
  clientType;
  selectiveArr = [];
  jointInfoData;
  initialInfo;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  securityTypeCondition = false;
  assignment = false;
  paripassuNew = false;
  vehicleRegisterNew = false;
  generalCounter = false;
  securityTypeSecondaryCondition = false;
  securityTypeSecondaryCrossCondition = false;
  crossGuaranteeSecondary = false;
  sharePledgeSecondary = false;
  isPrimaryLandAndBuilding: boolean;
  isPrimary: boolean;
  isSecondaryLandAndBuilding: boolean;
  isSecondary: boolean;
  isTakeOver: boolean;
  isPrimaryAutoLoan: boolean;
  isSecondaryAutoLoan: boolean;
  isPrimaryEducationLoan: boolean;
  isSecondaryEducationLoan: boolean;
  isPrimaryMortgageNew: boolean;
  isPrimaryRemortgage: boolean;
  isPrimaryEnhancement: boolean;
  isPrimaryExisting: boolean;
  isPrimaryShared: boolean;
  isPrimaryEnhancementShared: boolean;
  isPrimaryGuarantee: boolean;
  isPrimarySharedSecurity: boolean;
  isSecondaryMortgageNew: boolean;
  isSecondaryRemortgage: boolean;
  isSecondaryEnhancement: boolean;
  isSecondaryExisting: boolean;
  isSecondaryShared: boolean;
  isSecondaryEnhancementShared: boolean;
  isSecondaryGuarantee: boolean;
  isSecondarySharedSecurity: boolean;
  tempLandBuilding;
  securityDetails;
  primaryCollateral: Array<any> = new Array<any>();
  secondaryCollateral: Array<any> = new Array<any>();
  primaryShare: Array<any> = new Array<any>();
  primaryEdu: Array<any> = new Array<any>();
  secondaryEdu: Array<any> = new Array<any>();
  secondaryShare: Array<any> = new Array<any>();
  loanName: Array<any> = new Array<any>();
  primarySharedSecurity: Array<any> = new Array<any>();
  secondarySharedSecurity: Array<any> = new Array<any>();
  guarantorData: Array<any> = new Array<any>();
  supportedInfo;
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private englishNepaliDatePipe: EngNepDatePipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      public datePipe: DatePipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private routerUtilsService: RouterUtilsService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && (!ObjectUtil.isEmpty(this.cadData.cadFileList))) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      this.securityDetails = this.initialInfo.securities;
    }
    this.checkCondition();
    this.fillForm();
    if (!ObjectUtil.isEmpty(this.securityDetails) &&
        !ObjectUtil.isEmpty(this.securityDetails.primarySecurity)) {
      if (this.securityDetails.primarySecurity.length > 0) {
        this.securityDetails.primarySecurity.forEach((i) => {
          if (
              i.securityType === 'LAND' ||
              i.securityType === 'LAND_AND_BUILDING'
          ) {
            this.securityTypeCondition = true;
          }
        });
      }
    }
    if (!ObjectUtil.isEmpty(this.securityDetails) &&
        !ObjectUtil.isEmpty(this.securityDetails.secondarySecurity)) {
      if (this.securityDetails.secondarySecurity.length > 0) {
        this.securityDetails.secondarySecurity.forEach((i) => {
          if (
              i.securityType === 'LAND' ||
              i.securityType === 'LAND_AND_BUILDING'
          ) {
            this.securityTypeSecondaryCondition = true;
          }
        });
      }
    }
    console.log('this.cadData', this.cadData);
  }

  buildForm() {
    return this.negativeLienForm = this.formBuilder.group({
      nameOfGrandfather: [undefined],
      fatherOrHusbandName: [undefined],
      sonOrDaughterName: [undefined],
      districtName: [undefined],
      municipalityVdcName: [undefined],
      wardNumber: [undefined],
      age: [undefined],
      nameOfBorrower: [undefined],
      citizenshipNumber: [undefined],
      dateOfIssue: [undefined],
      identityIssuedDistrict: [undefined],
      totalDebtor: [undefined],
      sanctionLetterDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWord: [undefined],
      ministryOfLandManagement: [undefined],
      landOwnerName: [undefined],
      provinceName: [undefined],
      districtNames: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      sambhad: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      subham: [undefined],
      jointDetailsArr: this.formBuilder.array([]),
      signatureData: this.formBuilder.array([]),
    });
  }
  ageCalculation(startDate) {
    startDate = this.datePipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
    const stDate = new Date(startDate);
    const endDate = new Date();
    let diff = (endDate.getTime() - stDate.getTime()) / 1000;
    diff = diff / (60 * 60 * 24);
    const yr = Math.abs(Math.round(diff / 365));
    return this.engToNepNumberPipe.transform(yr.toString());
  }
  fillForm() {
    let nameOfFatherOrHusband = '';
    if (!ObjectUtil.isEmpty(this.individualData)) {
      if (!ObjectUtil.isEmpty(this.individualData.relationMedium) &&
      !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
        if (this.individualData.relationMedium.en === '0') {
          nameOfFatherOrHusband = !ObjectUtil.isEmpty(this.individualData.husbandName) &&
              !ObjectUtil.isEmpty(this.individualData.husbandName.ct) ? this.individualData.husbandName.ct : '';
        } else {
          nameOfFatherOrHusband = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
          !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
        }
      }
    }
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.initialInfo.loanAmountPl ? this.initialInfo.loanAmountPl.ct : this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.initialInfo.loanAmountPlInWords ? this.initialInfo.loanAmountPlInWords.ct : this.nepaliCurrencyWordPipe.transform(totalLoan);
    let citizenshipIssuedDate;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate.en)) {
      if (this.individualData.issuedDate.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate)) {
          const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
          citizenshipIssuedDate = this.englishNepaliDatePipe.transform(convertedDate, true);
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDateNepali)) {
          citizenshipIssuedDate = this.individualData.citizenshipIssueDateNepali.en.nDate;
        }
      }
    }
    let age;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType.en)) {
      if (this.individualData.dobDateType.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.dob)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dob.en).toString());
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.dobNepali)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dobNepali.en.eDate).toString());
        }
      }
      let length = 1;
      if (!ObjectUtil.isEmpty(this.jointInfoData)) {
        length = this.jointInfoData.length;
        this.jointInfoData.forEach(value => {
          if (!ObjectUtil.isEmpty(value.nepData)) {
            const nep = JSON.parse(value.nepData);
            this.selectiveArr.push(nep);
          }
        });
        this.setJointDetailsArr(this.selectiveArr);
        this.setSignatureData(this.selectiveArr);
        // this.setIssuedDate();
      }
      console.log('This. individual data', this.individualData);
      this.negativeLienForm.patchValue({
        nameOfGrandfather: this.getGrandFatherName(),
        fatherOrHusbandName: this.getFatherName(),
        sonOrDaughterName: this.individualData.name.ct ? this.individualData.name.ct : '',
        districtName: this.individualData.permanentDistrict ? this.individualData.permanentDistrict.ct : '',
        municipalityVdcName: this.individualData.permanentMunicipality ? this.individualData.permanentMunicipality.ct : '',
        wardNumber: this.individualData.permanentWard ? this.individualData.permanentWard.ct : '',
        age: age ? age : '',
        nameOfBorrower: this.individualData.name ? this.individualData.name.ct : '',
        citizenshipNumber: this.individualData.citizenshipNo ? this.individualData.citizenshipNo.ct : '',
        dateOfIssue: citizenshipIssuedDate ? citizenshipIssuedDate : '',
        identityIssuedDistrict: this.individualData.citizenshipIssueDistrict ? this.individualData.citizenshipIssueDistrict.ct : '',
        totalDebtor: this.engToNepNumberPipe.transform(length.toString()) ? this.engToNepNumberPipe.transform(length.toString()) : '',
        loanAmountInFigure: finalAmount ? finalAmount : '',
        loanAmountInWord: loanAmountWord ? loanAmountWord : '',
        sanctionLetterDate: this.setIssuedDate() ? this.setIssuedDate() : '',
        ministryOfLandManagement: this.supportedInfo ? this.supportedInfo.ministryOfLandManagement : '',
        witnessDistrict1: this.supportedInfo ? this.supportedInfo.witnessDistrict1 : '',
        witnessMunicipalityOrVdc1: this.supportedInfo ? this.supportedInfo.witnessMunicipalityOrVdc1 : '',
        witnessWardNo1: this.supportedInfo ? this.supportedInfo.witnessWardNo1 : '',
        witnessAge1: this.supportedInfo ? this.supportedInfo.witnessAge1 : '',
        witnessName1: this.supportedInfo ? this.supportedInfo.witnessName1 : '',
        witnessDistrict2: this.supportedInfo ? this.supportedInfo.witnessDistrict2 : '',
        witnessMunicipalityOrVdc2: this.supportedInfo ? this.supportedInfo.witnessMunicipalityOrVdc2 : '',
        witnessWardNo2: this.supportedInfo ? this.supportedInfo.witnessWardNo2 : '',
        witnessAge2: this.supportedInfo ? this.supportedInfo.witnessAge2 : '',
        witnessName2: this.supportedInfo ? this.supportedInfo.witnessName2 : '',
        sambhad: this.supportedInfo ? this.supportedInfo.sambhad : '',
        year: this.supportedInfo ? this.supportedInfo.year : '',
        month: this.supportedInfo ? this.supportedInfo.month : '',
        day: this.supportedInfo ? this.supportedInfo.day : '',
        subham: this.supportedInfo ? this.supportedInfo.subham : '',
      });
    }
  }
  getGrandFatherName() {
    let grandFatherName;
    if (!ObjectUtil.isEmpty(this.individualData) && !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        if (!ObjectUtil.isEmpty(this.individualData.grandFatherName)) {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
      if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.fatherInLawName) &&
          !ObjectUtil.isEmpty(this.individualData.fatherInLawName.ct) ? this.individualData.fatherInLawName.ct : '';
        }
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
    }
    return grandFatherName;
  }

  getFatherName() {
    let fatherName;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
        !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE') {
        if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
          if (this.individualData.relationMedium.en === '0') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.husbandName) &&
                !ObjectUtil.isEmpty(this.individualData.husbandName.ct) ? this.individualData.husbandName.ct : '';
          }
          if (this.individualData.relationMedium.en === '1') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
            !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
          }
        }
      }
    }
    return fatherName;
  }

  submit() {
    let flag = true;
    this.spinner = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
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
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
      this.spinner = false;
    });
  }

  setJointDetailsArr(data) {
    const formArray = (this.negativeLienForm.get('jointDetailsArr') as FormArray);
    if (ObjectUtil.isEmpty(data)) {
      return;
    }
    data.forEach(value => {
      // if (!ObjectUtil.isEmpty(value.nepData)) {
      //
      // }
      const nepData = value;
      let age;
      if (!ObjectUtil.isEmpty(nepData.dob) && !ObjectUtil.isEmpty(nepData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(nepData.dob.en.eDate);
        age = this.ageCalculation(nepData.dob.en.eDate);
      } else {
        age = this.ageCalculation(nepData.dob.en);
      }
      let citizenshipIssuedDate;
      if (!ObjectUtil.isEmpty(nepData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = nepData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(nepData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.englishNepaliDatePipe.transform(convertedDate, true);
      }
      formArray.push(this.formBuilder.group({
        nameofGrandFatherJoint: [nepData.grandFatherName ?
            nepData.grandFatherName.ct :
            nepData.fatherInLawName ? nepData.fatherInLawName.ct : ''],
        nameofFatherJoint: [nepData.fatherName ?
            nepData.fatherName.ct :
            nepData.husbandName ? nepData.husbandName.ct : ''],
        districtJoint: [nepData.permanentDistrict.ct],
        vdcJoint: [nepData.permanentMunicipality.ct],
        wardNoJoint: [nepData.permanentWard.np || nepData.permanentWard.ct],
        ageJoint: [age ? age : ''],
        nameofPersonJoint: [nepData.name.np || nepData.name.ct],
        citizenshipNoJoint: [nepData.citizenNumber.np || nepData.citizenNumber.ct],
        dateofIssueJoint: [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
        nameofIssuedDistrictJoint: [nepData.citizenshipIssueDistrict.en.nepaliName],
      }));
    });
  }

  private setSignatureData(data) {
    const formArray = (this.negativeLienForm.get('signatureData') as FormArray);
    data.forEach(value => {
      const nepData = value;
      formArray.push(this.formBuilder.group({
        loanHolderNameJoint: [nepData.name ? nepData.name.ct : ''],
      }));
    });
  }
  checkCondition() {
    if (!ObjectUtil.isEmpty(this.initialInfo) &&
    !ObjectUtil.isEmpty(this.initialInfo.securities) &&
    !ObjectUtil.isEmpty(this.initialInfo.securities.primarySecurity)) {
      this.initialInfo.securities.primarySecurity.forEach(val => {
        if (!ObjectUtil.isEmpty(val.securityType)) {
          if (val.securityType === 'LAND_AND_BUILDING' || val.securityType === 'LAND') {
            this.isPrimaryLandAndBuilding = true;
            this.primaryCollateral.push(val);
            if (val.mortgageType === 'New') {
              this.isPrimaryMortgageNew = true;
            }
            if (val.mortgageType === 'Remortgage') {
              this.isPrimaryRemortgage = true;
            }
            if (val.mortgageType === 'Enhancement') {
              this.isPrimaryEnhancement = true;
            }
            if (val.mortgageType === 'Existing') {
              this.isPrimaryExisting = true;
            }
            if (val.collateralShare === 'YES') {
              this.primaryShare.push(val);
              this.isPrimaryShared = true;
              if (val.mortgageType === 'Enhancement') {
                this.isPrimaryEnhancementShared = true;
              }
            }
          }
          if (val.securityType === 'AUTO LOAN') {
            this.isPrimaryAutoLoan = true;
          }
          if (val.securityType === 'TD') {
            this.isPrimaryEducationLoan = true;
            this.primaryEdu.push(val);
          }
          if (val.securityType === 'PERSONAL GUARANTEE') {
            this.isPrimaryGuarantee = true;
          }
          if (val.securityType === 'SHARE SECURITY') {
            this.primarySharedSecurity.push(val);
            this.isPrimarySharedSecurity = true;
          }
          this.isPrimary = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) &&
        !ObjectUtil.isEmpty(this.initialInfo.securities) &&
        !ObjectUtil.isEmpty(this.initialInfo.securities.secondarySecurity)) {
      this.initialInfo.securities.secondarySecurity.forEach(val => {
        if (!ObjectUtil.isEmpty(val.securityType)) {
          if (val.securityType === 'LAND_AND_BUILDING' || val.securityType === 'LAND') {
            this.isSecondaryLandAndBuilding = true;
            this.secondaryCollateral.push(val);
            if (val.mortgageType === 'New') {
              this.isSecondaryMortgageNew = true;
            }
            if (val.mortgageType === 'Remortgage') {
              this.isSecondaryRemortgage = true;
            }
            if (val.mortgageType === 'Enhancement') {
              this.isSecondaryEnhancement = true;
            }
            if (val.mortgageType === 'Existing') {
              this.isSecondaryExisting = true;
            }
            if (val.collateralShare === 'YES') {
              this.secondaryShare.push(val);
              this.isSecondaryShared = true;
              if (val.mortgageType === 'Enhancement') {
                this.isSecondaryEnhancementShared = true;
              }
            }
          }
          if (val.securityType === 'AUTO LOAN') {
            this.isSecondaryAutoLoan = true;
          }
          if (val.securityType === 'TD') {
            this.isSecondaryEducationLoan = true;
            this.secondaryEdu.push(val);
          }
          if (val.securityType === 'PERSONAL GUARANTEE') {
            this.isSecondaryGuarantee = true;
          }
          if (val.securityType === 'SHARE SECURITY') {
            this.secondarySharedSecurity.push(val);
            this.isSecondarySharedSecurity = true;
          }
          this.isSecondary = true;
        }
      });
    }
    this.loanName.forEach(val => {
      if (val === 'HOME LOAN COMBINED') {
        if (!ObjectUtil.isEmpty(this.initialInfo) && !ObjectUtil.isEmpty(this.initialInfo.homeLoanCombinedForm)
            && !ObjectUtil.isEmpty(this.initialInfo.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
          this.initialInfo.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(value => {
            if (value.homeLoanCase === 'TAKEOVER') {
              this.isTakeOver = true;
            }
          });
        }
      }
    });
    if (this.guarantorData.length > 0) {
      this.patchGuarantor(this.guarantorData);
    }
  }
  setIssuedDate() {
    let sanctionDate = '';
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
      const dateOfApprovalType = this.initialInfo.retailGlobalForm.sanctionLetterDateType ?
          this.initialInfo.retailGlobalForm.sanctionLetterDateType : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDate ?
            this.initialInfo.retailGlobalForm.sanctionLetterDateCT : '';
        sanctionDate = templateDateApproval;
      } else {
        const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDateNepali ?
            this.initialInfo.retailGlobalForm.sanctionLetterDateNepaliCT : '';
        sanctionDate = templateDateApproval ? templateDateApproval : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Loan') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Overdraft') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal loan and personal overdraft') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.dateofApprovalNepali.en ? this.initialInfo.dateofApprovalNepali.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Home Loan') {
      const dateOfApprovalType = this.initialInfo.loan ? this.initialInfo.loan.dateType : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.loan.dateOfApproval ? this.initialInfo.loan.dateOfApproval : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.loan.nepaliDateOfApproval ? this.initialInfo.loan.nepaliDateOfApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
        sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      } else {
        sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
      } else {
        sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
        sanctionDate = templateDateApproval;
      } else {
        const templateDateApproval = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.en : '';
        sanctionDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    return sanctionDate;
  }
  patchGuarantor(data) {
    const formArray = this.negativeLienForm.get('guarantorDetails') as FormArray;
    data.forEach(val => {
      formArray.push(
          this.formBuilder.group({
            nameOfGuarantor: val.guarantorName ? val.guarantorName.ct : '',
            loanAmountInFigure: val.gurantedAmount ? val.gurantedAmount.ct : '',
            loanAmountInWords: this.nepaliCurrencyWordPipe.transform(val.gurantedAmount ? val.gurantedAmount.en : 0)
          })
      );
    });
  }

  setFreeText() {
    const free1 = {
      // for witness
      witnessDistrict1: this.negativeLienForm.get('witnessDistrict1') ? this.negativeLienForm.get('witnessDistrict1').value : '',
      witnessMunicipalityOrVdc1: this.negativeLienForm.get('witnessMunicipalityOrVdc1') ? this.negativeLienForm.get('witnessMunicipalityOrVdc1').value : '',
      witnessWardNo1: this.negativeLienForm.get('witnessWardNo1') ? this.negativeLienForm.get('witnessWardNo1').value : '',
      witnessAge1: this.negativeLienForm.get('witnessAge1') ? this.negativeLienForm.get('witnessAge1').value : '',
      witnessName1: this.negativeLienForm.get('witnessName1') ? this.negativeLienForm.get('witnessName1').value : '',
      witnessDistrict2: this.negativeLienForm.get('witnessDistrict2') ? this.negativeLienForm.get('witnessDistrict2').value : '',
      witnessMunicipalityOrVdc2: this.negativeLienForm.get('witnessMunicipalityOrVdc2') ? this.negativeLienForm.get('witnessMunicipalityOrVdc2').value : '',
      witnessWardNo2: this.negativeLienForm.get('witnessWardNo2') ? this.negativeLienForm.get('witnessWardNo2').value : '',
      witnessAge2: this.negativeLienForm.get('witnessAge2') ? this.negativeLienForm.get('witnessAge2').value : '',
      witnessName2: this.negativeLienForm.get('witnessName2') ? this.negativeLienForm.get('witnessName2').value : '',
      sambhad: this.negativeLienForm.get('sambhad') ? this.negativeLienForm.get('sambhad').value : '',
      year: this.negativeLienForm.get('year') ? this.negativeLienForm.get('year').value : '',
      month: this.negativeLienForm.get('month') ? this.negativeLienForm.get('month').value : '',
      day: this.negativeLienForm.get('day') ? this.negativeLienForm.get('day').value : '',
      subham: this.negativeLienForm.get('subham') ? this.negativeLienForm.get('subham').value : '',
      ministryOfLandManagement: this.negativeLienForm.get('ministryOfLandManagement') ? this.negativeLienForm.get('ministryOfLandManagement').value : '',
    };
    return JSON.stringify(free1);
  }
}

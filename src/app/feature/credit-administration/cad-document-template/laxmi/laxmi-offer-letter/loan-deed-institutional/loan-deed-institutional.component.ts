import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-loan-deed-institutional',
  templateUrl: './loan-deed-institutional.component.html',
  styleUrls: ['./loan-deed-institutional.component.scss']
})
export class LoanDeedInstitutionalComponent implements OnInit {
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  initialInfoPrint;
  loanCategory;
  spinner = false;
  form: FormGroup;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  jointInfo: any;
  isJoint = false;
  age: number;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
      private nepaliNumber: NepaliNumberPipe,
      private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0].loanCategory)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    // if (this.loanCategory === 'INDIVIDUAL' && this.cadData.assignedLoan[0].customerInfo.jointInfo) {
    //   this.isJoint = true;
    // }
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
    // if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
    //   this.setCommonData();
    // } else {
    //   if (this.isJoint) {
    //     this.jointInfo = JSON.parse(this.cadData.assignedLoan[0].customerInfo.jointInfo).jointCustomerInfo;
    //     this.jointInfo.forEach((data: any) => {
    //       this.addCommonData();
    //     });
    //   } else {
    //     this.addCommonData();
    //   }
    //   this.fillForm();
    // }
  }

  con(e) {
    this.form.patchValue({
      amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        district: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchDistrict : '',
        municipality: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchMunVdc : '',
        wadNo: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchWardNo : '',
        branch: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchNameInNepali : '',
        borrowerName: this.nepaliData.nepaliName ? this.nepaliData.nepaliName : '',
        borrowerAge: this.initialInfoPrint ? this.initialInfoPrint.borrowerAge : '',
        borrowerGrandFatherName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName  : '',
        borrowerFatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        borrowerHusbandName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
        citizenNumber: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        citizenIssueOffice: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        citizenIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        borrowerPermanentDistrict: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.district : '',
        borrowerPermanentVdc: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.municipality : '',
        borrowerTempVdc: [undefined],
        borrowerWardNo: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.wardNo : '',
        borrowerTole: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.tole : '',
        borrowerCurrentDistrict: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.district : '',
        borrowerCurrentVdc: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.municipality : '',
        borrowerCurrentTempVdc: [undefined],
        borrowerCurrentWardNo: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.wardNo : '',
        borrowerCurrentTole: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.tole : '',
        borrowerMobileNo: this.nepaliData.contactNo ? this.nepaliData.contactNo : '',
        companyName: this.nepaliData.nepaliName ? this.nepaliData.nepaliName : '',
        companyRegistrationNo: this.nepaliData.registrationNo ? this.nepaliData.registrationNo : '',
        companyPanNumber: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        registrationNikayaName: this.nepaliData.companyRegOffice ? this.nepaliData.companyRegOffice : '',
        registrationDate: this.nepaliData.regIssueDate ? this.nepaliData.regIssueDate : '',
        companyRegDistrict: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.district : '',
        companyRegVdc: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.municipality : '',
        companyRegWardNo: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.wardNo : '',
        companyRegTole: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.tole : '',
        companyRepresentativeName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.name : '',
        companyRepresentativeAge: this.initialInfoPrint ? this.initialInfoPrint.companyRepresentativeAge : '',
        companyRepresentativeGrandFatherName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.grandFatherName : '',
        companyRepresentativeFatherName: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.fatherName : '',
        companyRepresentativeDistrict: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.district : '',
        companyRepresentativeVdc: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.municipality : '',
        companyRepresentativeWardNo: this.nepaliData.authorizedPersonAddress ? this.nepaliData.authorizedPersonAddress.wardNo : '',
        companyRepresentativeTole: [undefined],
        representativeCitizenNumber: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipNo : '',
        representativeCitizenIssueDate: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipIssueDate : '',
        representativeCitizenIssueOffice: this.nepaliData.authorizedPersonDetail ? this.nepaliData.authorizedPersonDetail.citizenshipIssueDistrict : '',
        patraNo: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.offerReferenceNo : '',
        patraDate: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.offerIssueDate : '',
        patraAmount: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.loanAmountInFig : '',
        patraAmountinWord: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.loanAmountInWord : '',
        itisambatYear: this.initialInfoPrint ? this.initialInfoPrint.itisambatYear : '',
        itisambatMonth: this.initialInfoPrint ? this.initialInfoPrint.itisambatMonth : '',
        itisambatDay: this.initialInfoPrint ? this.initialInfoPrint.itisambatDay : '',
        roj: this.initialInfoPrint ? this.initialInfoPrint.roj : '',
        shuvam: this.initialInfoPrint ? this.initialInfoPrint.shuvam : '',
        witnessDistrictOne: this.initialInfoPrint ? this.initialInfoPrint.witnessDistrictOne : '',
        witnessMunicipalityOne: this.initialInfoPrint ? this.initialInfoPrint.witnessMunicipalityOne : '',
        witnessWadNoOne: this.initialInfoPrint ? this.initialInfoPrint.witnessWadNoOne : '',
        witnessDistrictTwo: this.initialInfoPrint ? this.initialInfoPrint.witnessDistrictTwo : '',
        witnessMunicipalityTwo: this.initialInfoPrint ? this.initialInfoPrint.witnessMunicipalityTwo : '',
        witnessWadNoTwo: this.initialInfoPrint ? this.initialInfoPrint.witnessWadNoTwo : '',
        role: this.initialInfoPrint ? this.initialInfoPrint.role : '',
        roleName: this.initialInfoPrint ? this.initialInfoPrint.roleName : '',
        witnessAgeOne: this.initialInfoPrint ? this.initialInfoPrint.witnessAgeOne : '',
        witnessNameOne: this.initialInfoPrint ? this.initialInfoPrint.witnessNameOne : '',
        witnessAgeTwo: this.initialInfoPrint ? this.initialInfoPrint.witnessAgeTwo : '',
        witnessNameTwo: this.initialInfoPrint ? this.initialInfoPrint.witnessNameTwo : ''
      });
      // if (!this.jointInfo) {
      //   this.form.get(['commonData', 0]).patchValue({
      //     grandParentName: this.nepaliData.grandFatherName,
      //     fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : this.nepaliData.fatherInLawName,
      //     husbandWifeName: this.nepaliData.husbandName,
      //     permanentDistrict: this.nepaliData.permanentDistrict,
      //     permanentWardNum: this.nepaliData.permanentWard,
      //     permanentMunicipality: this.nepaliData.permanentMunicipality,
      //     temporaryMunicipality: this.nepaliData.temporaryMunicipality,
      //     temporaryDistrict: this.nepaliData.temporaryDistrict,
      //     tempWardNum: this.nepaliData.temporaryWard,
      //     naPraNa: this.nepaliNumber.transform(this.cadData.assignedLoan[0].customerInfo.citizenshipNumber, 'preeti'),
      //     districtOffice: this.nepaliData.citizenshipIssueDistrict,
      //   });
      // }
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      branch: [undefined],
      // Borrower Details
      borrowerName: [undefined],
      borrowerAge: [undefined],
      borrowerGrandFatherName: [undefined],
      borrowerFatherName: [undefined],
      borrowerHusbandName: [undefined],
      citizenNumber: [undefined],
      citizenIssueOffice: [undefined],
      citizenIssueDate: [undefined],
      borrowerPermanentDistrict: [undefined],
      borrowerPermanentVdc: [undefined],
      borrowerTempVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerTole: [undefined],
      borrowerCurrentDistrict: [undefined],
      borrowerCurrentVdc: [undefined],
      borrowerCurrentTempVdc: [undefined],
      borrowerCurrentWardNo: [undefined],
      borrowerCurrentTole: [undefined],
      borrowerMobileNo: [undefined],
      // Company Details
      companyName: [undefined],
      companyRegistrationNo: [undefined],
      companyPanNumber: [undefined],
      registrationNikayaName: [undefined],
      registrationDate: [undefined],
      companyRegDistrict: [undefined],
      companyRegVdc: [undefined],
      companyRegWardNo: [undefined],
      companyRegTole: [undefined],
      companyRepresentativeName: [undefined],
      companyRepresentativeAge: [undefined],
      companyRepresentativeGrandFatherName: [undefined],
      companyRepresentativeFatherName: [undefined],
      companyRepresentativeDistrict: [undefined],
      companyRepresentativeVdc: [undefined],
      companyRepresentativeWardNo: [undefined],
      companyRepresentativeTole: [undefined],
      representativeCitizenNumber: [undefined],
      representativeCitizenIssueDate: [undefined],
      representativeCitizenIssueOffice: [undefined],

      patraNo: [undefined],
      patraDate: [undefined],
      patraAmount: [undefined],
      patraAmountinWord: [undefined],

      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDay: [undefined],
      roj: [undefined],
      shuvam: [undefined],
      witnessDistrictOne: [undefined],
      witnessMunicipalityOne: [undefined],
      witnessWadNoOne: [undefined],
      witnessDistrictTwo: [undefined],
      witnessMunicipalityTwo: [undefined],
      witnessWadNoTwo: [undefined],
      role: [undefined],
      roleName: [undefined],
      commonData: this.formBuilder.array([]),
      witnessAgeOne: [undefined],
      witnessNameOne: [undefined],
      witnessAgeTwo: [undefined],
      witnessNameTwo: [undefined]
    });
  }

  getNumAmountWord(patraAmount, patraAmountinWord) {
    const wordLabelVar = this.nepaliToEnglishPipe.transform(this.form.get(patraAmount).value.toString());
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(patraAmountinWord).patchValue(returnVal);
  }


  addCommonData() {
    (this.form.get('commonData') as FormArray).push(this.formBuilder.group({
      grandParentName: [undefined],
      fatherName: [undefined],
      husbandWifeName: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipality: [undefined],
      permanentWardNum: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipality: [undefined],
      tempWardNum: [undefined],
      age: [undefined],
      name: [undefined],
      naPraNa: [undefined],
      districtOffice: [undefined],
      issuedYear: [undefined],
      issuedMonth: [undefined],
      issuedDay: [undefined],
    }));
  }

  setCommonData() {
    JSON.parse(this.initialInfoPrint).commonData.forEach(data => {
      (this.form.get('commonData') as FormArray).push(this.formBuilder.group({
        grandParentName: [data.grandParentName],
        fatherName: [data.fatherName],
        husbandWifeName: [data.husbandWifeName],
        permanentDistrict: [data.permanentDistrict],
        permanentMunicipality: [data.permanentMunicipality],
        permanentWardNum: [data.permanentWardNum],
        temporaryDistrict: [data.temporaryDistrict],
        temporaryMunicipality: [data.temporaryMunicipality],
        tempWardNum: [data.tempWardNum],
        age: [data.age],
        name: [data.name],
        naPraNa: [data.naPraNa],
        districtOffice: [data.districtOffice],
        issuedYear: [data.issuedYear],
        issuedMonth: [data.issuedMonth],
        issuedDay: [data.issuedDay],
      }));
    });
  }
  removeCommonData(i: number) {
    (this.form.get('commonData') as FormArray).removeAt(i);
  }
  setFreeText() {
    const freeText = {
      borrowerAge: this.form.get('borrowerAge').value ? this.form.get('borrowerAge').value : '',
      companyRepresentativeAge: this.form.get('companyRepresentativeAge').value ? this.form.get('companyRepresentativeAge').value : '',
      itisambatYear: this.form.get('itisambatYear').value ? this.form.get('itisambatYear').value : '',
      itisambatMonth: this.form.get('itisambatMonth').value ? this.form.get('itisambatMonth').value : '',
      itisambatDay: this.form.get('itisambatDay').value ? this.form.get('itisambatDay').value : '',
      roj: this.form.get('roj').value ? this.form.get('roj').value : '',
      shuvam: this.form.get('shuvam').value ? this.form.get('shuvam').value : '',
      witnessDistrictOne: this.form.get('witnessDistrictOne').value ? this.form.get('witnessDistrictOne').value : '',
      witnessMunicipalityOne: this.form.get('witnessMunicipalityOne').value ? this.form.get('witnessMunicipalityOne').value : '',
      witnessWadNoOne: this.form.get('witnessWadNoOne').value ? this.form.get('witnessWadNoOne').value : '',
      witnessDistrictTwo: this.form.get('witnessDistrictTwo').value ? this.form.get('witnessDistrictTwo').value : '',
      witnessMunicipalityTwo: this.form.get('witnessMunicipalityTwo').value ? this.form.get('witnessMunicipalityTwo').value : '',
      witnessWadNoTwo: this.form.get('witnessWadNoTwo').value ? this.form.get('witnessWadNoTwo').value : '',
      role: this.form.get('role').value ? this.form.get('role').value : '',
      roleName: this.form.get('roleName').value ? this.form.get('roleName').value : '',
      witnessAgeOne: this.form.get('witnessAgeOne').value ? this.form.get('witnessAgeOne').value : '',
      witnessNameOne: this.form.get('witnessNameOne').value ? this.form.get('witnessNameOne').value : '',
      witnessAgeTwo: this.form.get('witnessAgeTwo').value ? this.form.get('witnessAgeTwo').value : '',
      witnessNameTwo: this.form.get('witnessNameTwo').value ? this.form.get('witnessNameTwo').value : '',
    };
    return JSON.stringify(freeText);
  }
  submit() {
    this.spinnerService.show();
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
      this.spinnerService.hide();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.spinnerService.hide();
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
}

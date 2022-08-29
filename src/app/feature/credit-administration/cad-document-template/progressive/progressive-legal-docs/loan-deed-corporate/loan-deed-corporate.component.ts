import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

@Component({
  selector: 'app-loan-deed-corporate',
  templateUrl: './loan-deed-corporate.component.html',
  styleUrls: ['./loan-deed-corporate.component.scss']
})
export class LoanDeedCorporateComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  nepDataPersonal: NepDataPersonal;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  constructor(
      private dialogRef: NbDialogRef<LoanDeedCorporateComponent>,
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private routerUtilsService: RouterUtilsService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;

          if (!ObjectUtil.isEmpty(initialInfo.swikritiBibaran)) {
            this.setSwikriti(initialInfo.swikritiBibaran);
          }
          if (!ObjectUtil.isEmpty(initialInfo.security)) {
            this.setSecurity(initialInfo.security);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
      /*console.log('nepData...', this.nepDataPersonal);
      console.log('nepaliData...', this.nepaliData);*/
      this.form.patchValue({
        mantralayaName1: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
        bibhaga: this.nepaliData.department ? this.nepaliData.department : '',
        regKaryalaya: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        yen: this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
        yen2: this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
        regDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        praliNo1: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        sewaKaryalaya: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        regDate2: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
        panNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        pramadJilla: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        pramadMunicipallity: this.nepaliData.companyRegistrarOfficeVdcMun ? this.nepaliData.companyRegistrarOfficeVdcMun : '',
        pramadWardNo: this.nepaliData.companyRegistrarOfficeWardNo ? this.nepaliData.companyRegistrarOfficeWardNo : '',
        // regKaryalaya2: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        riniName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        grandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        parentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        husbandWifeName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
        likhitDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        likhitMunicipalty: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        likhitWadNo: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        tempVDC: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        staDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        tempWadNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        age: this.nepaliData.borrowerAge ? this.nepaliData.borrowerAge : '',
        customerName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        citizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        date: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        cdoOffice: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        district: this.nepDataPersonal.branchDistrict ? this.nepDataPersonal.branchDistrict : '',
        municipality: this.nepDataPersonal.branchMunVdc ? this.nepDataPersonal.branchMunVdc : '',
        wadNo: this.nepDataPersonal.branchWardNo ? this.nepDataPersonal.branchWardNo : '',
        branchName: this.nepDataPersonal.branchName ? this.nepDataPersonal.branchName : '',
      });
    }
  }

  setSwikriti(data) {
    const formArray = this.form.get('swikritiBibaran') as FormArray;
    (this.form.get('swikritiBibaran') as FormArray).clear();
    if (data.length === 0) {
      this.addSwikriti();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        approvedSubidhakisim: [value.approvedSubidhakisim],
        approvedAmount: [value.approvedAmount],
        approvedCommision: [value.approvedCommision],
        approvedLoanTime: [value.approvedLoanTime],
      }));
    });
  }

  setSecurity(data) {
    const formArray = this.form.get('security') as FormArray;
    if (data.length === 0) {
      this.addSecurity();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        SecuritiesSN: [undefined],
        SecuritiesSNBibaran: [undefined],
        SecuritiesDistrict: [undefined],
        SecuritiesMunicipality: [undefined],
        SecuritiesWadNo: [undefined],
        SecuritiesKeyNo: [undefined],
        SecuritiesArea: [undefined],
        SecuritiesRegNo: [undefined],
        SecuritiesOwnerName: [undefined],
      }));
    });
  }

  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);

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
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
  buildForm() {
    this.form = this.formBuilder.group({
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      branchName: [undefined],
      mantralayaName1: [undefined],
      bibhaga: [undefined],
      regKaryalaya: [undefined],
      yen: [undefined],
      yen2: [undefined],
      regDate: [undefined],
      praliNo1: [undefined],
      sewaKaryalaya: [undefined],
      regDate2: [undefined],
      panNo: [undefined],
      pramadJilla: [undefined],
      pramadMunicipallity: [undefined],
      pramadWardNo: [undefined],
      regKaryalaya2: [undefined],
      riniName: [undefined],
      grandParentName: [undefined],
      parentName: [undefined],
      husbandWifeName: [undefined],
      likhitDistrict: [undefined],
      likhitMunicipalty: [undefined],
      likhitWadNo: [undefined],
      sabikVDC: [undefined],
      sabikWadNo: [undefined],
      tempVDC: [undefined],
      tempWadNo: [undefined],
      age: [undefined],
      date1: [undefined],
      customerName: [undefined],
      citizenshipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      mantralayaName: [undefined],
      biBhag: [undefined],
      regOffice: [undefined],
      act: [undefined],
      underName: [undefined],
      underDate: [undefined],
      lekhaNumDate: [undefined],
      certficateNo: [undefined],
      certifiedDistrict: [undefined],
      certifiedMunicipality: [undefined],
      certifiedWadNo: [undefined],
      certifiedRegOffice: [undefined],
      certifiedGrandParentName: [undefined],
      certifiedParentName: [undefined],
      certifiedHusbandWifeName: [undefined],
      certifiedPersonDistrict: [undefined],
      certifiedPersonMunicipality: [undefined],
      certifiedPersonWadNo: [undefined],
      certifiedPersonTempDistrict: [undefined],
      certifiedPersonTempVDC: [undefined],
      certifiedPersonTempWadNo: [undefined],
      certifiedPersonAge: [undefined],
      certifiedPersonName: [undefined],
      certifiedPersonCitizenshipNo: [undefined],
      certifiedDate: [undefined],
      certifiedCdoOffice: [undefined],
      namjariDate: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatTime: [undefined],
      itiSambatRoj: [undefined],
      SecuritiesSN: [undefined],
      sthit: [undefined],
      staDistrict: [undefined],
      swikritiBibaran: this.formBuilder.array([this.swikritiFormGroup()]),
      security: this.formBuilder.array([]),
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined],
      name1: [undefined],
      citizenNumber1: [undefined],
      issuedYear1: [undefined],
      guarantorCDOoffice1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipality1: [undefined],
      guarantorWadNo1: [undefined]
    });
  }

  addSecurity(): void {
    const formArray = this.form.get('security') as FormArray;
    formArray.push(this.securityFormGroup());

  }

  removeSecurity(index): void {
    const formArray = this.form.get('security') as FormArray;
    formArray.removeAt(index);
  }

  securityFormGroup(): FormGroup {
    return this.formBuilder.group({
      SecuritiesSN: [undefined],
      SecuritiesSNBibaran: [undefined],
      SecuritiesDistrict: [undefined],
      SecuritiesMunicipality: [undefined],
      SecuritiesWadNo: [undefined],
      SecuritiesKeyNo: [undefined],
      SecuritiesArea: [undefined],
      SecuritiesRegNo: [undefined],
      SecuritiesOwnerName: [undefined],
    });

  }
  addSwikriti(): void {
    const formArray = this.form.get('swikritiBibaran') as FormArray;
    formArray.push(this.swikritiFormGroup());
  }


  removeSwikriti(index: number): void {
    const formArray = this.form.get('swikritiBibaran') as FormArray;
    formArray.removeAt(index);
  }

  swikritiFormGroup(): FormGroup {
    return this.formBuilder.group({
      approvedSubidhakisim: [undefined],
      approvedAmount: [undefined],
      approvedCommision: [undefined],
      approvedLoanTime: [undefined],
    });
  }

}
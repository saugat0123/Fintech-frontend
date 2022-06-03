import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
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

@Component({
  selector: 'app-blacklist-consent',
  templateUrl: './blacklist-consent.component.html',
  styleUrls: ['./blacklist-consent.component.scss']
})
export class BlacklistConsentComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  nepDataPersonal;
  loanCategory;

  constructor(private dialogRef: NbDialogRef<BlacklistConsentComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.nepDataPersonal)) {
      this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      console.log(this.nepaliData, 'log');
      if (this.loanCategory === 'INDIVIDUAL') {
        this.form.patchValue({
          sincerlyName: this.nepaliData.name ? this.nepaliData.name : '',
          sincerlyCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
          sincerlyDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
          sincerlyCDOoffice: this.nepaliData.representativePermanentDistrict ?
                  this.nepaliData.representativePermanentDistrict : '',
          sincerlyPermanentDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ?
              this.nepaliData.permanentDistrict.nepaliName : '',
          sincerlyPermanentMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ?
                  this.nepaliData.permanentMunicipalities.nepaliName : '',
          sincerlyPermanentWadNo: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
          sincerlyTemporaryDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ?
              this.nepaliData.temporaryDistrict.nepaliName : '',
          sincerlyTemporaryVDCname: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
                  this.nepaliData.temporaryMunicipalities.nepaliName : '',
          sincerlyTemporaryWadNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
          sincerlyParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
          sincerlyGrandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
          spouseOrFatherName: this.nepaliData.husbandName ? this.nepaliData.husbandName : '',
          sincerlyLekhaNo: !ObjectUtil.isEmpty(this.initialInfoPrint) ? this.initialInfoPrint.sincerlyLekhaNo : '',
          sincerlyKarja: this.nepDataPersonal.loanType ? this.nepDataPersonal.loanType : '',
        });
      }
      if (this.loanCategory === 'INSTITUTION') {
        this.form.patchValue({
          sincerlyName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
          sincerlyCitizenshipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
          sincerlyDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
          sincerlyCDOoffice: !ObjectUtil.isEmpty(this.nepaliData) ?
              this.nepaliData.representativePermanentDistrict : '',
          sincerlyRegNo: !ObjectUtil.isEmpty(this.nepaliData.companyRegistrationNo) ?
              this.nepaliData.companyRegistrationNo : '',
          regDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
          regKaryalaya: !ObjectUtil.isEmpty(this.nepaliData.companyRegistrarOfficeDistrict) ?
              this.nepaliData.companyRegistrarOfficeDistrict : '',
          sincerlyPermanentDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
          sincerlyPermanentMunicipality: this.nepaliData.representativePermanentMunicipality ?
              this.nepaliData.representativePermanentMunicipality : '',
          sincerlyPermanentWadNo: !ObjectUtil.isEmpty(this.nepaliData.representativePermanentWard) ?
              this.nepaliData.representativePermanentWard : '',
          sincerlyTemporaryDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
          sincerlyTemporaryVDCname: !ObjectUtil.isEmpty(this.nepaliData.representativeTemporaryMunicipality) ?
              this.nepaliData.representativeTemporaryMunicipality : '',
          sincerlyTemporaryWadNo: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
          sincerlyParentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
          sincerlyGrandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
          spouseOrFatherName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
          sincerlyLekhaNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
          sincerlyKarja: this.nepDataPersonal.loanType ? this.nepDataPersonal.loanType : '',
        });
      }
    }
    this.setGuarantorDetails(this.nepaliData.guarantorDetails);
  }

  submit(): void {
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
      sincerlyName: [undefined],
      sincerlyCitizenshipNo: [undefined],
      sincerlyDate: [undefined],
      sincerlyCDOoffice: [undefined],
      sincerlyRegNo: [undefined],
      regDate: [undefined],
      regKaryalaya: [undefined],
      sincerlyPermanentDistrict: [undefined],
      sincerlyPermanentMunicipality: [undefined],
      sincerlyPermanentWadNo: [undefined],
      sincerlyTemporaryDistrict: [undefined],
      sincerlyTemporaryVDCname: [undefined],
      sincerlyTemporaryWadNo: [undefined],
      sincerlyParentName: [undefined],
      sincerlyGrandParentName: [undefined],
      sincerlyLekhaNo: [undefined],
      sincerlyKarja: [undefined],
      jamanatName: [undefined],
      jamanatNPN: [undefined],
      jamanatDate: [undefined],
      jamanatJPK: [undefined],
      jamanatRegNo: [undefined],
      jamanatRegDate: [undefined],
      jamanatRegCDO: [undefined],
      jamanatPermanentAddress: [undefined],
      jamanatDistrict: [undefined],
      jamanatWadNo: [undefined],
      jamanatTemporaryAddress: [undefined],
      jamanatTemporaryDistrict: [undefined],
      jamanatTemporaryWadNo: [undefined],
      jamanatHusbandName: [undefined],
      jamanatSasuraName: [undefined],
      karmachari: [undefined],
      karmachariNo: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      itiSambatTime: [undefined],
      itiSambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessIssuedPlace: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName1: [undefined],
      witnessCitizenshipNo1: [undefined],
      witnessCitizenshipIssueDate1: [undefined],
      witnessCDOoffice1: [undefined],
      witnessIssuedPlace1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNo1: [undefined],
      spouseOrFatherName: [undefined]

    });

  }
  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      jamanatName: [undefined],
      companyPraName: [undefined],
      jamanatNPN: [undefined],
      jamanatDate: [undefined],
      jamanatJPK: [undefined],
      jamanatRegNo: [undefined],
      jamanatRegDate: [undefined],
      jamanatRegCDO: [undefined],
      jamanatPermanentAddress: [undefined],
      jamanatDistrict: [undefined],
      jamanatWadNo: [undefined],
      jamanatTemporaryAddress: [undefined],
      jamanatTemporaryDistrict: [undefined],
      jamanatTemporaryWadNo: [undefined],
      jamanatParentName: [undefined],
      jamanatGrandParentName: [undefined],
      jamanatSpouseName: [undefined],
      guarantorType: [undefined]
    });
  }

  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    data.forEach((value, i) => {
      if (value.guarantorType === 'Corporate_Guarantor') {
        formArray.push(this.formBuilder.group({
          guarantorType: [!ObjectUtil.isEmpty(value.guarantorType) ? value.guarantorType : ''],
          jamanatName: [!ObjectUtil.isEmpty(value.companyNameGuarantor) ? value.companyNameGuarantor : ''],
          companyPraName: [!ObjectUtil.isEmpty(value.representativeNameGuarantor) ? value.representativeNameGuarantor : ''],
          jamanatNPN: [!ObjectUtil.isEmpty(value.representativeCitizenshipNoGuarantor) ? value.representativeCitizenshipNoGuarantor : ''],
          jamanatDate: [!ObjectUtil.isEmpty(value.representativeCitizenshipIssueDateGuarantor) ?
                  value.representativeCitizenshipIssueDateGuarantor : ''],
          jamanatJPK: [!ObjectUtil.isEmpty(value.representativeCitizenshipIssuingAuthorityGuarantor) ?
                  value.representativeCitizenshipIssuingAuthorityGuarantor : ''],
          jamanatRegNo: [!ObjectUtil.isEmpty(value.companyRegistrationNoGuarantor) ? value.companyRegistrationNoGuarantor : ''],
          jamanatRegDate: [!ObjectUtil.isEmpty(value.registrationDateGuarantor) ? value.registrationDateGuarantor : ''],
          jamanatRegCDO: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              this.initialInfoPrint.guarantorDetails[i].jamanatRegCDO : ''],
          jamanatPermanentAddress: [!ObjectUtil.isEmpty(value.representativePermanentDistrictGuarantor) ?
              value.representativePermanentDistrictGuarantor : ''],
          jamanatDistrict: [!ObjectUtil.isEmpty(value.representativePermanentMunicipalityGuarantor) ?
                  value.representativePermanentMunicipalityGuarantor : ''],
          jamanatWadNo: [!ObjectUtil.isEmpty(value.representativePermanentWardGuarantor) ? value.representativePermanentWardGuarantor : ''],
          jamanatTemporaryAddress: [!ObjectUtil.isEmpty(value.representativeTemporaryDistrictGuarantor) ?
              value.representativeTemporaryDistrictGuarantor : ''],
          jamanatTemporaryDistrict: [!ObjectUtil.isEmpty(value.representativeTemporaryMunicipalityGuarantor) ?
                  value.representativeTemporaryMunicipalityGuarantor : ''],
          jamanatTemporaryWadNo: [!ObjectUtil.isEmpty(value.representativeTemporaryWardGuarantor) ?
              value.representativeTemporaryWardGuarantor : ''],
          jamanatParentName: [!ObjectUtil.isEmpty(value.representativeFatherNameGuarantor) ? value.representativeFatherNameGuarantor : ''],
          jamanatGrandParentName: [!ObjectUtil.isEmpty(value.representativeGrandFatherNameGuarantor) ?
              value.representativeGrandFatherNameGuarantor : ''],
          jamanatSpouseName: [!ObjectUtil.isEmpty(value.representativeHusbandWifeNameGuarantor) ?
              value.representativeHusbandWifeNameGuarantor : ''],
        }));
      }
      if (value.guarantorType === 'Personal_Guarantor' || value.guarantorType === '' || value.guarantorType === null) {
        formArray.push(this.formBuilder.group({
          guarantorType: [!ObjectUtil.isEmpty(value.guarantorType) ? value.guarantorType : ''],
          jamanatName: [!ObjectUtil.isEmpty(value.guarantorName) ? value.guarantorName : ''],
          jamanatNPN: [!ObjectUtil.isEmpty(value.citizenNumber) ? value.citizenNumber : ''],
          jamanatDate: [!ObjectUtil.isEmpty(value.issuedYear) ? value.issuedYear : ''],
          jamanatJPK: [!ObjectUtil.isEmpty(value.issuedPlace) ? value.issuedPlace : ''],
          jamanatPermanentAddress: [!ObjectUtil.isEmpty(value.guarantorPermanentDistrict) ?
              value.guarantorPermanentDistrict.nepaliName : ''],
          jamanatDistrict: [!ObjectUtil.isEmpty(value.guarantorPermanentMunicipality) ?
              value.guarantorPermanentMunicipality.nepaliName : ''],
          jamanatWadNo: [!ObjectUtil.isEmpty(value.guarantorPermanentWard) ? value.guarantorPermanentWard : ''],
          jamanatTemporaryAddress: [!ObjectUtil.isEmpty(value.guarantorTemporaryDistrict) ?
              value.guarantorTemporaryDistrict.nepaliName : ''],
          jamanatTemporaryDistrict: [!ObjectUtil.isEmpty(value.guarantorTemporaryMunicipality) ?
              value.guarantorTemporaryMunicipality.nepaliName : ''],
          jamanatTemporaryWadNo: [!ObjectUtil.isEmpty(value.guarantorTemporaryWard) ? value.guarantorTemporaryWard : ''],
          jamanatParentName: [!ObjectUtil.isEmpty(value.guarantorFatherName) ? value.guarantorFatherName : ''],
          jamanatGrandParentName: [!ObjectUtil.isEmpty(value.guarantorGrandfatherName) ? value.guarantorGrandfatherName : ''],
          jamanatSpouseName: [!ObjectUtil.isEmpty(value.guarantorSpouseName) ? value.guarantorSpouseName : ''],
        }));
      }
    });
  }

}

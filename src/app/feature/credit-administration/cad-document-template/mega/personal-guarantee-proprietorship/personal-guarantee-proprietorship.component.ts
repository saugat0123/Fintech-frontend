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


@Component({
  selector: 'app-personal-guarantee-proprietorship',
  templateUrl: './personal-guarantee-proprietorship.component.html',
  styleUrls: ['./personal-guarantee-proprietorship.component.scss']
})
export class PersonalGuaranteeProprietorshipComponent implements OnInit {

  personalGuaranteeProprietorship: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  guarantorData;
  submitted = false;
  initialInfo;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }
  ngOnInit(): void {
    this.buildForm();
    // const guarantorList = this.cadData.loanHolder.guarantors.guarantorList;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.personalGuaranteeProprietorship.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.personalGuaranteeProprietorship.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
    // if (!ObjectUtil.isEmpty(guarantorList)) {
    //   const guarantorDetails = this.personalGuaranteeProprietorship.get('personalGuaranteeProprietorship') as FormArray;
    //   console.log('list' , guarantorList);
    //   console.log('details' , guarantorDetails);
    //   // guarantorList.forEach(e => {
    //   //   guarantorDetails.push(
    //   //       this.formBuilder.group({
    //   //         guarantorName : e.name,
    //   //         date : e.issuedYear,
    //   //         guarantorIssueDistrict : e.issuedPlace,
    //   //         guarantorAddress : e.district,
    //   //         guarantorRelationship : e.relationship,
    //   //         citizenshipNo : e.citizenNumber
    //   //       })
    //   //   ); }
    //   // );
    // }
  }


  buildForm() {
    this.personalGuaranteeProprietorship = this.formBuilder.group({
      branchName: [undefined],
      companyRegistrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      companyRegistrationNumber: [undefined],
      companyDistrict: [undefined],
      companyMunicipalityVDC: [undefined],
      companyWardNo: [undefined],
      borrowerName: [undefined],
      offerLetterIssuedDate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      guarantorName: [undefined],
      guarantorFatherName: [undefined],
      guarantorFatherInLawName: [undefined],
      guarantorHusbandName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssuedDate: [undefined],
      guarantorCitizenshipIssuedDistrict: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipalityVDC: [undefined],
      guarantorPermanentWardNo: [undefined],
      guarantorPermanentTole: [undefined],
      guarantorTemporaryProvince: [undefined],
      guarantorTemporaryDistrict: [undefined],
      guarantorTemporaryMunicipalityVDC: [undefined],
      guarantorTemporaryWardNo: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
    });
  }

  fillForm() {
    this.personalGuaranteeProprietorship.patchValue({
          branchName: !ObjectUtil.isEmpty(this.nepData.branchDetail) ?
              this.nepData.branchDetail.branchNameInNepali : '',
          companyRegistrationOffice: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ?
              this.nepData.companyRegOffice : '',
          registrationIssuedDate: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ?
              this.nepData.regIssueDate : '',
          companyRegistrationNumber: !ObjectUtil.isEmpty(this.nepData.registrationNo) ?
              this.nepData.registrationNo : '',
          companyDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
              this.nepData.institutionRegisteredAddress.district : '',
          companyMunicipalityVDC: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
              this.nepData.institutionRegisteredAddress.municipality : '',
          companyWardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
              this.nepData.institutionRegisteredAddress.wardNo : '',
          borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ?
              this.nepData.nepaliName : '',
          offerLetterIssuedDate: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
              this.nepData.miscellaneousDetail.offerIssueDate : '',
          amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
              this.nepData.miscellaneousDetail.loanAmountInFig : '',
          amountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
              this.nepData.miscellaneousDetail.loanAmountInWord : '',
          guarantorName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].name : '',
          guarantorFatherName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].fatherName : '',
          guarantorFatherInLawName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].fatherInLawName : '',
          guarantorHusbandName: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].husbandName : '',
          guarantorCitizenshipNo: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].citizenshipNo : '',
          guarantorCitizenshipIssuedDate: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].citizenshipIssueDate : '',
          guarantorCitizenshipIssuedDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
              this.nepData.guarantorDetails[0].citizenshipIssueDistrict : '',
          guarantorPermanentDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
              this.nepData.guarantorDetails[0].guarantorPermanentAddress.district : '',
          guarantorPermanentMunicipalityVDC: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
              this.nepData.guarantorDetails[0].guarantorPermanentAddress.municipality : '',
          guarantorPermanentWardNo: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
              this.nepData.guarantorDetails[0].guarantorPermanentAddress.wardNo : '',
          guarantorPermanentTole: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorPermanentAddress) ?
              this.nepData.guarantorDetails[0].guarantorPermanentAddress.tole : '',
          guarantorTemporaryDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
              this.nepData.guarantorDetails[0].guarantorTemporaryAddress.district : '',
          guarantorTemporaryMunicipalityVDC: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
              this.nepData.guarantorDetails[0].guarantorTemporaryAddress.municipality : '',
          guarantorTemporaryWardNo: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorTemporaryAddress) ?
              this.nepData.guarantorDetails[0].guarantorTemporaryAddress.wardNo : '',
        }
    );
  }

  changeToNepAmount(event: any, target, from) {
    this.personalGuaranteeProprietorship.get(target).patchValue(event.nepVal);
    this.personalGuaranteeProprietorship.get(from).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.personalGuaranteeProprietorship.get(target).value;
    return patchValue1;
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
      this.dialogRef.close();
    });
    console.log(this.personalGuaranteeProprietorship.value);
  }

}

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
  selector: 'app-personal-guarantee-partnership',
  templateUrl: './personal-guarantee-partnership.component.html',
  styleUrls: ['./personal-guarantee-partnership.component.scss']
})
export class PersonalGuaranteePartnershipComponent implements OnInit {

  personalGuaranteePartnership: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  guarantorData;
  submitted = false;
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
          this.personalGuaranteePartnership.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    // if (!ObjectUtil.isEmpty(guarantorList)) {
    //   const guarantorDetails = this.personalGuaranteePartnership.get('personalGuaranteePartnership') as FormArray;
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
    this.personalGuaranteePartnership = this.formBuilder.group({
      branchName: [undefined],
      companyAct: [undefined],
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

  changeToNepAmount(event: any, target, from) {
    this.personalGuaranteePartnership.get(target).patchValue(event.nepVal);
    this.personalGuaranteePartnership.get(from).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.personalGuaranteePartnership.get(target).value;
    return patchValue1;
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteePartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteePartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteePartnership.value);
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
    console.log(this.personalGuaranteePartnership.value);
  }

}

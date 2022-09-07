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
  selector: 'app-personal-guarantee-company',
  templateUrl: './personal-guarantee-company.component.html',
  styleUrls: ['./personal-guarantee-company.component.scss']
})
export class PersonalGuaranteeCompanyComponent implements OnInit {

  personalGuaranteeCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  guarantorData = [];
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
          this.personalGuaranteeCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      if (this.nepData.guarantorDetails.length > 0) {
        const val = this.nepData.guarantorDetails;
        console.log('this.personalGuaranteeCompany.value', this.personalGuaranteeCompany.value);
        console.log('val', val);
        this.setGuarantor(val);
      } else {
        this.addForm();
      }
      //this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    // if (!ObjectUtil.isEmpty(guarantorList)) {
    //   const guarantorDetails = this.personalGuaranteeCompany.get('personalGuaranteeCompany') as FormArray;
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
    this.patchData();
  }


  buildForm() {
    this.personalGuaranteeCompany = this.formBuilder.group({
      branchName: [undefined],
      companyAct: [undefined],
      ministryOfIndustry: [undefined],
      registeredDate: [undefined],
      companyRegistrationNumber: [undefined],
      registeredDistrict: [undefined],
      registeredMunicipalityOrVdc: [undefined],
      registeredWardNo: [undefined],
      borrowerName: [undefined],
      freeTextOne: [undefined],
      freeTextTwo: [undefined],
      offerLetterIssuedDate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      personalGuarantor: this.formBuilder.array([]),
      witnessOne: [undefined],
      witnessTwo: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined]
    });
  }
  addForm() {
    const form = this.personalGuaranteeCompany.get('personalGuarantor') as FormArray;
    form.push(this.formBuilder.group({
      guarantorName: undefined,
      guarantorFatherName: undefined,
      guarantorFatherInName: undefined,
      guarantorGrandFatherName: undefined,
      guarantorHusbandName: undefined,
      guarantorPerDistrict: undefined,
      guarantorPerMunicipality: undefined,
      guarantorPerWardNo: undefined,
      guarantorPerTole: undefined,
      guarantorTempDistrict: undefined,
      guarantorTempMunicipality: undefined,
      guarantorTempWardNo: undefined,
      guarantorTempTole: undefined,
      guarantorCitizenNo: undefined,
      guarantorCitizenIssueDate: undefined,
      guarantorCitizenIssueDistrict: undefined
    }));
  }
  setGuarantor(val) {
    const control = this.personalGuaranteeCompany.get('personalGuarantor') as FormArray;
    if (!ObjectUtil.isEmpty(val)) {
      val.forEach(d => {
       if (d.guarantorType === 'Personal_Guarantor') {
         control.push(
             this.formBuilder.group({
               guarantorName: d.name,
               guarantorFatherName: d.fatherName,
               guarantorFatherInName: d.fatherInLawName,
               guarantorGrandFatherName: d.grandFatherName,
               guarantorHusbandName: d.husbandName,
               guarantorPerDistrict: d.guarantorPermanentAddress.district,
               guarantorPerMunicipality: d.guarantorPermanentAddress.municipality,
               guarantorPerWardNo: d.guarantorPermanentAddress.wardNo,
               guarantorPerTole: d.guarantorPermanentAddress.tole,
               guarantorTempDistrict: d.guarantorTemporaryAddress.district,
               guarantorTempMunicipality: d.guarantorTemporaryAddress.municipality,
               guarantorTempWardNo: d.guarantorTemporaryAddress.wardNo,
               guarantorTempTole: d.guarantorTemporaryAddress.tole,
               guarantorCitizenNo: d.citizenshipNo,
               guarantorCitizenIssueDate: d.citizenshipIssueDate,
               guarantorCitizenIssueDistrict: d.citizenshipIssueDistrict
             })
         );
       }
      });
    }
  }
  changeToNepAmount(event: any, target, from) {
    this.personalGuaranteeCompany.get(target).patchValue(event.nepVal);
    this.personalGuaranteeCompany.get(from).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.personalGuaranteeCompany.get(target).value;
    return patchValue1;
  }
  patchData() {
    this.personalGuaranteeCompany.get('branchName').patchValue(this.nepData.branchDetail ?
        this.nepData.branchDetail.branchNameInNepali : '');
    this.personalGuaranteeCompany.get('ministryOfIndustry').patchValue(this.nepData.companyRegOffice ?
        this.nepData.companyRegOffice : '');
    this.personalGuaranteeCompany.get('registeredDate').patchValue(this.nepData.regIssueDate ?
        this.nepData.regIssueDate : '');
    this.personalGuaranteeCompany.get('companyRegistrationNumber').patchValue(this.nepData.registrationNo ?
        this.nepData.registrationNo : '');
    this.personalGuaranteeCompany.get('registeredDistrict').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.district : '');
    this.personalGuaranteeCompany.get('registeredMunicipalityOrVdc').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.municipality : '');
    this.personalGuaranteeCompany.get('registeredWardNo').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.wardNo : '');
    this.personalGuaranteeCompany.get('borrowerName').patchValue(this.nepData.nepaliName ?
        this.nepData.nepaliName : '');
    this.personalGuaranteeCompany.get('offerLetterIssuedDate').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.offerIssueDate : '');
    this.personalGuaranteeCompany.get('amount').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.personalGuaranteeCompany.get('amountInWords').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.loanAmountInWord : '');
    this.personalGuaranteeCompany.get('loanAmount').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.personalGuaranteeCompany.get('loanAmountInWords').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.loanAmountInWord : '');
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
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
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
    console.log(this.personalGuaranteeCompany.value);
  }

}

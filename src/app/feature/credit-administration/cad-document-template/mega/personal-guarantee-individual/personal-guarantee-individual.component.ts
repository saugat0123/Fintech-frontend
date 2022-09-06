import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-personal-guarantee-person-to-person',
  templateUrl: './personal-guarantee-individual.component.html',
  styleUrls: ['./personal-guarantee-individual.component.scss']
})
export class PersonalGuaranteeIndividualComponent implements OnInit {

  personalGuaranteeIndividual: FormGroup;
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

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.personalGuaranteeIndividual.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.nepData)) {
        this.nepData.guarantorDetails.forEach((val) => {
          if (val.guarantorType === 'Personal_Guarantor') {
            this.guarantorData.push(val);
          }
        });
      }
      // this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    this.patchData();
  }

  buildForm() {
    this.personalGuaranteeIndividual = this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      perWardNo: [undefined],
      tole: [undefined],
      tempProvince: [undefined],
      tempDistrictName: [undefined],
      tempMunicipalityName: [undefined],
      tempWardNo: [undefined],
      tempTole: [undefined],
      age: [undefined],
      customerName: [undefined],
      freetext: [undefined],
      date: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      nameOfSurety: [undefined],
      fatherNameOfSurety: [undefined],
      fatherInLawName: [undefined],
      husbandName: [undefined],
      customerDistrict: [undefined],
      customerMunVdc: [undefined],
      customerWardNo: [undefined],
      customerTole: [undefined],
      customerTempProvince: [undefined],
      customerTempDistrict: [undefined],
      customerTempMunicipality: [undefined],
      customerTempWardNo: [undefined],
      customerTempTole: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedDistrict: [undefined],
      witnessOne: [undefined],
      witnessTwo: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined]
    });
  }

  changeToNepAmount(event: any, target, from) {
    this.personalGuaranteeIndividual.get(target).patchValue(event.nepVal);
    this.personalGuaranteeIndividual.get(from).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.personalGuaranteeIndividual.get(target).value;
    return patchValue1;
  }
  patchData() {
    this.personalGuaranteeIndividual.get('branchName').patchValue(this.nepData.branchDetail ? this.nepData.branchDetail.branchNameInNepali : '');
    this.personalGuaranteeIndividual.get('grandFatherName').patchValue(this.nepData.grandFatherName ? this.nepData.grandFatherName : '');
    this.personalGuaranteeIndividual.get('fatherName').patchValue(this.nepData.fatherName ? this.nepData.fatherName : '');
    this.personalGuaranteeIndividual.get('districtName').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.district : '');
    this.personalGuaranteeIndividual.get('municipalityName').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.municipality : '');
    this.personalGuaranteeIndividual.get('perWardNo').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.wardNo : '');
    this.personalGuaranteeIndividual.get('tole').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.tole : '');
    this.personalGuaranteeIndividual.get('tempDistrictName').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.district : '');
    this.personalGuaranteeIndividual.get('tempMunicipalityName').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.municipality : '');
    this.personalGuaranteeIndividual.get('tempWardNo').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.wardNo : '');
    this.personalGuaranteeIndividual.get('tempTole').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.tole : '');
    this.personalGuaranteeIndividual.get('customerName').patchValue(this.nepData.nepaliName ? this.nepData.nepaliName : '');
    this.personalGuaranteeIndividual.get('date').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.offerIssueDate : '');
    this.personalGuaranteeIndividual.get('amount').patchValue(this.nepData.miscellaneousDetail ?
    this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.personalGuaranteeIndividual.get('amountInWords').patchValue(this.nepData.miscellaneousDetail ?
    this.nepData.miscellaneousDetail.loanAmountInWord : '');
    this.personalGuaranteeIndividual.get('loanAmount').patchValue(this.nepData.miscellaneousDetail ?
    this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.personalGuaranteeIndividual.get('loanAmountInWords').patchValue(this.nepData.miscellaneousDetail ?
    this.nepData.miscellaneousDetail.loanAmountInWord : '');
    this.personalGuaranteeIndividual.get('nameOfSurety').patchValue(this.nepData.nepaliName ? this.nepData.nepaliName : '');
    this.personalGuaranteeIndividual.get('fatherNameOfSurety').patchValue(this.nepData.fatherName ? this.nepData.fatherName : '');
    this.personalGuaranteeIndividual.get('fatherInLawName').patchValue(this.nepData.fatherInLawName ? this.nepData.fatherInLawName : '');
    this.personalGuaranteeIndividual.get('husbandName').patchValue(this.nepData.husbandName ? this.nepData.husbandName : '');
    this.personalGuaranteeIndividual.get('customerDistrict').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.district : '');
    this.personalGuaranteeIndividual.get('customerMunVdc').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.municipality : '');
    this.personalGuaranteeIndividual.get('customerWardNo').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.wardNo : '');
    this.personalGuaranteeIndividual.get('customerTole').patchValue(this.nepData.customerPermanentAddress ?
        this.nepData.customerPermanentAddress.tole : '');
    this.personalGuaranteeIndividual.get('customerTempDistrict').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.district : '');
    this.personalGuaranteeIndividual.get('customerTempMunicipality').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.municipality : '');
    this.personalGuaranteeIndividual.get('customerTempWardNo').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.wardNo : '');
    this.personalGuaranteeIndividual.get('customerTempTole').patchValue(this.nepData.customerTemporaryAddress ?
        this.nepData.customerTemporaryAddress.tole : '');
    this.personalGuaranteeIndividual.get('citizenshipNo').patchValue(this.nepData.citizenshipNo ?
        this.nepData.citizenshipNo : '');
    this.personalGuaranteeIndividual.get('citizenshipIssuedDate').patchValue(this.nepData.citizenshipIssueDate ?
        this.nepData.citizenshipIssueDate : '');
    this.personalGuaranteeIndividual.get('citizenshipIssuedDistrict').patchValue(this.nepData.citizenshipIssueDistrict ?
        this.nepData.citizenshipIssueDistrict : '');
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeIndividual.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteeIndividual.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteeIndividual.value);
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
    console.log(this.personalGuaranteeIndividual.value);
  }

}

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
  guarantorData;
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
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
  }

  buildForm() {
    this.personalGuaranteeIndividual = this.formBuilder.group({
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      branchName: [undefined],
      GrandFatherName: [undefined],
      grandChildrenName: [undefined],
      districtName2: [undefined],
      municipalityName2: [undefined],
      wardNo2: [undefined],
      age: [undefined],
      guarantorName: [undefined],
      citizenshipNo: [undefined],
      date: [undefined],
      districtAdministrationOfficeName: [undefined],
      registeredOffice: [undefined],
      companyName: [undefined],
      companyRegistrationNumber: [undefined],
      registeredDate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      loanApprovalDate: [undefined],
      documentWrittenYear: [undefined],
      documentWrittenMonth: [undefined],
      documentWrittenDay: [undefined],
      bankStaffName: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipalityOrVdc: [undefined],
      witnessWardNo: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      docWrittenWeek: [undefined],
      borrowerTempDis: [undefined],
      MunicipalityOrVdc: [undefined],
      name: [undefined],
      perWardNo: [undefined],
      perMun: [undefined],
      perDis: [undefined],
      borrowerStateNo: [undefined],
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

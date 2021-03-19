import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Guarantor} from '../../../../loan/model/guarantor';

@Component({
  selector: 'app-loan-deed-company',
  templateUrl: './loan-deed-company.component.html',
  styleUrls: ['./loan-deed-company.component.scss']
})
export class LoanDeedCompanyComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  loanDeedCompany: FormGroup;
  guarantorDetail: Array<Guarantor>;
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
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      const guarantorList = this.cadData.loanHolder.guarantors.guarantorList;
      this.guarantorDetail = guarantorList;
    }
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.loanDeedCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
  }

  buildForm() {
    this.loanDeedCompany = this.formBuilder.group({
      branch: [undefined],
      temporaryProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      registrarRegistrationOffice: [undefined],
      registrarRegistrationOfficeProvince: [undefined],
      registrarRegistrationOfficeDistrict: [undefined],
      registrarRegistrationOfficeMunicipalityVDC: [undefined],
      registrarRegistrationOfficeWardNo: [undefined],
      registrationNo: [undefined],
      registrationDate: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      date2: [undefined],
      date3: [undefined],
      loan: [undefined],
      purpose: [undefined],
      sNo: [undefined],
      landOwnerName: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      municipalityVDC: [undefined],
      wardNo: [undefined],
      seatNo: [undefined],
      kNo: [undefined],
      area: [undefined],
      rNoDate: [undefined],
      rohbarBankEmployeeName: [undefined],
      nameOfAuthorizedPerson: [undefined],
      guarantorName: [undefined],
      guarantorName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      districtOfWitness: [undefined],
      municipalityVDCOfWitness: [undefined],
      wardNoOfWitness: [undefined],
      ageOfWitness: [undefined],
      relationOfWitness: [undefined],
      districtOfWitness2: [undefined],
      municipalityVDCOfWitness2: [undefined],
      wardNoOfWitness2: [undefined],
      ageOfWitness2: [undefined],
      relationOfWitness2: [undefined]
    });

  }


  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
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
}

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
import {Guarantor} from '../../../../loan/model/guarantor';

@Component({
  selector: 'app-personal-guarantee-person-to-person',
  templateUrl: './personal-guarantee-person-to-person.component.html',
  styleUrls: ['./personal-guarantee-person-to-person.component.scss']
})
export class PersonalGuaranteePersonToPersonComponent implements OnInit {

  personalGuarantee: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
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
          this.personalGuarantee.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
  }

  buildForm() {
    this.personalGuarantee = this.formBuilder.group({
      officeDistrict: [undefined],
      municipalityName: [undefined],
      officeWardNo: [undefined],
      officeBranch: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      borrowerGrandFather: [undefined],
      borrowerFatherName2: [undefined],
      borrowerDistrict: [undefined],
      borrowerMunicipalityOrVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedOffice: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      loanApprovalDate: [undefined],
      documentWrittenYear: [undefined],
      documentWrittenMonth: [undefined],
      documentWrittenDay: [undefined],
      documentWrittenWeek: [undefined],
      bankStaffName: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipalityOrVdc: [undefined],
      witnessWardNo: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],

    });
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuarantee.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuarantee.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuarantee.value);
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
    console.log(this.personalGuarantee.value);
  }

}

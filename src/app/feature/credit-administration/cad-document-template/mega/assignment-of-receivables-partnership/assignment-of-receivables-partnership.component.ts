import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-assignment-of-receivables-partnership',
  templateUrl: './assignment-of-receivables-partnership.component.html',
  styleUrls: ['./assignment-of-receivables-partnership.component.scss']
})
export class AssignmentOfReceivablesPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  assignmentOfReceivablesPartnership: FormGroup;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.assignmentOfReceivablesPartnership.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.assignmentOfReceivablesPartnership = this.formBuilder.group({
      branchOfficeAddress: [undefined],
      companyRegistrationOffice: [undefined],
      department: [undefined],
      mantralaya: [undefined],
      officeName: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      metropolitan1: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
      borrowerName: [undefined],
      authorizedPerson1GrandFather: [undefined],
      authorizedPerson1Father: [undefined],
      authorizedPerson1Husband: [undefined],
      authorizedPerson1District: [undefined],
      authorizedPerson1Metropolitan: [undefined],
      authorizedPerson1WardNo: [undefined],
      authorizedPerson1Age: [undefined],
      authorizedPerson1: [undefined],
      authorizedPerson2GrandFather: [undefined],
      authorizedPerson2Father: [undefined],
      authorizedPerson2Husband: [undefined],
      authorizedPerson2District: [undefined],
      authorizedPerson2Metropolitan: [undefined],
      authorizedPerson2WardNo: [undefined],
      authorizedPerson2Age: [undefined],
      authorizedPerson2: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      offerLetterIssuedDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      representativeName: [undefined],
      representativeGrandaughterName: [undefined],
      sonOrDaughter: [undefined],
      wife: [undefined],
      district: [undefined],
      metropolitan2: [undefined],
      age: [undefined],
      mrOrMrs: [undefined],
      ownerBankNum: [undefined],
      documentWritenDate: [undefined],
      rupees: [undefined],
      rupessInWord: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDay: [undefined],
      sambatDate: [undefined],
      shubham: [undefined],
      sambatDocumentWrittenInWord: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined],
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.assignmentOfReceivablesPartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.assignmentOfReceivablesPartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.assignmentOfReceivablesPartnership.value);
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
  }

  changeToNepAmount(event: any, target, from) {
    this.assignmentOfReceivablesPartnership.get([target]).patchValue(event.nepVal);
    this.assignmentOfReceivablesPartnership.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.assignmentOfReceivablesPartnership.get([target]).value;
    return patchValue1;
  }
}

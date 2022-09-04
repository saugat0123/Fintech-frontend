import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {Document} from '../../../../admin/modal/document';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
  selector: 'app-assignment-of-receivable',
  templateUrl: './assignment-of-receivable.component.html',
  styleUrls: ['./assignment-of-receivable.component.scss']
})
export class AssignmentOfReceivableComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  assignmentOfReceivable: FormGroup;
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
          this.assignmentOfReceivable.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.assignmentOfReceivable = this.formBuilder.group({
      act: [undefined],
      ministryName: [undefined],
      metropolitian: [undefined],
      authorizedIndividual: [undefined],
      address: [undefined],
      department: [undefined],
      mantralaya: [undefined],
      officeName: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
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
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      dueDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDate: [undefined],
      sambatDay: [undefined],
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
          singleCadFile.initialInformation = JSON.stringify(this.assignmentOfReceivable.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.assignmentOfReceivable.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.assignmentOfReceivable.value);
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
    this.assignmentOfReceivable.get([target]).patchValue(event.nepVal);
    this.assignmentOfReceivable.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.assignmentOfReceivable.get([target]).value;
    return patchValue1;
  }

}

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
  initialInfo;

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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.assignmentOfReceivable.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.assignmentOfReceivable = this.formBuilder.group({
      address: [undefined],
      act: [undefined],
      ministryName: [undefined],
      regDate: [undefined],
      regNo: [undefined],
      district: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      partnershipForm: [undefined],
      authorizedIndividual: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      freeText: [undefined],
      dueDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDate: [undefined],
      sambatDay: [undefined],
      shubham: [undefined],
    });
  }
  fillForm() {
    this.assignmentOfReceivable.patchValue({
      ministryName: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : '',
      authorizedIndividual: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.name) ?
          this.nepData.authorizedPersonDetail.name : '',
      address: !ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchName : '',
      regNo: !ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : '',
      regDate: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : '',
      metropolitan: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      wardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.wardNo) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      partnershipForm: !ObjectUtil.isEmpty(this.nepData.nepaliName) ?
          this.nepData.nepaliName : '',
      district: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ?
          this.nepData.institutionRegisteredAddress.district : '',
      loanAmount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInFig) ?
          this.nepData.miscellaneousDetail.loanAmountInFig : '',
      loanAmountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInWord) ?
          this.nepData.miscellaneousDetail.loanAmountInWord : '',
      dueDate: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.offerIssueDate) ?
          this.nepData.miscellaneousDetail.offerIssueDate : '',
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
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

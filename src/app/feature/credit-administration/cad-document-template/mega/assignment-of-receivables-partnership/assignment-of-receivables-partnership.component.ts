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
      this.assignmentOfReceivablesPartnership.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.assignmentOfReceivablesPartnership = this.formBuilder.group({
      branchOfficeAddress: [undefined],
      companyRegistrationOffice: [undefined],
      regDate: [undefined],
      regNo: [undefined],
      district: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonGrandFather: [undefined],
      authorizedPersonFather: [undefined],
      authorizedPersonHusband: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMetropolitan: [undefined],
      authorizedPersonWardNo: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPerson: [undefined],
      freeText: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      freeTextDate: [undefined],
      offerLetterIssuedDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDay: [undefined],
      sambatDate: [undefined],
      shubham: [undefined],
    });
  }
  fillForm() {
    this.assignmentOfReceivablesPartnership.patchValue({
      branchOfficeAddress: !ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchName : '',
      companyRegistrationOffice: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : '',
      regDate: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ?
          this.nepData.regIssueDate : '',
      regNo: !ObjectUtil.isEmpty(this.nepData.registrationNo) ?
          this.nepData.registrationNo : '',
      district: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ?
          this.nepData.institutionRegisteredAddress.district : '',
      metropolitan: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      wardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.wardNo) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ?
          this.nepData.nepaliName : '',
      authorizedPersonGrandFather: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
          this.nepData.authorizedPersonDetail.grandFatherName : '',
      authorizedPersonFather: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
          this.nepData.authorizedPersonDetail.fatherName : '',
      authorizedPersonHusband: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
          this.nepData.authorizedPersonDetail.husbandName : '',
      authorizedPersonDistrict: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ?
          this.nepData.authorizedPersonAddress.district : '',
      authorizedPersonMetropolitan: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ?
          this.nepData.authorizedPersonAddress.municipality : '',
      authorizedPersonWardNo: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ?
          this.nepData.authorizedPersonAddress.wardNo : '',
      authorizedPerson: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ?
          this.nepData.authorizedPersonDetail.name : '',
      loanAmount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInFig) ?
          this.nepData.miscellaneousDetail.loanAmountInFig : '',
      loanAmountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInWord) ?
          this.nepData.miscellaneousDetail.loanAmountInWord : '',
      offerLetterIssuedDate: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.offerIssueDate) ?
          this.nepData.miscellaneousDetail.offerIssueDate : '',
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
    this.assignmentOfReceivablesPartnership.get([target]).patchValue(event.nepVal);
    this.assignmentOfReceivablesPartnership.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.assignmentOfReceivablesPartnership.get([target]).value;
    return patchValue1;
  }
}

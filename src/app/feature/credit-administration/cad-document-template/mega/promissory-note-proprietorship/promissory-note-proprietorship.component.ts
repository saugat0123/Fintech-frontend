import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-promissory-note-proprietorship',
  templateUrl: './promissory-note-proprietorship.component.html',
  styleUrls: ['./promissory-note-proprietorship.component.scss']
})
export class PromissoryNoteProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  nepData;
  initialInfo;
  year;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) {
    this.year = 'hello';
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
      this.form.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
    console.log('nep data: ', this.nepData);

  }

  buildForm() {
    this.form = this.formBuilder.group({
      amount: [undefined],
      amountInWords: [undefined],
      registrationOffice: [undefined],
      registrationDate: [undefined],
      registrationNo: [undefined],
      registrationDistrict: [undefined],
      registrationMunVdc: [undefined],
      registrationWardNo: [undefined],
      customerName: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNumber: [undefined],
      age: [undefined],
      name: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      sanchiOne: [undefined],
      sanchiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      date2: [undefined]
    });
  }
  fillForm() {
    this.form.patchValue({
      amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : '',
      amountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : '',
      loanAmount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : '',
      loanAmountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : '',
      registrationOffice: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : '',
      registrationDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.district : '',
      registrationDate: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : '',
      registrationNo: !ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : '',
      registrationWardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      borrowerNameInNepali: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      customerName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : '',
      registrationMunVdc: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      grandFatherName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.grandFatherName : '',
      fatherName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.fatherName : '',
      district: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : '',
      municipality: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.municipality : '',
      wardNumber: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.wardNo : '',
      name: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : '',
    });
  }

  changeToNepAmount(event: any, target, from) {
    this.form.get([target]).patchValue(event.nepVal);
    this.form.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.form.get([target]).value;
    return patchValue1;
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
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

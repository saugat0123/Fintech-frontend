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
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';

@Component({
  selector: 'app-promissory-note-partnership',
  templateUrl: './promissory-note-partnership.component.html',
  styleUrls: ['./promissory-note-partnership.component.scss']
})
export class PromissoryNotePartnershipComponent implements OnInit {

  promissoryNotePartnership: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  nepData;
  initialInfo;

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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.promissoryNotePartnership.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
    console.log('nep data: ', this.nepData);

  }

  buildForm() {
    this.promissoryNotePartnership = this.formBuilder.group({
      municipality1: [undefined],
      district: [undefined],
      wardNo: [undefined],
      grandFather: [undefined],
      autFather: [undefined],
      autHusband: [undefined],
      autDistrict: [undefined],
      autMunicipality: [undefined],
      autWardNo: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      ministry: [undefined],
      office: [undefined],
      registrationNo: [undefined],
      registrationDate: [undefined],
      name: [undefined],
      proprietorName: [undefined],
      nameOfAuthorizedPerson: [undefined],
      date1: [undefined],
      date2: [undefined],
      input1: [undefined],
      borrowerNameInNepali: [undefined]
    });
  }
  fillForm() {
    this.promissoryNotePartnership.patchValue({
      amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : '',
      amountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : '',
      ministry: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : '',
      date1: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : '',
      registrationNo: !ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : '',
      district: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : '',
      municipality1: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      wardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.wardNo : '',
      borrowerNameInNepali: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      nameOfAuthorizedPerson: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : '',
      autFather: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.fatherName : '',
      autHusband: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.husbandName : '',
      autDistrict: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : '',
      autMunicipality: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.municipality : '',
      autWardNo: !ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.wardNo : '',
      grandFather: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.grandFatherName : '',
    });
    }
  changeToNepAmount(event: any, target, from) {
    this.promissoryNotePartnership.get([target]).patchValue(event.nepVal);
    this.promissoryNotePartnership.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.promissoryNotePartnership.get([target]).value;
    return patchValue1;
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.promissoryNotePartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.promissoryNotePartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.promissoryNotePartnership.value);
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

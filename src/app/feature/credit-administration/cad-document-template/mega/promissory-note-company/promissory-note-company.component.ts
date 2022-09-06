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

@Component({
  selector: 'app-promissory-note-company',
  templateUrl: './promissory-note-company.component.html',
  styleUrls: ['./promissory-note-company.component.scss']
})
export class PromissoryNoteCompanyComponent implements OnInit {

  promissoryNoteCompany: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
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
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.promissoryNoteCompany.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    console.log('nep data: ', this.nepData);
  }

  buildForm() {
    this.promissoryNoteCompany = this.formBuilder.group({
      year: [undefined],
      month: [undefined],
      day: [undefined],
      branch: [undefined],
      ministry: [undefined],
      actName: [undefined],
      actDate: [undefined],
      department: [undefined],
      office: [undefined],
      registrationNo: [undefined],
      registrationDate: [undefined],
      name: [undefined],
      proprietorName: [undefined],
      annualRate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      nameOfAuthorizedPerson: [undefined],
      nameOfWitness: [undefined],
      addressOfWitness: [undefined],
      nameOfWitness2: [undefined],
      addressOfWitness2: [undefined],
      date1: [undefined],
      district: [undefined],
      wardNo: [undefined],
      borrowerNameInNepali: [undefined],
      autName: [undefined],
      municipality1: [undefined]
    });
  }
  fillForm() {
    this.promissoryNoteCompany.patchValue({
      amount: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : '',
      amountInWords: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : '',
      ministry: !ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : '',
      district: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : '',
      date1: !ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : '',
      registrationNo: !ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : '',
      wardNo: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.wardNo : '',
      borrowerNameInNepali: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      autName: !ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : '',
      municipality1: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : ''
    });
  }



  changeToNepAmount(event: any, target, from) {
    this.promissoryNoteCompany.get([target]).patchValue(event.nepVal);
    this.promissoryNoteCompany.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.promissoryNoteCompany.get([target]).value;
    return patchValue1;
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.promissoryNoteCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.promissoryNoteCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.promissoryNoteCompany.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      console.log(this.cadData.id, 'caddata');
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
}

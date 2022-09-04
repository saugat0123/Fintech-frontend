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
  selector: 'app-corporate-guarantee',
  templateUrl: './corporate-guarantee.component.html',
  styleUrls: ['./corporate-guarantee.component.scss']
})
export class CorporateGuaranteeComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  nepData;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.patchData();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      branchName: [undefined],
      companyActOne: [undefined],
      companyRegisteredDate: [undefined],
      companyActNumber: [undefined],
      companyRegisteredDistrict: [undefined],
      companyRegisteredMunVdc: [undefined],
      companyRegisteredWardNo: [undefined],
      companyRegisteredTole: [undefined],
      companyName: [undefined],
      companyAuthorizedPerson: [undefined],
      companyActTwo: [undefined],
      ministryOfIndustry: [undefined],
      registeredDate: [undefined],
      registeredNumber: [undefined],
      registeredDistrict: [undefined],
      registeredMunVdc: [undefined],
      registeredWardNo: [undefined],
      borrowerName: [undefined],
      freeText: [undefined],
      offerLetterIssuedDate: [undefined],
      loanAmount: [undefined],
      loanAmountInFigure: [undefined],
      amount: [undefined],
      amountInFig: [undefined],
      sachiOne: [undefined],
      sachiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined]
    });
  }
  patchData() {
    this.form.get('branchName').patchValue(this.nepData.branchDetail ? this.nepData.branchDetail.branchNameInNepali : '');
    this.form.get('companyRegisteredDate').patchValue(this.nepData.guarantorDetails[0] ?
        this.nepData.guarantorDetails[0].regIssueDate : '');
    this.form.get('companyActNumber').patchValue(this.nepData.guarantorDetails[0] ? this.nepData.guarantorDetails[0].registrationNo : '');
    this.form.get('companyRegisteredDistrict').patchValue(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress ?
        this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.district : '');
    this.form.get('companyRegisteredMunVdc').patchValue(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress ?
        this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.municipality : '');
    this.form.get('companyRegisteredWardNo').patchValue(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress ?
        this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.wardNo : '');
    this.form.get('companyRegisteredTole').patchValue(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress ?
        this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.tole : '');
    this.form.get('companyName').patchValue(this.nepData.guarantorDetails[0].name);
    this.form.get('companyAuthorizedPerson').patchValue(this.nepData.guarantorDetails[0].guarantorAuthorizedPersonDetail.name);
    this.form.get('ministryOfIndustry').patchValue(this.nepData.companyRegOffice ? this.nepData.companyRegOffice : '');
    this.form.get('registeredDate').patchValue(this.nepData.regIssueDate ? this.nepData.regIssueDate : '');
    this.form.get('registeredNumber').patchValue(this.nepData.registrationNo ? this.nepData.registrationNo : '');
    this.form.get('registeredDistrict').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.district : '');
    this.form.get('registeredMunVdc').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.municipality : '');
    this.form.get('registeredWardNo').patchValue(this.nepData.institutionRegisteredAddress ?
        this.nepData.institutionRegisteredAddress.wardNo : '');
    this.form.get('borrowerName').patchValue(this.nepData.nepaliName ? this.nepData.nepaliName : '');
    this.form.get('offerLetterIssuedDate').patchValue(this.nepData.miscellaneousDetail ? this.nepData.miscellaneousDetail.offerIssueDate : '');
    this.form.get('loanAmount').patchValue(this.nepData.miscellaneousDetail ? this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.form.get('loanAmountInFigure').patchValue(this.nepData.miscellaneousDetail ?
        this.nepData.miscellaneousDetail.loanAmountInWord : '');
    this.form.get('amount').patchValue(this.nepData.miscellaneousDetail ? this.nepData.miscellaneousDetail.loanAmountInFig : '');
    this.form.get('amountInFig').patchValue(this.nepData.miscellaneousDetail ? this.nepData.miscellaneousDetail.loanAmountInWord : '');
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
  }
}

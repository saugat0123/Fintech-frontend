import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-loan-deed-institutional',
  templateUrl: './loan-deed-institutional.component.html',
  styleUrls: ['./loan-deed-institutional.component.scss']
})
export class LoanDeedInstitutionalComponent implements OnInit {
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  loanCategory;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  amount;
  customerInfo;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
      private nepaliNumber: NepaliNumberPipe,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0].loanCategory)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.buildForm();
    this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          if (!ObjectUtil.isEmpty( JSON.parse(singleCadFile.initialInformation).rupees)) {
            this.amount = JSON.parse(singleCadFile.initialInformation).rupees;
          }
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.form.patchValue(JSON.parse(this.initialInfoPrint));
      this.form.patchValue({
        amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount))
      });
    } else {
      this.fillForm();
    }
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      const customerTempAddress =
          this.nepaliData.temporaryMunicipality + ' वडा नं. ' +
          this.nepaliData.temporaryWard + ', ' +
          this.nepaliData.temporaryDistrict;
      this.form.patchValue({
        wadNo: this.nepaliNumber.transform(this.cadData.assignedLoan[0].branch.wardNumber, 'preeti'),
        grandFatherName: this.nepaliData.grandFatherName,
        fatherName: this.nepaliData.fatherName ? this.nepaliData.fatherName : this.nepaliData.fatherInLawName,
        customerDistrict: this.nepaliData.permanentDistrict,
        customerMetropolitan: this.nepaliData.permanentMunicipality,
        customerWardNo: this.nepaliData.permanentWard,
        customerTemporaryAddress: customerTempAddress ? customerTempAddress : '',
        customerAge: this.nepaliData.age,
        customerCitizenshipNo: this.nepaliNumber.transform(this.cadData.assignedLoan[0].customerInfo.citizenshipNumber, 'preeti'),
        citizenshipIssueDistrict: this.nepaliData.citizenshipIssueDistrict,
        citizenshipIssueDate: this.nepaliData.citizenshipIssueDate,
        customerName: this.nepaliData.name,
        rupees: this.nepaliNumber.transform(this.amount, 'preeti'),
        amount: this.nepaliCurrencyWordPipe.transform(this.amount)
      });
    }
  }
  submit() {
    this.spinner = true;
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
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      branch: [undefined],
      // Borrower Details
      borrowerName: [undefined],
      borrowerGrandFatherName: [undefined],
      borrowerFatherName: [undefined],
      borrowerHusbandName: [undefined],
      citizenNumber: [undefined],
      citizenIssueOffice: [undefined],
      citizenIssueDate: [undefined],
      panNumber: [undefined],
      panIssueOffice: [undefined],
      panIssueDate: [undefined],
      borrowerPermanentDistrict: [undefined],
      borrowerPermanentVdc: [undefined],
      borrowerTempVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerTole: [undefined],
      borrowerCurrentDistrict: [undefined],
      borrowerCurrentVdc: [undefined],
      borrowerCurrentTempVdc: [undefined],
      borrowerCurrentWardNo: [undefined],
      borrowerCurrentTole: [undefined],
      borrowerMobileNo: [undefined],
      // Company Details
      companyName: [undefined],
      companyRegistrationNo: [undefined],
      registrationNikayaName: [undefined],
      registrationDate: [undefined],
      companyPanNumber: [undefined],
      companyPanIssueOffice: [undefined],
      companyPanIssueDate: [undefined],
      companyRegDistrict: [undefined],
      companyRegVdc: [undefined],
      companyRegWardNo: [undefined],
      companyRegTole: [undefined],
      companyRepresentativeName: [undefined],
      companyRepresentativeGrandFatherName: [undefined],
      companyRepresentativeFatherName: [undefined],
      companyRepresentativeDistrict: [undefined],
      companyRepresentativeVdc: [undefined],
      companyRepresentativeWardNo: [undefined],
      companyRepresentativeTole: [undefined],
      representativeCitizenNumber: [undefined],
      representativeCitizenIssueDate: [undefined],

      patraNo: [undefined],
      patraAmount: [undefined],
      patraAmountinWord: [undefined],

      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDay: [undefined],
      roj: [undefined],
      witnessDistrictOne: [undefined],
      witnessMunicipalityOne: [undefined],
      witnessWadNoOne: [undefined],
      witnessDistrictTwo: [undefined],
      witnessMunicipalityTwo: [undefined],
      witnessWadNoTwo: [undefined],
      role: [undefined],
      roleName: [undefined],
      commonData: this.formBuilder.array([]),
      witnessAgeOne: [undefined],
      witnessNameOne: [undefined],
      witnessAgeTwo: [undefined],
      witnessNameTwo: [undefined]
    });
  }

  con(e) {
    this.form.patchValue({
      amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }
}

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
    this.buildForm();
  }

  submit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      branch: [undefined],
      ministry: [undefined],
      registerNumber: [undefined],
      registrationDate: [undefined],
      registrationDistrict: [undefined],
      metropolitan: [undefined],
      registrationWardNo: [undefined],
      registrationBranch: [undefined],
      lekhaNumber: [undefined],
      date: [undefined],
      branchName: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      customerDistrict: [undefined],
      customerMetropolitan: [undefined],
      customerWardNo: [undefined],
      customerTemporaryAddress: [undefined],
      customerAge: [undefined],
      customerName: [undefined],
      customerCitizenshipNo: [undefined],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDate: [undefined],
      approvedDate: [undefined],
      customeName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      shuvam: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNum1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipality2: [undefined],
      witnessWardNum2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      shanakhatWitnessPosition: [undefined],
      shanakhatWitnessName: [undefined]
    });
  }

  con(e) {
    this.form.patchValue({
      amount: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
  }
}

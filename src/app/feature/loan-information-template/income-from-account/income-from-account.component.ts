import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter();
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;
  isNewCustomer = false;
  pattern = Pattern;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();
  srdbAffiliatedId = false;

  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;

  constructor(private formBuilder: FormBuilder,
              private el: ElementRef,
              private overlay: NgxSpinnerService
  ) {
  }

  get formControls() {
    return this.incomeFormGroup.controls;
  }

  get transactionForm() {
    return this.incomeFormGroup.controls.accountTransactionForm['controls'];
  }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    this.buildForm();
    this.arrayData();
  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
      incomeFromAccount: this.formBuilder.array([])
    });
  }

  setIncomeFromAccount(currentData) {
    console.log('currentData', currentData);
    const controls = this.incomeFormGroup.get('incomeFromAccount') as FormArray;
    currentData.forEach(singleData => {
        console.log('singleData', singleData);
      controls.push(
          this.formBuilder.group({
            interestDuringReview: [singleData.interestDuringReview],
            interestAfterNextReview: [singleData.interestAfterNextReview],
            commissionDuringReview: [singleData.commissionDuringReview],
            commissionAfterNextReview: [singleData.commissionAfterNextReview],
            otherChargesDuringReview: [singleData.otherChargesDuringReview],
            otherChargesAfterNextReview: [singleData.otherChargesAfterNextReview],
            incomeFromTheAccount: [singleData.incomeFromTheAccount],
            totalIncomeAfterNextReview: [singleData.totalIncomeAfterNextReview],
            totalIncomeDuringReview: [singleData.totalIncomeDuringReview],
            accountNo: [singleData.accountNo],
            newCustomerChecked: [singleData.newCustomerChecked],
            loanProcessingDuringReview: singleData.loanProcessingDuringReview,
            loanProcessingAfterNextReview: singleData.loanProcessingAfterNextReview,
            lcCommissionDuringReview: singleData.lcCommissionDuringReview,
            lcCommissionAfterNextReview: singleData.lcCommissionAfterNextReview,
            guaranteeCommissionDuringReview: singleData.guaranteeCommissionDuringReview,
            guaranteeCommissionAfterNextReview: singleData.guaranteeCommissionAfterNextReview,
            accountTransactionForm: singleData.accountTransactionForm
          })
      );
        console.log('controls', controls);
    });
  }

  addIncomeFromAccount() {
    console.log('I am income from account: ', this.incomeFormGroup.get('incomeFromAccount'));
    const control = this.incomeFormGroup.get('incomeFromAccount') as FormArray;
    control.push(
        this.formBuilder.group({
          interestDuringReview: [undefined,
            [Validators.required]],
          interestAfterNextReview: [undefined,
            [Validators.required]],
          commissionDuringReview: [undefined],
          commissionAfterNextReview: [undefined],
          otherChargesDuringReview: [undefined],
          otherChargesAfterNextReview: [undefined],
          incomeFromTheAccount: [undefined,
            Validators.required],
          totalIncomeAfterNextReview: [undefined,
            [Validators.required]],
          totalIncomeDuringReview: [undefined,
            [Validators.required]],
          accountNo: [undefined],
          newCustomerChecked: [false],
          loanProcessingDuringReview: undefined,
          loanProcessingAfterNextReview: undefined,
          lcCommissionDuringReview: undefined,
          lcCommissionAfterNextReview: undefined,
          guaranteeCommissionDuringReview: undefined,
          guaranteeCommissionAfterNextReview: undefined,
          accountTransactionForm: this.buildAccountTransactionForm()
        })
    );
  }

  buildAccountTransactionForm() {
    return this.formBuilder.group({
      creditTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      creditTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      repaymentTrackWithCurrentBank: [undefined, !this.disabledLambda && !this.disabledAlpha ? Validators.required : undefined]
    });
  }

  calculateTotalIncomeDuringReview() {
    let totalIncomeDuringReview = 0;
    totalIncomeDuringReview =
        (this.incomeFormGroup.get('interestDuringReview').value +
        this.incomeFormGroup.get('commissionDuringReview').value +
        this.incomeFormGroup.get('otherChargesDuringReview').value +
        this.incomeFormGroup.get('loanProcessingDuringReview').value +
        this.incomeFormGroup.get('lcCommissionDuringReview').value +
        this.incomeFormGroup.get('guaranteeCommissionDuringReview').value).toFixed(2);
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
    totalIncomeAfterNextReview =
        (this.incomeFormGroup.get('interestAfterNextReview').value +
        this.incomeFormGroup.get('commissionAfterNextReview').value +
        this.incomeFormGroup.get('otherChargesAfterNextReview').value +
        this.incomeFormGroup.get('loanProcessingAfterNextReview').value +
        this.incomeFormGroup.get('lcCommissionAfterNextReview').value +
        this.incomeFormGroup.get('guaranteeCommissionAfterNextReview').value).toFixed(2);
    this.incomeFormGroup.get('totalIncomeAfterNextReview').setValue(totalIncomeAfterNextReview);
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  submitForm() {
    this.overlay.show();
    this.submitted = true;
    if (this.incomeFormGroup.invalid) {
      this.scrollToFirstInvalidControl();
      this.overlay.hide();
      return;
    }
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.incomeDataObject = this.incomeFromAccountDataResponse;
    }
    this.incomeDataObject.data = JSON.stringify(this.incomeFormGroup.value);
    this.incomeFromAccountDataEmitter.emit(this.incomeDataObject);
  }

  onAdditionalFieldSelect(chk) {
    if (chk) {
      this.incomeFormGroup.get('accountTransactionForm').disable();
    } else {
      this.incomeFormGroup.get('accountTransactionForm').enable();
    }
    this.isNewCustomer = chk;
  }

    arrayData() {
        if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
            console.log('income to be array', this.incomeFromAccountDataResponse);
            const data = [];
            // const dataFromResponse = {
            //     incomeFromAccount: []
            // };
            this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
            console.log('dataForEdit', this.dataForEdit);
            data.push(this.dataForEdit);
            this.setIncomeFromAccount(data);
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from "ngx-spinner";
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter();
  @Input() customerInfo: CustomerInfoData;
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;
  isNewCustomer = false;
  pattern = Pattern;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();

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


  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
      this.incomeFormGroup.patchValue(this.dataForEdit);
    }
  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
      interestDuringReview: [undefined,
        [Validators.required]],
      interestAfterNextReview: [undefined,
        [Validators.required]],
      commissionDuringReview: [undefined],
      commissionAfterNextReview: [undefined],
      otherChargesDuringReview: [undefined],
      otherChargesAfterNextReview: [undefined],
      incomeFromTheAccount: [undefined],
      totalIncomeAfterNextReview: [undefined,
        [Validators.required]],
      totalIncomeDuringReview: [undefined,
        [Validators.required]],
      accountNo: [undefined],
      loanProcessingDuringReview: undefined,
      loanProcessingAfterNextReview: undefined,
      lcCommissionDuringReview: undefined,
      lcCommissionAfterNextReview: undefined,
      guaranteeCommissionDuringReview: undefined,
      guaranteeCommissionAfterNextReview: undefined,
      administrationFeeDuring: undefined,
      administrationFeeAfterNext: undefined,
      accountName: undefined,
      accountNoGroup: undefined,
      accountNameGroup: undefined,
      interestDuringReviewGroup: undefined,
      interestAfterNextReviewGroup: undefined,
      commissionDuringReviewGroup: undefined,
      commissionAfterNextReviewGroup: undefined,
      loanProcessingDuringReviewGroup: undefined,
      loanProcessingAfterNextReviewGroup: undefined,
      otherChargesDuringReviewGroup: undefined,
      otherChargesAfterNextReviewGroup: undefined,
      totalIncomeDuringReviewGroup: undefined,
      totalIncomeAfterNextReviewGroup: undefined,
      administrationFeeDuringGroup: undefined,
      administrationFeeAfterNextGroup: undefined,
    });
  }

  calculateTotalIncomeDuringReview() {
    let totalIncomeDuringReview = 0;
    totalIncomeDuringReview =
        (this.incomeFormGroup.get('administrationFeeDuring').value +
        this.incomeFormGroup.get('interestDuringReview').value +
        this.incomeFormGroup.get('commissionDuringReview').value +
        this.incomeFormGroup.get('otherChargesDuringReview').value +
        this.incomeFormGroup.get('loanProcessingDuringReview').value +
        this.incomeFormGroup.get('lcCommissionDuringReview').value +
        this.incomeFormGroup.get('guaranteeCommissionDuringReview').value).toFixed(8);
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
    totalIncomeAfterNextReview =
        (this.incomeFormGroup.get('administrationFeeAfterNext').value +
        this.incomeFormGroup.get('interestAfterNextReview').value +
        this.incomeFormGroup.get('commissionAfterNextReview').value +
        this.incomeFormGroup.get('otherChargesAfterNextReview').value +
        this.incomeFormGroup.get('loanProcessingAfterNextReview').value +
        this.incomeFormGroup.get('lcCommissionAfterNextReview').value +
        this.incomeFormGroup.get('guaranteeCommissionAfterNextReview').value).toFixed(8);
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

  calculateTotalIncomeDuringReviewGroup() {
    let totalIncomeDuringReviewGroup = 0;
    totalIncomeDuringReviewGroup =
        (this.incomeFormGroup.get('administrationFeeDuringGroup').value +
            this.incomeFormGroup.get('interestDuringReviewGroup').value +
            this.incomeFormGroup.get('commissionDuringReviewGroup').value +
            this.incomeFormGroup.get('otherChargesDuringReviewGroup').value +
            this.incomeFormGroup.get('loanProcessingDuringReviewGroup').value).toFixed(8);
    this.incomeFormGroup.get('totalIncomeDuringReviewGroup').setValue(totalIncomeDuringReviewGroup);

  }

  calculateTotalIncomeAfterReviewGroup() {
    let totalIncomeAfterNextReviewGroup = 0;
    totalIncomeAfterNextReviewGroup =
        (this.incomeFormGroup.get('administrationFeeAfterNextGroup').value +
            this.incomeFormGroup.get('interestAfterNextReviewGroup').value +
            this.incomeFormGroup.get('commissionAfterNextReviewGroup').value +
            this.incomeFormGroup.get('otherChargesAfterNextReviewGroup').value +
            this.incomeFormGroup.get('loanProcessingAfterNextReviewGroup').value).toFixed(8);
    this.incomeFormGroup.get('totalIncomeAfterNextReviewGroup').setValue(totalIncomeAfterNextReviewGroup);

  }
}

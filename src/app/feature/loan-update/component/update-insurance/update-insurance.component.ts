import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Insurance} from '../../../admin/modal/insurance';
import {InsuranceService} from '../../service/insurance.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';

@Component({
  selector: 'app-update-insurance',
  templateUrl: './update-insurance.component.html',
  styleUrls: ['./update-insurance.component.scss']
})
export class UpdateInsuranceComponent implements OnInit {
  public updateExisting: boolean;
  private customerLoanId: number;
  public form: FormGroup;
  public isSubmitted = false;
  private insurance: Insurance = new Insurance();

  constructor(
      private formBuilder: FormBuilder,
      private insuranceService: InsuranceService,
      private toastService: ToastService,
      private loanFormService: LoanFormService,
      private activatedRoute: ActivatedRoute,
      private router: Router
  ) { }

  get insuranceControls() {
    return this.form.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.queryParamMap.subscribe(v => {
      this.customerLoanId = Number(v.get('loanId'));
      this.updateExisting = v.get('updateExisting') === 'true';

      this.loanFormService.detail(this.customerLoanId).subscribe((response: any) => {
        const loanDataHolder: LoanDataHolder = response.detail;
        this.insurance = loanDataHolder.insurance;
        this.buildForm();
      });
    });

  }

  public submit(): void {
    this.insuranceService.updateInsurance(this.customerLoanId, this.form.value)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Updated successfully!!!'));
      this.router.navigate(['/home/update-loan/dashboard'], {
        queryParams: {
          id: this.customerLoanId
        }
      });
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to updated!!!'));
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [this.updateExisting ? this.insurance.id : undefined],
      version: [ObjectUtil.setUndefinedIfNull(this.insurance.version)],
      company: [ObjectUtil.setUndefinedIfNull(this.insurance.company)],
      insuredAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.insuredAmount)],
      premiumAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.premiumAmount)],
      issuedDate: [this.insurance.issuedDate === undefined ? undefined : new Date(this.insurance.issuedDate)],
      expiryDate: [this.insurance.expiryDate === undefined ? undefined : new Date(this.insurance.expiryDate)],
      policyType: [ObjectUtil.setUndefinedIfNull(this.insurance.policyType)],
      remarks: [
        this.updateExisting ? ObjectUtil.setUndefinedIfNull(this.insurance.remarks) : undefined,
        this.updateExisting ? [Validators.required] : []
      ]
    });
  }

  returnTodayDate(): Date {
    return new Date();
  }
}

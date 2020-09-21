import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Insurance} from '../../../admin/modal/insurance';
import {InsuranceService} from '../../service/insurance.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {InsuranceList} from '../../../loan/model/insuranceList';

@Component({
  selector: 'app-update-insurance',
  templateUrl: './update-insurance.component.html',
  styleUrls: ['./update-insurance.component.scss']
})
export class UpdateInsuranceComponent implements OnInit {
  private customerLoanId: number;
  public form: FormGroup;
  public isSubmitted = false;
  public insuranceCompanyList = InsuranceList.insuranceCompanyList;
  private insurances: Insurance[] = [];

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

      this.loanFormService.detail(this.customerLoanId).subscribe((response: any) => {
        const loanDataHolder: LoanDataHolder = response.detail;
        this.insurances = loanDataHolder.insurance;
        this.insurances.forEach((i) => {
          (this.form.get('insurances') as FormArray).push(this.addInsuranceGroup(i));
        });
      });
    });

  }

  public submit(): void {
    this.insuranceService.updateInsurance(this.customerLoanId, this.form.get('insurances').value)
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
      insurances: this.formBuilder.array([])
    });
  }

  private addInsuranceGroup(insurance: Insurance): FormGroup {
    return this.formBuilder.group({
      id: [insurance.id],
      version: [ObjectUtil.setUndefinedIfNull(insurance.version)],
      policyNumber: [ObjectUtil.setUndefinedIfNull(insurance.policyNumber)],
      company: [ObjectUtil.setUndefinedIfNull(insurance.company)],
      insuredAmount: [ObjectUtil.setUndefinedIfNull(insurance.insuredAmount)],
      premiumAmount: [ObjectUtil.setUndefinedIfNull(insurance.premiumAmount)],
      issuedDate: [insurance.issuedDate === undefined ? undefined : new Date(insurance.issuedDate)],
      expiryDate: [insurance.expiryDate === undefined ? undefined : new Date(insurance.expiryDate)],
      policyType: [ObjectUtil.setUndefinedIfNull(insurance.policyType)],
    });
  }

  returnTodayDate(): Date {
    return new Date();
  }
}

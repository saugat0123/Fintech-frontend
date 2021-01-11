import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-fees-commission',
  templateUrl: './fees-commission.component.html',
  styleUrls: ['./fees-commission.component.scss']
})
export class FeesCommissionComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  spinner = false;

  // todo replace with api from backend predefined data
  feeTypeList = ['STRF' , 'LRF' , 'LMF' , 'CIC' , 'LOAN_COMMITMENT_FEE'];


  feeCommissionFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private routerUtilsService: RouterUtilsService,
              private service: CreditAdministrationService,
              private toastService: ToastService) { }

  get feeAmountDetails() {
    return this.feeCommissionFormGroup.get('feeAmountDetails') as FormArray;
  }

  loanFeeDetail(i: number) {
    return this.feeAmountDetails.at(i).get('loanFeeDetails') as FormArray;
  }

  ngOnInit() {
    this.feeCommissionFormGroup = this.formBuilder.group({
      feeAmountDetails: this.formBuilder.array([])
    });
    if (!ObjectUtil.isEmpty(this.cadData.feesAndCommission)) {
      this.setFeeAmountDetails();
    } else {
      this.addFeeAmountDetails();
    }

    console.log(this.feeCommissionFormGroup);
    console.log(this.feeCommissionFormGroup.value);
  }

  setFeeAmountDetails() {
    let data = [];
    if (!ObjectUtil.isEmpty(this.cadData.feesAndCommission)) {
      data = JSON.parse(this.cadData.feesAndCommission).feeAmountDetails;
      data.forEach((value, index) => {
        this.feeAmountDetails.push(this.formBuilder.group({
          loanName: [value.loanName],
          loanId: [value.loanId],
          loanFeeDetails: this.formBuilder.array([])
        }));
        console.log(value);
        value.loanFeeDetails.forEach(f => {
          this.loanFeeDetail(index).push( this.formBuilder.group({
            feeType: [f.feeType, Validators.required],
            feePercent: [f.feePercent, Validators.required],
            feeAmount: [f.feeAmount, Validators.required],
          }));
        });
      });
    }
  }

  setLoanFeeDetails(loanFee, i: number) {
    console.log(loanFee);
    loanFee.forEach(f => {
      console.log(this.feeCommissionFormGroup.get('feeAmountDetails'));
      /*this.loanFeeDetail(i).push(f);*/
    });
  }

  addFeeAmountDetails() {
    this.cadData.assignedLoan.forEach(value => {
      this.feeAmountDetails.push(this.formBuilder.group({
        loanName: [value.loan.name],
        loanId: [value.loan.id],
        loanFeeDetails: this.formBuilder.array([this.loanFeeDetails()])
      }));
    });
  }
  /** @param i -: index of parent form array **/
  addLoanFeeDetails(i: number) {
    this.loanFeeDetail(i).push(this.loanFeeDetails());
  }

  /** @param i -: index of parent form array *
   * @param j -: index of child form array
   */
  removeLoanFeeDetails(i: number , j: number) {
    this.loanFeeDetail(i).removeAt(j);
  }

  loanFeeDetails() {
    return this.formBuilder.group({
      feeType: [undefined, Validators.required],
      feePercent: [0, Validators.required],
      feeAmount: [0, Validators.required],
    });
  }

  get totalFeeAmount() {
    let t = 0;
    this.feeAmountDetails.controls.forEach(f => {
    (f.get('loanFeeDetails') as FormArray).controls
        .forEach(l =>  t += Number(l.get('feeAmount').value)); });
    return t;
  }

  submitFeeForm() {
    this.spinner = true;
    this.cadData.feesAndCommission = JSON.stringify(this.feeCommissionFormGroup.value);
    this.service.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS , 'Successfully saved Fee/Commission data!!!'));
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR , 'Unable to save Fee/Commission data!!!'));
    });
  }

}

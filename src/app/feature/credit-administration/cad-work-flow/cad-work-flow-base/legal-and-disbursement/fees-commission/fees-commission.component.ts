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

  feeCommissionFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private routerUtilsService: RouterUtilsService,
              private service: CreditAdministrationService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.feeCommissionFormGroup = this.formBuilder.group({
      feeAmountDetails : this.formBuilder.array([])
    });
    this.addFeeAmountDetails();
    if (!ObjectUtil.isEmpty(this.cadData.feesAndCommission)) {
      this.feeAmountDetails.patchValue(JSON.parse(this.cadData.feesAndCommission));
    }
  }

  addFeeAmountDetails () {
    this.feeAmountDetails.push(this.formBuilder.group({
      feeType: [undefined , Validators.required],
      feePercent: [0 , Validators.required],
      feeAmount: [0 , Validators.required],
    }));
  }
  get feeCommissionForm() {
    return this.feeCommissionFormGroup.controls;
  }

  get feeAmountDetails() {
    return this.feeCommissionFormGroup.get('feeAmountDetails') as FormArray;
  }

  c(v){
    console.log(this.feeAmountDetails.value);
    console.log(v);
  }

  get totalFeeAmount() {
    let t = 0;
    this.feeAmountDetails.controls.forEach(value => t += Number(value.get('feeAmount').value));
    return t;
  }

  removeFeeAmountDetail(i) {
    this.feeAmountDetails.removeAt(i);
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
      this.toastService.show(new Alert(AlertType.SUCCESS , 'Unable to save Fee/Commission data!!!'));
    });
  }

}

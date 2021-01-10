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
    feeTypeList = ['STRF', 'LRF', 'LMF', 'CIC', 'LOAN_COMMITMENT_FEE'];


    feeCommissionFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.feeCommissionFormGroup = this.formBuilder.group({
            feeAmountDetails: this.formBuilder.array([])
        });
        this.addFeeAmountDetails();
        this.setFeeAmountDetails();
    }

    setFeeAmountDetails() {
        let data;
        if (!ObjectUtil.isEmpty(this.cadData.feesAndCommission)) {
            data = JSON.parse(this.cadData.feesAndCommission);
            this.feeAmountDetails.patchValue(data.feeAmountDetails);
        }
    }

    addFeeAmountDetails() {
        this.cadData.assignedLoan.forEach(value => {
            this.feeAmountDetails.push(this.formBuilder.group({
                loanName: [value.loan.name],
                feeType: [undefined, Validators.required],
                feePercent: [0, Validators.required],
                feeAmount: [0, Validators.required],
            }));
        });
    }

    get feeAmountDetails() {
        return this.feeCommissionFormGroup.get('feeAmountDetails') as FormArray;
    }

    get totalFeeAmount() {
        let t = 0;
        this.feeAmountDetails.controls.forEach(value => t += Number(value.get('feeAmount').value));
        return t;
    }

    submitFeeForm() {
        this.spinner = true;
        this.cadData.feesAndCommission = JSON.stringify(this.feeCommissionFormGroup.value);
        this.service.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Fee/Commission data!!!'));
            this.routerUtilsService.reloadCadProfileRouteWithActiveTab(this.cadData.id, 2);
            this.spinner = false;
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Fee/Commission data!!!'));
        });
    }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Router} from '@angular/router';

@Component({
    selector: 'app-fees-commission',
    templateUrl: './fees-commission.component.html',
    styleUrls: ['./fees-commission.component.scss']
})
export class FeesCommissionComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;

    @Output()
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();

    spinner = false;
    isValid = false;

    // todo replace with api from backend predefined data
    feeTypeList = ['STRF', 'LRF', 'LMF', 'CIC', 'LOAN_COMMITMENT_FEE'];


    feeCommissionFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService,
                private router: Router) {
    }

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
        if (!ObjectUtil.isEmpty(this.cadData)) {
            if (!ObjectUtil.isEmpty(this.cadData.feesAndCommission)) {
                this.setFeeAmountDetails();
            } else {
                this.addFeeAmountDetails();
            }
        }
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
                value.loanFeeDetails.forEach((f, j) => {
                    this.loanFeeDetail(index).push(this.formBuilder.group({
                        feeType: [f.feeType, Validators.required],
                        feePercent: [f.feePercent],
                        feeAmount: [f.feeAmount],
                        isValid: [f.isValid ? f.isValid : false]
                    }));
                    this.checkValidation(index, j);
                });
            });
        }
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
    removeLoanFeeDetails(i: number, j: number) {
        this.loanFeeDetail(i).removeAt(j);
    }

    loanFeeDetails() {
        return this.formBuilder.group({
            feeType: [undefined, Validators.required],
            feePercent: [0],
            feeAmount: [0],
            isValid: [false],
        });
    }

    get totalFeeAmount() {
        let t = 0;
        this.feeAmountDetails.controls.forEach(f => {
            (f.get('loanFeeDetails') as FormArray).controls
                .forEach(l => t += Number(l.get('feeAmount').value));
        });
        return t;
    }

    submitFeeForm() {
        this.spinner = true;
        this.cadData.feesAndCommission = JSON.stringify(this.feeCommissionFormGroup.value);
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Fee/Commission data!!!'));
            this.responseCadData.emit(res.detail);
            this.spinner = false;
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Fee/Commission data!!!'));
        });
    }

    public  disablePreviousSelected(feeDetail, value) {
        const detail = feeDetail.value;
        let returnType = false;
        detail.forEach(d => {
            if (!ObjectUtil.isEmpty(value) && !ObjectUtil.isEmpty(d.feeType)) {
                if (d.feeType.toString() === value.toString()) {
                    returnType = true;
                }
            }
        });
        return returnType;
    }
    checkValidation(i, j) {
        const control = this.loanFeeDetail(i).at(j);
        if (control.valid) {
            this.isValid = true;
            this.feeAmountDetails.at(i).get(['loanFeeDetails', j, 'isValid']).setValue(true);
            // this.loanFeeDetail(i).setValue(true);
        } else {
            this.feeAmountDetails.at(i).get(['loanFeeDetails', j, 'isValid']).setValue(false);
        }
    }
}

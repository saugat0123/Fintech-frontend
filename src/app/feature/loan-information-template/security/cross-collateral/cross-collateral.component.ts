import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-cross-collateral',
    templateUrl: './cross-collateral.component.html',
    styleUrls: ['./cross-collateral.component.scss']
})
export class CrossCollateralComponent implements OnInit {
    @Input() customerType;
    @Input() formData;
    @Input() readonly;

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService) {
    }

    crossCollateral: FormGroup;
    loanList = [];
    submitData;

    ngOnInit() {
        if (!this.readonly) {
            this.getLoanConfig();
        }
        this.buildForm(!ObjectUtil.isEmpty(this.formData) ? JSON.parse(this.formData) : null);
    }

    buildForm(data?) {
        this.crossCollateral = this.formBuilder.group({
            crossChecked: [data ? data.crossChecked : undefined],
            exposureTotal: [data ? data.exposureTotal : undefined],
            rmValueTotal: [data ? data.rmValueTotal : undefined],
            fmvTotal: [data ? data.fmvTotal : undefined],
            crossArray: this.formBuilder.array([])
        });
        if (!ObjectUtil.isEmpty(data)) {
            this.setCrossArray(data);
        }
    }

    setCrossArray(data) {
        if (!ObjectUtil.isEmpty(data.crossArray)) {
            data.crossArray.forEach(d => {
                (this.crossCollateral.get('crossArray') as FormArray).push(this.crossCollateralizedFormGroup(d));
            });
        }
    }

    private getLoanConfig(): void {
        this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((res: any) => {
            this.loanList = res.detail;
        }, error => {
            this.toastService.show(new Alert(AlertType.DANGER, 'Could not load data!!!'));
        });
    }

    public checkedChange(event): void {
        this.crossCollateral.get('crossChecked').patchValue(event);
        const sec = this.crossCollateral.get('crossArray') as FormArray;
        sec.clear();
        this.calculateTotalCross();
    }

    public calculateTotalCross(): void {
        let totalExposure = 0;
        let totalRmValue = 0;
        let totalFMV = 0;
        const crossData = this.crossCollateral.get('crossArray') as FormArray;
        crossData.value.forEach(cd => {
            totalExposure += cd.totalExposure;
            totalRmValue += cd.rmValue;
            totalFMV += cd.fmvApportion;
        });
        this.crossCollateral.get('exposureTotal').patchValue(totalExposure);
        this.crossCollateral.get('rmValueTotal').patchValue(totalRmValue);
        this.crossCollateral.get('fmvTotal').patchValue(totalFMV);
    }

    public removeCrossCollateralized(cin: number): void {
        (<FormArray>this.crossCollateral.get('crossArray')).removeAt(cin);
        this.calculateTotalCross();
    }

    public addCrossCollateralized(): void {
        (this.crossCollateral.get('crossArray') as FormArray).push(this.crossCollateralizedFormGroup());
    }

    public crossCollateralizedFormGroup(data?): FormGroup {
        return this.formBuilder.group({
            borrowerName: [data ? data.borrowerName : undefined],
            facilityName: [data ? data.facilityName : undefined],
            totalExposure: [data ? data.totalExposure : undefined],
            rmValue: [data ? data.rmValue : undefined],
            fmvApportion: [data ? data.fmvApportion : undefined],
            drawDown: [data ? data.drawDown : undefined],
            residualFmv: [data ? data.residualFmv : undefined],
        });
    }

    onSubmit() {
        this.submitData = JSON.stringify(this.crossCollateral.value);
    }
}

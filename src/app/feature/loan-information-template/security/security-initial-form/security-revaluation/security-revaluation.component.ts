import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {SecurityIds} from '../SecurityIds';
import {NumberUtils} from '../../../../../@core/utils/number-utils';

@Component({
    selector: 'app-security-revaluation',
    templateUrl: './security-revaluation.component.html',
    styleUrls: ['./security-revaluation.component.scss']
})
export class SecurityRevaluationComponent implements OnInit, OnChanges {
    @Input() calendarType: CalendarType;
    @Input() revaluationId: string;
    @Input() data;
    @Input() valuators;
    @Input() oldValuation;
    formGroup: FormGroup;
    submitValue;
    @Output() revaluationDataEmitter = new EventEmitter();

    constructor(private valuatorService: ValuatorService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            isReValuated: [false],
            reValuationDate: [undefined, Validators.required],
            reValuatedFmv: [undefined, Validators.required],
            reValuatedDv: [undefined, Validators.required],
            reValuatedConsideredValue: [undefined, Validators.required],
            newValuator: [undefined, Validators.required],
            changeInFmv: [undefined, Validators.required],
            changeInDv: [undefined, Validators.required],
            changeInConsideredValue: [undefined, Validators.required],
        });
        if (!ObjectUtil.isEmpty(this.data)) {
            this.formGroup.patchValue(this.data);
            this.formGroup.get('reValuationDate').setValue(new Date(this.data.reValuationDate));
        }
    }

    get formControls() {
        return this.formGroup.controls;
    }

    onSubmit() {
        if (this.formGroup.invalid) {
            return;
        }
        this.submitValue = this.formGroup.value;
    }

    setDifferenceValue() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calc();
    }

    calc() {
        if (!ObjectUtil.isEmpty(this.oldValuation) && !ObjectUtil.isEmpty(this.formGroup)) {
            if (this.revaluationId.includes(SecurityIds.apartmentId, 0)) {
                this.patchCalculationData('buildingFairMarketValue', 'buildingDistressValue', 'estimatedCost');
            }
            if (this.revaluationId.includes(SecurityIds.landId, 0)) {
                console.log(this.oldValuation);
                this.patchCalculationData('marketValue', 'distressValue', 'landConsideredValue');
            }
            if (this.revaluationId.includes(SecurityIds.land_buildingId, 0)) {
                console.log(this.oldValuation);
                this.patchCalculationData('marketValue', 'distressValue', 'landConsideredValue');
            }
        }
    }

    patchCalculationData(fmv, dv, considered) {
        const calcData = {
            changeInFmv: undefined,
            changeInDv: undefined,
            changeInConsideredValue: undefined,
        };
        calcData.changeInFmv = NumberUtils.isNumber(this.oldValuation[0][fmv]
            - this.formGroup.get('reValuatedFmv').value);
        calcData.changeInDv = NumberUtils.isNumber(this.oldValuation[0][dv]
            - this.formGroup.get('reValuatedDv').value);
        calcData.changeInConsideredValue = NumberUtils.isNumber(this.oldValuation[0][considered]
            - this.formGroup.get('reValuatedConsideredValue').value);
        this.formGroup.patchValue(calcData);
    }

}

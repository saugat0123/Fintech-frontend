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
    @Input() index;
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
            if (!ObjectUtil.isEmpty(this.data.reValuationDate)) {
                this.formGroup.get('reValuationDate').setValue(new Date(this.data.reValuationDate));
            }
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
            } else if (this.revaluationId.includes(SecurityIds.landId, 0)) {
                this.patchCalculationData('marketValue', 'distressValue', 'landConsideredValue');
            } else if (this.revaluationId.includes(SecurityIds.land_buildingId, 0)) {
                this.patchCalculationData('marketValue', 'distressValue', 'landConsideredValue');
            }
        }
    }

    patchCalculationData(fmv, dv, considered) {
        const i = this.revaluationId.replace(/[^0-9]/g, '');
        const calcData = {
            changeInFmv: undefined,
            changeInDv: undefined,
            changeInConsideredValue: undefined,
        };
        calcData.changeInFmv = NumberUtils.isNumber(this.formGroup.get('reValuatedFmv').value -
            this.oldValuation[i][fmv]);
        calcData.changeInDv = NumberUtils.isNumber(this.formGroup.get('reValuatedDv').value -
            this.oldValuation[i][dv]);
        calcData.changeInConsideredValue = NumberUtils.isNumber(this.formGroup.get('reValuatedConsideredValue').value -
            this.oldValuation[i][considered]);
        this.formGroup.patchValue(calcData);
    }

    revaluate(isRevaluated, index) {
        const revData = {
            reValuatedFmv: this.formGroup.get('reValuatedFmv').value,
            reValuatedDv: this.formGroup.get('reValuatedDv').value,
            reValuatedConsideredValue: this.formGroup.get('reValuatedConsideredValue').value,
            isReValuated: isRevaluated,
            index: index
        };
        this.revaluationDataEmitter.emit(revData);
    }
}

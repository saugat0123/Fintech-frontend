import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {SecurityIds} from '../SecurityIds';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

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

    // client
    client = environment.client;
    clientName = Clients;
    dynamic = false;

    // oldData = [];

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
            reValuatorName: [undefined],
            staffRepresentativeDesignation1: [undefined],
            staffRepresentativeDesignation2: [undefined],
            staffRepresentativeName1: [undefined],
            staffRepresentativeName2: [undefined],
            revaluationDetails: this.formBuilder.array([])
        });
        if (!ObjectUtil.isEmpty(this.data)) {
            this.formGroup.patchValue(this.data);
            if (this.dynamic) {
                this.setRevaluationDetails(this.data);
            }
            if (!ObjectUtil.isEmpty(this.data.reValuationDate)) {
                this.formGroup.get('reValuationDate').setValue(new Date(this.data.reValuationDate));
            }
        } else {
            this.addMoreRevaluationDetails();
        }
        this.arrayData();

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
        calcData.changeInFmv = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedFmv -
            this.oldValuation[i][fmv]);
        calcData.changeInDv = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedDv -
            this.oldValuation[i][dv]);
        calcData.changeInConsideredValue = NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedConsideredValue -
            this.oldValuation[i][considered]);
        this.formGroup.patchValue(calcData);
    }

    revaluate(isRevaluated, index) {
        let revData;
        revData = {
            reValuatedFmv: NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedFmv),
            reValuatedDv: NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedDv),
            reValuatedConsideredValue: NumberUtils.isNumber(this.formGroup.get('revaluationDetails').value
                [this.formGroup.get('revaluationDetails').value.length - 1].reValuatedConsideredValue),
            isReValuated: isRevaluated,
            index: index
        };
        this.revaluationDataEmitter.emit(revData);
    }

    revaluationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                reValuationDate: [undefined],
                reValuatedFmv: [undefined],
                reValuatedDv: [undefined],
                reValuatedConsideredValue: [undefined],
                newValuator: [undefined],
                reValuatorName: [undefined],
                staffRepresentativeDesignation1: [undefined],
                staffRepresentativeDesignation2: [undefined],
                staffRepresentativeName1: [undefined],
                staffRepresentativeName2: [undefined]
            }
        );
    }

    addMoreRevaluationDetails() {
        (this.formGroup.get('revaluationDetails') as FormArray).push(this.revaluationDetailsFormGroup());
    }

    removeRevaluationDetail(index: number) {
        (<FormArray>this.formGroup.get('revaluationDetails')).removeAt(index);
    }

    setRevaluationDetails(currentData) {
        const revaluationDetails = this.formGroup.get('revaluationDetails') as FormArray;
        currentData.revaluationDetails.forEach((singleData) => {
            console.log('singleData', singleData);
            revaluationDetails.push(
                this.formBuilder.group({
                    reValuationDate: [singleData.reValuationDate],
                    reValuatedFmv: [singleData.reValuatedFmv],
                    reValuatedDv: [singleData.reValuatedDv],
                    reValuatedConsideredValue: [singleData.reValuatedConsideredValue],
                    newValuator: [singleData.newValuator],
                    reValuatorName: [singleData.reValuatorName],
                    staffRepresentativeDesignation1: [singleData.staffRepresentativeDesignation1],
                    staffRepresentativeDesignation2: [singleData.staffRepresentativeDesignation2],
                    staffRepresentativeName1: [singleData.staffRepresentativeName1],
                    staffRepresentativeName2: [singleData.staffRepresentativeName2]
                })
            );
            console.log('revaluationDetails', revaluationDetails);
        });
    }

    arrayData() {
        if (!ObjectUtil.isEmpty(this.data)) {
            const oldData = {
                revaluationDetails: []
            };
            oldData.revaluationDetails.push(this.data);
            this.setRevaluationDetails(oldData);
            this.calc();
        }
    }
}

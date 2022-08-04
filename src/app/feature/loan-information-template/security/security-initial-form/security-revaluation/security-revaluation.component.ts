import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {SecurityIds} from '../SecurityIds';
import {NumberUtils} from '../../../../../@core/utils/number-utils';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {RoleService} from '../../../../admin/component/role-permission/role.service';

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
    isRevaluationNull = false;
    designationList = [];

    constructor(private valuatorService: ValuatorService,
                private formBuilder: FormBuilder,
                private toastService: ToastService,
                private roleService: RoleService) {
    }

    ngOnInit() {
        this.getRoleList();
        this.buildForm();
        this.arrayData();
        if (!ObjectUtil.isEmpty(this.data)) {
            this.formGroup.patchValue(this.data);
            if (!ObjectUtil.isEmpty(this.data.revaluationDetails)) {
                this.setRevaluationDetails(this.data);
            }
        } else {
            this.addMoreRevaluationDetails();
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
        if (isRevaluated === false) {
            if (!ObjectUtil.isEmpty(this.formGroup.get('revaluationDetails'))) {
                const a = this.formGroup.get('revaluationDetails') as FormArray;
                a.value.forEach(i => {
                    this.removeRevaluationDetail(i);
                });
                this.addMoreRevaluationDetails();
            }
        } else {
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
                staffRepresentativeName2: [undefined],
                 sqlCost: [undefined],
                 totalCost: [undefined]
            }
        );
    }

    addMoreRevaluationDetails() {
        this.checkRevaluationNull();
        if (this.isRevaluationNull) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Please fill at least one field'));
        } else {
            (this.formGroup.get('revaluationDetails') as FormArray).push(this.revaluationDetailsFormGroup());
        }
    }

    removeRevaluationDetail(index: number) {
        (<FormArray>this.formGroup.get('revaluationDetails')).removeAt(index);
    }

    setRevaluationDetails(currentData) {
        const revaluationDetails = this.formGroup.get('revaluationDetails') as FormArray;
        currentData.revaluationDetails.forEach((singleData) => {
            revaluationDetails.push(
                this.formBuilder.group({
                    reValuationDate: [ObjectUtil.isEmpty(singleData.reValuationDate) ? undefined :
                        new Date(singleData.reValuationDate)],
                    reValuatedFmv: [singleData.reValuatedFmv],
                    reValuatedDv: [singleData.reValuatedDv],
                    reValuatedConsideredValue: [singleData.reValuatedConsideredValue],
                    newValuator: [singleData.newValuator],
                    reValuatorName: [singleData.reValuatorName],
                    staffRepresentativeDesignation1: [singleData.staffRepresentativeDesignation1],
                    staffRepresentativeDesignation2: [singleData.staffRepresentativeDesignation2],
                    staffRepresentativeName1: [singleData.staffRepresentativeName1],
                    staffRepresentativeName2: [singleData.staffRepresentativeName2],
                    sqlCost: !ObjectUtil.isEmpty(singleData.sqlCost) ? singleData.sqlCost : undefined,
                    totalCost: !ObjectUtil.isEmpty(singleData.totalCost) ? singleData.totalCost : undefined
                })
            );
        });
    }

    buildForm() {
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
            sqlCost: [undefined],
            totalCost: [undefined],
            revaluationDetails: this.formBuilder.array([])
        });
    }

    arrayData() {
        if (!ObjectUtil.isEmpty(this.data)) {
            if ((this.data.revaluationDetails === undefined) || (this.data.revaluationDetails === null)) {
                const oldData = {
                    revaluationDetails: []
                };
                oldData.revaluationDetails.push(this.data);
                this.setRevaluationDetails(oldData);
            }
        }
    }

    checkRevaluationNull() {
        if (!ObjectUtil.isEmpty(this.formGroup.get('revaluationDetails'))) {
            const revaluation = this.formGroup.get('revaluationDetails') as FormArray;
            revaluation.controls.forEach((data) => {
                const revaluationDate = data.get('reValuationDate').value;
                const fmv = data.get('reValuatedFmv').value;
                const dv = data.get('reValuatedDv').value;
                const cv = data.get('reValuatedConsideredValue').value;
                const valuator = data.get('newValuator').value;
                const valuatorName = data.get('reValuatorName').value;
                const designation1 = data.get('staffRepresentativeDesignation1').value;
                const designation2 = data.get('staffRepresentativeDesignation2').value;
                const name1 = data.get('staffRepresentativeName1').value;
                const name2 = data.get('staffRepresentativeName2').value;
                if (ObjectUtil.isEmpty(revaluationDate) && ObjectUtil.isEmpty(fmv) && ObjectUtil.isEmpty(dv) && ObjectUtil.isEmpty(cv) &&
                    ObjectUtil.isEmpty(valuator) && ObjectUtil.isEmpty(valuatorName) && ObjectUtil.isEmpty(designation1) &&
                    ObjectUtil.isEmpty(designation2) && ObjectUtil.isEmpty(name1) && ObjectUtil.isEmpty(name2)) {
                    this.isRevaluationNull = true;
                } else {
                    this.isRevaluationNull = false;
                }
            });
        }
    }

    getRoleList() {
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
        });
    }
}

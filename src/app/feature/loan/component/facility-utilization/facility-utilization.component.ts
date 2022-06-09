import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../model/customerInfoData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-facility-utilization',
    templateUrl: './facility-utilization.component.html',
    styleUrls: ['./facility-utilization.component.scss']
})
export class FacilityUtilizationComponent implements OnInit {

    constructor(private formBuilder: FormBuilder) {
    }

    @Input() customerInfo: CustomerInfoData;
    @Input() fromProfile: boolean;
    @Output() emitter = new EventEmitter();
    facilityUtilizatoinForm: FormGroup;
     totals = {
         limit: null,
         averageUtilization: null,
         utilization: null,
         maximum: null,
         minimum: null
    };
     totalKeys = Object.keys(this.totals);
     data;
    ngOnInit() {
        this.buildForm();
        if (this.customerInfo.facilityUtilization) {
            this.setFacility();
        } else {
           this.addUtilization();
        }
    }

    buildForm() {
        this.facilityUtilizatoinForm = this.formBuilder.group({
            data: this.formBuilder.array([]),
            lcIssued: [undefined],
            oneLimit: [undefined],
            remarks: [undefined]
        });
    }

    addUtilization() {
        const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
        formArray.push(this.formBuilder.group({
            facility: [undefined],
            limit: [undefined],
            averageUtilization: [undefined],
            utilization: [undefined],
            maximum: [undefined],
            minimum: [undefined]
        }));
    }

    removeUtilization(i: number) {
        this.allCalculate();
        const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
        formArray.removeAt(i);
    }

    setFacility() {
        const data = JSON.parse(this.customerInfo.facilityUtilization);
        this.data = data;
        this.facilityUtilizatoinForm.patchValue(data);
        if (!ObjectUtil.isEmpty(data.data) && data.data.length > 0) {
            const formArray = (this.facilityUtilizatoinForm.get('data') as FormArray);
            data.data.forEach((d) => {
                formArray.push(this.formBuilder.group({
                    facility: [d.facility],
                    limit: [d.limit],
                    averageUtilization: [d.averageUtilization],
                    utilization: [d.utilization],
                    maximum: [d.maximum],
                    minimum: [d.minimum]
                }));
            });
            this.allCalculate();
        } else {
            this.addUtilization();
        }
    }
    saveFacilityUtilization() {
      this.customerInfo.facilityUtilization = JSON.stringify(this.facilityUtilizatoinForm.value);
      this.emitter.emit(this.customerInfo);
    }

    calculateTotalAverage(key: string) {
        let total = 0;
        const formArray = this.facilityUtilizatoinForm.get('data').value;
        formArray.forEach(d => {
            total += Number(d[key]);
        });
            this.totals[key] = total;
    }
    allCalculate() {
        this.calculateTotalAverage('limit');
        this.calculateTotalAverage('averageUtilization');
        this.calculateTotalAverage('utilization');
        this.calculateTotalAverage('maximum');
        this.calculateTotalAverage('minimum');
    }
}

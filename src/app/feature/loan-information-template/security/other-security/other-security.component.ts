import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
    selector: 'app-other-security',
    templateUrl: './other-security.component.html',
    styleUrls: ['./other-security.component.scss']
})
export class OtherSecurityComponent implements OnInit {
    otherSecurityForm: FormGroup;
    ckeConfig;
    @Input() security: Security;
    @Input() isEdit = false;
    @Input() calendarType: CalendarType;
    totalDistressValue;
    totalMarketVAlue;
    totalConsiderValue;
    submitted = false;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        this.configEditor();
        if (this.isEdit) {
            this.setOtherSecurity();
        } else {
            this.addOtherSecurity();
        }
    }

    setOtherSecurity() {
        const formData = JSON.parse(this.security.data);
        const otherSecurityData = this.otherSecurityForm.get('otherSecurity') as FormArray;
        otherSecurityData.push(
            this.formBuilder.group({
                otherDetail: [formData.otherDetail],
                considerValue: [formData.considerValue],
                distressValue: [formData.distressValue],
                fairMarketValue: [formData.fairMarketValue],
                realiazableRate: [formData.realiazableRate],
                realiazableValue: [formData.realiazableValue],
                securityName: [formData.securityName],
                otherSecurityFirstValuationDate: [formData.otherSecurityFirstValuationDate ?
                    new Date(formData.otherSecurityFirstValuationDate) : '']
            })
        );
    }

    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
    }

    private buildForm(): FormGroup {
        return this.otherSecurityForm = this.formBuilder.group({
            otherSecurity: this.formBuilder.array([]),
        });
    }

    private otherSecurityDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                otherDetail: [undefined],
                considerValue: 0,
                distressValue: [undefined],
                consideredValue: [undefined],
                fairMarketValue: [undefined],
                realiazableRate: [undefined],
                realiazableValue: [undefined],
                securityName: [undefined],
                otherSecurityFirstValuationDate: [undefined]
            }
        );
    }

    public addOtherSecurity(): void {
        (this.otherSecurityForm.get('otherSecurity') as FormArray).push(this.otherSecurityDetailsFormGroup());
    }

    public calcRealizableValue(type, index): void {
        if (type === 'security') {
            const realizableValue = (Number(this.otherSecurityForm.get(['otherSecurity', index, 'distressValue']).value)
                * (Number(this.otherSecurityForm.get(['otherSecurity', index, 'realiazableRate']).value)) / 100);
            this.otherSecurityForm.get(['otherSecurity', index, 'realiazableValue']).patchValue(realizableValue);
            this.otherSecurityForm.get(['otherSecurity', index, 'considerValue']).patchValue(
                this.otherSecurityForm.get(['otherSecurity', index, 'fairMarketValue']).value);
        }
        this.updateOtherSecurityTotal();
    }

    public updateOtherSecurityTotal(): void {
        const otherSecurity = this.otherSecurityForm.get('otherSecurity') as FormArray;
        this.totalMarketVAlue = 0;
        this.totalConsiderValue = 0;
        this.totalDistressValue = 0;
        otherSecurity['value'].forEach(val => {
            this.totalDistressValue += Number(val['distressValue']);
            this.totalConsiderValue += Number(val['realiazableValue']);
            this.totalMarketVAlue += Number(val['fairMarketValue']);
        });
    }
}

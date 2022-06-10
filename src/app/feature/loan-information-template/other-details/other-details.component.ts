import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../@core/utils/constants/editor';
import {LoanType} from '../../loan/model/loanType';
import value = LoanType.value;
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-other-details',
    templateUrl: './other-details.component.html',
    styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
    @Input() otherData;
    @Input() fromProfile: boolean;
    @Output() otherDataEmitter = new EventEmitter();
    otherForm: FormGroup;
    ckeConfig = Editor.CK_CONFIG;
    moaAoa = [
        {key : 'YES', value : 'Yes'},
        {key : 'NO', value : 'No'},
        { key : 'N/A', value : 'N/A'}];
    submitData;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.otherData)) {
            const data = JSON.parse(this.otherData);
            this.buildForm(data);
            this.setSecurityData(data.securityInspection);
            this.setMeetingData(data.meetingDetails);
        } else {
            this.buildForm();
            this.addSecurityData();
            this.addMeetingData();
        }
    }

    buildForm(data?: any) {
        this.otherForm = this.formBuilder.group({
            lastFYIRD: [data ? data.lastFYIRD : undefined],
            justifyIRD: [data ? data.justifyIRD : undefined],
            lastFYTax: [data ? data.lastFYTax : undefined],
            justifyTax: [data ? data.justifyTax : undefined],
            agencyName: [data ? data.agencyName : undefined],
            reportDate: [data ? new Date(data.reportDate) : undefined],
            longTermRating: [data ? data.longTermRating : undefined],
            shortTermRating: [data ? data.shortTermRating : undefined],
            moaAoa: [data ? data.moaAoa : undefined],
            securityInspection: this.formBuilder.array([]),
            meetingDetails: this.formBuilder.array([])
        });
    }

    addSecurityData() {
        (this.otherForm.get('securityInspection') as FormArray).push(
            this.formBuilder.group({
                securityType: [undefined],
                dateOfInspection: [undefined],
                reportField: [undefined],
                approvedFrequency: [undefined]
            })
        );
    }

    addMeetingData() {
        (this.otherForm.get('meetingDetails') as FormArray).push(
            this.formBuilder.group({
                meetingDate: [undefined],
                meetingPurpose: [undefined]
            })
        );
    }

    removeSecurity(i) {
        (<FormArray>this.otherForm.get('securityInspection')).removeAt(i);
    }

    removeMeeting(i) {
        (<FormArray>this.otherForm.get('meetingDetails')).removeAt(i);
    }

    get form() {
        return this.otherForm.controls;
    }

    onSubmit() {
        this.overlay.show();
        this.submitted = true;
        if (!ObjectUtil.isEmpty(this.otherData)) {
            this.submitData = this.otherData;
        }
        this.submitData = JSON.stringify(this.otherForm.value);
        this.overlay.hide();
        this.otherDataEmitter.emit(this.submitData);
    }

    setSecurityData(data) {
        const securityDetail = this.otherForm.get('securityInspection') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                securityDetail.push(
                    this.formBuilder.group({
                        securityType: [d.securityType],
                        dateOfInspection: [d ? new Date(d.dateOfInspection) : undefined],
                        reportField: [d.reportField],
                        approvedFrequency: [d.approvedFrequency]
                    })
                );
            });
        }
    }

    setMeetingData(data) {
        const meetingDetail = this.otherForm.get('meetingDetails') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                meetingDetail.push(
                    this.formBuilder.group({
                        meetingDate: [d ? new Date(d.meetingDate) : undefined],
                        meetingPurpose: [d.meetingPurpose]
                    })
                );
            });
        }
    }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../@core/utils/constants/editor';
import {LoanType} from '../../loan/model/loanType';
import value = LoanType.value;
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-other-details',
    templateUrl: './other-details.component.html',
    styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
    @Input() otherData;
    @Input() customerInfo: CustomerInfoData;
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
    dapDaaOutstandingTable = `<table border="1" cellspacing="0" style="border-collapse:collapse; width:100%"><tbody><tr><td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:17px; text-align:center; vertical-align:middle; white-space:normal; width:59px"><span style="font-size:14px"><span style="font-family:Cambria"><strong>S.no.</strong></span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:bottom; white-space:normal; width:485px"><span style="font-size:14px"><span style="font-family:Cambria"><strong>Particulars of DAP/DAA</strong></span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:middle; white-space:normal; width:243px"><span style="font-size:14px"><span style="font-family:Cambria"><strong>Outstanding amount</strong></span></span></td></tr><tr><td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; text-align:center; vertical-align:middle; white-space:normal; width:59px"><span style="font-size:14px"><span style="font-family:Cambria"><strong> </strong></span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal; width:485px"><span style="font-size:14px"><span style="font-family:Cambria"> </span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:243px"><span style="font-size:14px"><span style="font-family:Cambria"> </span></span></td></tr><tr><td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; text-align:center; vertical-align:middle; white-space:normal; width:59px"><span style="font-size:14px"><span style="font-family:Cambria"><strong> </strong></span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:bottom; white-space:normal; width:485px"><span style="font-size:14px"><span style="font-family:Cambria"> </span></span></td><td style="border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:243px"><span style="font-size:14px"><span style="font-family:Cambria"> </span></span></td></tr></tbody></table>`;
    thisClient;
    isCorporate = false;
    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerInfo) && !ObjectUtil.isEmpty(this.customerInfo.clientType)) {
            this.thisClient = this.customerInfo.clientType;
            if ((this.thisClient === 'CORPORATE' || this.thisClient === 'INFRASTRUCTURE_AND_PROJECT' ||
                this.thisClient === 'MID_MARKET' || this.thisClient === 'BUSINESS_DEVELOPMENT') && this.customerInfo.customerType === 'INSTITUTION') {
                this.isCorporate = true;
            }
        }
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
            meetingDetails: this.formBuilder.array([]),
            dapDaaOutstanding: [data ? (data.dapDaaOutstanding ? data.dapDaaOutstanding : this.dapDaaOutstandingTable)
                : this.dapDaaOutstandingTable],
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

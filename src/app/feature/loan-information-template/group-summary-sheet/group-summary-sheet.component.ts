import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CalendarType} from '../../../@core/model/calendar-type';
import {cpus} from 'os';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-group-summary-sheet',
    templateUrl: './group-summary-sheet.component.html',
    styleUrls: ['./group-summary-sheet.component.scss']
})
export class GroupSummarySheetComponent implements OnInit {
    @Input() customerInfo;
    @Input() gssData;
    @Input() fromProfile: boolean;
    @Output() gssDataEmitter = new EventEmitter();
    @Input() calendarType: CalendarType;
    gssForm: FormGroup;
    submitData;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.gssData)) {
            const data = JSON.parse(this.gssData);
            this.buildForm(data);
            this.setGssData(data.gssDetails);
        } else {
            this.buildForm();
            this.addGssData();
        }
    }

    buildForm(data?: any) {
        this.gssForm = this.formBuilder.group({
            gssDate: [data ? new Date(data.gssDate) : undefined],
            lastGSSDate: [data ? new Date(data.lastGSSDate) : undefined],
            groupName: [data ? data.groupName : undefined],
            groupCode: [data ? data.groupCode : undefined],
            groupController: [data ? data.groupController : undefined],
            peakExposureLevel: [data ? data.peakExposureLevel : undefined],
            gssDetails: this.formBuilder.array([]),
            totalFundedLimited: [data ? data.totalFundedLimited : undefined],
            totalNonFundedLimited: [data ? data.totalNonFundedLimited : undefined],
            totalLimited1: [data ? data.totalLimited1 : undefined],
            gssRemark: [data ? data.gssRemark : undefined],
            backgroundDetail: [data ? data.backgroundDetail : undefined],
            totalLimitExceed1Year: [data ? data.totalLimitExceed1Year : undefined],
            totalIncreaseCurrent: [data ? data.totalIncreaseCurrent : undefined],
            otherLiabilities: [data ? data.otherLiabilities : undefined],
            earningProposedRelation: [data ? data.earningProposedRelation : undefined],
        });
    }
    get form() {
        return this.gssForm.controls;
    }

    addGssData() {
        (this.gssForm.get('gssDetails') as FormArray).push(
            this.formBuilder.group({
                customerName: [undefined],
                customerID: [undefined],
                riskGrade: [undefined],
                fundedLimited: [undefined],
                nonFundedLimited: [undefined],
                totalLimit: [undefined]
            }));
    }

    removeGss(i) {
        (<FormArray>this.gssForm.get('gssDetails')).removeAt(i);
    }

    calculateTotalGss() {
        let totalFundedLimited = 0;
        let totalNonFundedLimited = 0;
        let totalLimited = 0;
        const data = this.gssForm.get('gssDetails') as FormArray;
        data['value'].forEach((d) => {
            totalFundedLimited += Number(d['fundedLimited']);
            totalNonFundedLimited += Number(d['nonFundedLimited']);
            totalLimited += Number(d['totalLimit']);
        });
        this.gssForm.get('totalFundedLimited').setValue(totalFundedLimited);
        this.gssForm.get('totalNonFundedLimited').setValue(totalNonFundedLimited);
        this.gssForm.get('totalLimited1').setValue(totalLimited);
    }

    multiTotalLimit(i) {
        let total = 0;
        total = Number(
            (Number(this.gssForm.get(['gssDetails', i, 'fundedLimited']).value) +
                Number(this.gssForm.get(['gssDetails', i, 'nonFundedLimited']).value)).toFixed(2));
        this.gssForm.get(['gssDetails', i, 'totalLimit']).setValue(total);
        this.calculateTotalGss();
    }

    onSubmit() {
        this.overlay.show();
        this.submitted = true;
        if (!ObjectUtil.isEmpty(this.gssData)) {
            this.submitData = this.gssData;
        }
        this.submitData = JSON.stringify(this.gssForm.value);
        this.overlay.hide();
        this.gssDataEmitter.emit(this.submitData);
    }

    setGssData(data) {
        const gssDetail = this.gssForm.get('gssDetails') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                gssDetail.push(
                    this.formBuilder.group({
                        customerName: [d.customerName],
                        customerID: [d.customerID],
                        riskGrade: [d.riskGrade],
                        fundedLimited: [d.fundedLimited],
                        nonFundedLimited: [d.nonFundedLimited],
                        totalLimit: [d.totalLimit]
                    })
                );
            });
        }
    }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CalendarType} from '../../../@core/model/calendar-type';
import {cpus} from 'os';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {MGroup} from '../../customer/model/mGroup';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {InWordsPipe} from 'ngx-num-to-words';
import {TitleCasePipe} from '@angular/common';

@Component({
    selector: 'app-group-summary-sheet',
    templateUrl: './group-summary-sheet.component.html',
    styleUrls: ['./group-summary-sheet.component.scss']
})
export class GroupSummarySheetComponent implements OnInit {
    @Input() customerInfo;
    @Input() gssData: MGroup;
    @Input() fromProfile: boolean;
    @Output() gssDataEmitter = new EventEmitter();
    @Input() calendarType: CalendarType;
    gssForm: FormGroup;
    submitData;
    submitted = false;
    isVisible = false;

    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService,
                private inWords: InWordsPipe,
                private titlecase: TitleCasePipe) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.gssData)) {
            const data = JSON.parse(this.gssData.detailInformation);
            this.buildForm(data);
            this.setGssData(data.gssDetails);
        } else {
            this.buildForm();
            this.addGssData();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo)) {
            if (this.customerInfo.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' || this.customerInfo.clientType === 'DEPRIVED_SECTOR'
                || this.customerInfo.clientType === 'CONSUMER_FINANCE' || this.customerInfo.clientType === 'MICRO_FINANCIAL_SERVICES') {
                this.isVisible = true;
            }
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
            existingOne: [data ? data.existingOne : undefined],
            proposedOne: [data ? data.proposedOne : undefined],
            differenceOne: [data ? data.differenceOne : undefined],
            existingTwo: [data ? data.existingTwo : undefined],
            proposedTwo: [data ? data.proposedTwo : undefined],
            differenceTwo: [data ? data.differenceTwo : undefined],
            existingThree: [data ? data.existingThree : undefined],
            proposedThree: [data ? data.proposedThree : undefined],
            differenceThree: [data ? data.differenceThree : undefined],
            existingFour: [data ? data.existingFour : undefined],
            proposedFour: [data ? data.proposedFour : undefined],
            differenceFour: [data ? data.differenceFour : undefined],
            existingFive: [data ? data.existingFive : undefined],
            proposedFive: [data ? data.proposedFive : undefined],
            differenceFive: [data ? data.differenceFive : undefined],
            existingSix: [data ? data.existingSix : undefined],
            proposedSix: [data ? data.proposedSix : undefined],
            differenceSix: [data ? data.differenceSix : undefined],
            existingOther: [data ? data.existingOther : undefined],
            proposedOther: [data ? data.proposedOther : undefined],
            differenceOther: [data ? data.differenceOther : undefined],
            totalExisting: [data ? data.totalExisting : undefined],
            totalProposed: [data ? data.totalProposed : undefined],
            totalDifference: [data ? data.totalDifference : undefined],
            expectedLossExisting: [data ? data.expectedLossExisting : undefined],
            expectedLossProposed: [data ? data.expectedLossProposed : undefined],
            expectedLossDifference: [data ? data.expectedLossDifference : undefined],
            existingLoanRatio: [data ? data.existingLoanRatio : undefined],
            proposedLoanRatio: [data ? data.proposedLoanRatio : undefined],
            differenceLoanRatio: [data ? data.differenceLoanRatio : undefined],
            totalLimit: [data ? data.totalLimit : undefined],
            fmv: [data ? data.fmv : undefined],
            surplus: [data ? data.surplus : undefined],
            loanToFmv: [data ? data.loanToFmv : undefined]
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
    calculateTotalSecurity(key) {
        let totalAmount = 0;
        for (let i = 1; i <= 6; i++) {
            const num = this.titlecase.transform(<string>this.inWords.transform(i));
            totalAmount += Number(Number(this.gssForm.get(`${key}${num}`).value).toFixed(2));
        }
        totalAmount += Number(this.gssForm.get(`${key}Other`).value);
        this.gssForm.get(`total${this.titlecase.transform(key)}`).setValue(totalAmount);
    }
    calculateDifference(Existing, Proposed, Difference) {
        let difference = 0;
        difference = Number((Number(this.gssForm.get(Existing).value) - Number(this.gssForm.get(Proposed).value)).toFixed(2));
        this.gssForm.get(Difference).setValue(difference);
    }
    calculateTotalDifference(Existing, Proposed, Difference) {
        let totalDifference = 0;
        totalDifference = Number((Number(this.gssForm.get(Existing).value) - Number(this.gssForm.get(Proposed).value)).toFixed(2));
        this.gssForm.get(Difference).setValue(totalDifference);
    }
    onSubmit() {
        this.overlay.show();
        this.submitted = true;
        if (!ObjectUtil.isEmpty(this.gssData)) {
            this.submitData = this.gssData;
        }
        const data = {
            otherDetail: JSON.stringify(this.gssForm.value),
            groupCode: this.gssForm.get('groupCode').value
        };
        this.overlay.hide();
        this.gssDataEmitter.emit(data);
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

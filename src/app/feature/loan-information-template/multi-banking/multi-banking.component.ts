import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiBanking} from '../../loan/model/multiBanking';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-multi-banking',
    templateUrl: './multi-banking.component.html',
    styleUrls: ['./multi-banking.component.scss']
})
export class MultiBankingComponent implements OnInit {
    @Input() fromProfile: boolean;
    @Input() multiBankingData: MultiBanking;
    @Output() multiBankingDataEmitter = new EventEmitter();
    calendarType = 'AD';
    multiBankingForm: FormGroup;
    multiBanking: MultiBanking = new MultiBanking();

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.multiBankingData)) {
            this.multiBanking = this.multiBankingData;
            const data = JSON.parse(this.multiBankingData.data);
            this.multiBankingForm.patchValue(data);
            this.setMultiBankindData(data.multiBanking);
            this.setConsortiumData(data.consortium);
        } else {
            this.addMultiBanking();
            this.addConsortium();
        }
    }

    buildForm() {
        this.multiBankingForm = this.formBuilder.group({
            multiBanking: this.formBuilder.array([]),
            consortium: this.formBuilder.array([]),
            isMultiBanking: [false],
            isConsortium: [false],
            leadBank: [undefined],
            lastAudited: [undefined],
            auditorName: [undefined],
            taxAmount: [undefined],
            nameExecutive: [undefined],
            addressExecutive: [undefined],
            dateOfApp: [undefined],
            totalFundedLimited: [0],
            totalNonFundedLimited: [0],
            totalLimited1: [0],
            totalFundedOS: [0],
            totalNonFundedOS: [0],
            totalOS1: [0],
            conTotalFundedLimited: [0],
            conTotalNonFundedLimited: [0],
            conTotalLimited1: [0],
            conTotalFundedOS: [0],
            conTotalNonFundedOS: [0],
            conTotalOS1: [0],
            remark: [undefined],
            firstPari: [undefined],
            lastPari: [undefined],
            firstFacility: [undefined],
            latestFacility: [undefined],

        });
    }

    submitForm() {
        this.multiBanking.data = JSON.stringify(this.multiBankingForm.value);
        this.multiBankingDataEmitter.emit(this.multiBanking);
    }

    addMultiBanking() {
        (this.multiBankingForm.get('multiBanking') as FormArray).push(
            this.formBuilder.group({
                bankName: [undefined],
                date: [undefined],
                fundedLimited: [undefined],
                nonFundedLimited: [undefined],
                totalLimit: [undefined],
                fundedOS: [undefined],
                nonFundedOS: [undefined],
                totalOS: [undefined],
                remarks: [undefined],
            })
        );
    }

    addConsortium() {
        (this.multiBankingForm.get('consortium') as FormArray).push(
            this.formBuilder.group({
                conBankName: [undefined],
                conDate: [undefined],
                conFundedLimited: [undefined],
                conNonFundedLimited: [undefined],
                conTotalLimit: [undefined],
                conFundedOS: [undefined],
                conNonFundedOS: [undefined],
                conTotalOS: [undefined],
                conRemarks: [undefined],
            })
        );
    }

    removeMultiBanking(i) {
        (<FormArray>this.multiBankingForm.get('multiBanking')).removeAt(i);
    }

    removeConsortium(i) {
        (<FormArray>this.multiBankingForm.get('consortium')).removeAt(i);
    }

    calculateTotalMultiBanking() {
        let totalFundedLimited = 0;
        let totalNonFundedLimited = 0;
        let totalLimited = 0;
        let totalFundedOS = 0;
        let totalNonFundedOS = 0;
        let totalOS = 0;
        const data = this.multiBankingForm.get('multiBanking') as FormArray;
        data['value'].forEach((d) => {
            totalFundedLimited += Number(d['fundedLimited']);
            totalNonFundedLimited += Number(d['nonFundedLimited']);
            totalLimited += Number(d['totalLimit']);
            totalFundedOS += Number(d['fundedOS']);
            totalNonFundedOS += Number(d['nonFundedOS']);
            totalOS += Number(d['totalOS']);
        });
        this.multiBankingForm.get('totalFundedLimited').setValue(totalFundedLimited);
        this.multiBankingForm.get('totalNonFundedLimited').setValue(totalNonFundedLimited);
        this.multiBankingForm.get('totalLimited1').setValue(totalLimited);
        this.multiBankingForm.get('totalFundedOS').setValue(totalFundedOS);
        this.multiBankingForm.get('totalNonFundedOS').setValue(totalNonFundedOS);
        this.multiBankingForm.get('totalOS1').setValue(totalOS);
    }

    calculateTotalConsortium() {
        let totalFundedLimited = 0;
        let totalNonFundedLimited = 0;
        let totalLimited = 0;
        let totalFundedOS = 0;
        let totalNonFundedOS = 0;
        let totalOS = 0;
        const data = this.multiBankingForm.get('consortium') as FormArray;
        data['value'].forEach((d) => {
            totalFundedLimited += Number(d['conFundedLimited']);
            totalNonFundedLimited += Number(d['conNonFundedLimited']);
            totalLimited += Number(d['conTotalLimit']);
            totalFundedOS += Number(d['conFundedOS']);
            totalNonFundedOS += Number(d['conNonFundedOS']);
            totalOS += Number(d['conTotalOS']);
        });
        this.multiBankingForm.get('conTotalFundedLimited').setValue(totalFundedLimited);
        this.multiBankingForm.get('conTotalNonFundedLimited').setValue(totalNonFundedLimited);
        this.multiBankingForm.get('conTotalLimited1').setValue(totalLimited);
        this.multiBankingForm.get('conTotalFundedOS').setValue(totalFundedOS);
        this.multiBankingForm.get('conTotalNonFundedOS').setValue(totalNonFundedOS);
        this.multiBankingForm.get('conTotalOS1').setValue(totalOS);
    }

    multiTotalLimit(i) {
        let total = 0;
        total = Number(
            (Number(this.multiBankingForm.get(['multiBanking', i, 'fundedLimited']).value) +
                Number(this.multiBankingForm.get(['multiBanking', i, 'nonFundedLimited']).value)).toFixed(2));
        this.multiBankingForm.get(['multiBanking', i, 'totalLimit']).setValue(total);
        this.calculateTotalMultiBanking();
    }

    multiTotalOS(i) {
        let total = 0;
        total = Number(
            (Number(this.multiBankingForm.get(['multiBanking', i, 'fundedOS']).value) +
                Number(this.multiBankingForm.get(['multiBanking', i, 'nonFundedOS']).value)).toFixed(2));
        this.multiBankingForm.get(['multiBanking', i, 'totalOS']).setValue(total);
        this.calculateTotalMultiBanking();
    }

    consortiumTotalLimit(i) {
        let total = 0;
        total = Number(
            (Number(this.multiBankingForm.get(['consortium', i, 'conFundedLimited']).value) +
                Number(this.multiBankingForm.get(['consortium', i, 'conNonFundedLimited']).value)).toFixed(2));
        this.multiBankingForm.get(['consortium', i, 'conTotalLimit']).setValue(total);
        this.calculateTotalConsortium();
    }

    consortiumTotalOS(i) {
        let total = 0;
        total = Number(
            (Number(this.multiBankingForm.get(['consortium', i, 'conFundedOS']).value) +
                Number(this.multiBankingForm.get(['consortium', i, 'conNonFundedOS']).value)).toFixed(2));
        this.multiBankingForm.get(['consortium', i, 'conTotalOS']).setValue(total);
        this.calculateTotalConsortium();
    }

    setMultiBankindData(data) {
        const multiBank = this.multiBankingForm.get('multiBanking') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                multiBank.push(
                    this.formBuilder.group({
                        bankName: [d.bankName],
                        // date: [ObjectUtil.isEmpty(d) ? undefined :
                        //     ObjectUtil.isEmpty(d.date) ? undefined :
                        //         new Date(d.date)],
                        date: [d.date],
                        fundedLimited: [d.fundedLimited],
                        nonFundedLimited: [d.nonFundedLimited],
                        totalLimit: [d.totalLimit],
                        fundedOS: [d.fundedOS],
                        nonFundedOS: [d.nonFundedOS],
                        totalOS: [d.totalOS],
                        remarks: [d.remarks],
                    })
                );
            });
        }
    }

    setConsortiumData(data) {
        const consort = this.multiBankingForm.get('consortium') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((d) => {
                consort.push(
                    this.formBuilder.group({
                        conBankName: [d.conBankName],
                        // conDate: [ObjectUtil.isEmpty(d) ? undefined :
                        //     ObjectUtil.isEmpty(d.conDate) ? undefined :
                        //         new Date(d.conDate)],
                        conDate: [d.conDate],
                        conFundedLimited: [d.conFundedLimited],
                        conNonFundedLimited: [d.conNonFundedLimited],
                        conTotalLimit: [d.conTotalLimit],
                        conFundedOS: [d.conFundedOS],
                        conNonFundedOS: [d.conNonFundedOS],
                        conTotalOS: [d.conTotalOS],
                        conRemarks: [d.conRemarks],
                    })
                );
            });
        }
    }
}

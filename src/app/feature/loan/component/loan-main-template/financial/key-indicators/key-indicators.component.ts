import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-key-indicators',
    templateUrl: './key-indicators.component.html',
    styleUrls: ['./key-indicators.component.scss']
})
export class KeyIndicatorsComponent implements OnInit {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    @Output() removeFiscalYear = new EventEmitter<any>();
    keyIndicatorsForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildKeyIndicatorsForm();
        if (this.formData['keyIndicatorsData'] !== undefined) {
            const keyIndicatorsData = this.formData['keyIndicatorsData'];
            this.setGrowth(keyIndicatorsData.growth);
            this.setSales(keyIndicatorsData.sales);
            this.setGrossProfitKI(keyIndicatorsData.grossProfitKI);
            this.setOperatingProfitKI(keyIndicatorsData.operatingProfitKI);
            this.setPAT(keyIndicatorsData.pAT);
            this.setProfitability(keyIndicatorsData.profitability);
            this.setGrossProfitMargin(keyIndicatorsData.grossProfitMargin);
            this.setNetProfitMargin(keyIndicatorsData.netProfitMargin);
            this.setEBITtoSales(keyIndicatorsData.eBITtoSales);
            this.setReturnOnEquity(keyIndicatorsData.returnOnEquity);
            this.setSolvency(keyIndicatorsData.solvency);
            this.setQuickRatio(keyIndicatorsData.quickRatio);
            this.setCurrentRatio(keyIndicatorsData.currentRatio);
            this.setDebtServiceCoverageRatio(keyIndicatorsData.debtServiceCoverageRatio);
            this.setInterestCoverageRatio(keyIndicatorsData.interestCoverageRatio);
            this.setDebtEquityRatioOverall(keyIndicatorsData.debtEquityRatioOverall);
            this.setDebtEquityRatioLongTerm(keyIndicatorsData.debtEquityRatioLongTerm);
            this.setDebtEquityRatioWorkingCapital(keyIndicatorsData.debtEquityRatioWorkingCapital);
            this.setDebtEquityRatioGeneral(keyIndicatorsData.debtEquityRatioGeneral);
            this.setOperatingCycle(keyIndicatorsData.operatingCycle);
            this.setInventoryTurnoverRatio(keyIndicatorsData.inventoryTurnoverRatio);
            this.setStockInHandDays(keyIndicatorsData.stockInHandDays);
            this.setDebtorTurnOverRatio(keyIndicatorsData.debtorTurnOverRatio);
            this.setAverageCollectionPeriod(keyIndicatorsData.averageCollectionPeriod);
            this.setAveragePaymentPeriod(keyIndicatorsData.averagePaymentPeriod);
            this.setNetOperatingCycle(keyIndicatorsData.netOperatingCycle);
            this.setNetWCBeforeBank(keyIndicatorsData.netWCBeforeBank);
        }
    }

    buildKeyIndicatorsForm() {
        this.keyIndicatorsForm = this.formBuilder.group({
            growth: this.formBuilder.array([]),
            sales: this.formBuilder.array([]),
            grossProfitKI: this.formBuilder.array([]),
            operatingProfitKI: this.formBuilder.array([]),
            pAT: this.formBuilder.array([]),
            profitability: this.formBuilder.array([]),
            grossProfitMargin: this.formBuilder.array([]),
            netProfitMargin: this.formBuilder.array([]),
            eBITtoSales: this.formBuilder.array([]),
            returnOnEquity: this.formBuilder.array([]),
            solvency: this.formBuilder.array([]),
            quickRatio: this.formBuilder.array([]),
            currentRatio: this.formBuilder.array([]),
            debtServiceCoverageRatio: this.formBuilder.array([]),
            interestCoverageRatio: this.formBuilder.array([]),
            debtEquityRatioOverall: this.formBuilder.array([]),
            debtEquityRatioLongTerm: this.formBuilder.array([]),
            debtEquityRatioWorkingCapital: this.formBuilder.array([]),
            debtEquityRatioGeneral: this.formBuilder.array([]),
            operatingCycle: this.formBuilder.array([]),
            inventoryTurnoverRatio: this.formBuilder.array([]),
            stockInHandDays: this.formBuilder.array([]),
            debtorTurnOverRatio: this.formBuilder.array([]),
            averageCollectionPeriod: this.formBuilder.array([]),
            averagePaymentPeriod: this.formBuilder.array([]),
            netOperatingCycle: this.formBuilder.array([]),
            netWCBeforeBank: this.formBuilder.array([]),
        });
    }

    removingFiscalYear(index) {
        this.removeFiscalYear.next(index);
    }

    // Set data for Edit---
    // growth
    setGrowth(currentData) {
        const controls = this.keyIndicatorsForm.get('growth') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // sales
    setSales(currentData) {
        const controls = this.keyIndicatorsForm.get('sales') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // grossProfitKI
    setGrossProfitKI(currentData) {
        const controls = this.keyIndicatorsForm.get('grossProfitKI') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // operatingProfitKI
    setOperatingProfitKI(currentData) {
        const controls = this.keyIndicatorsForm.get('operatingProfitKI') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // pAT
    setPAT(currentData) {
        const controls = this.keyIndicatorsForm.get('pAT') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // profitability
    setProfitability(currentData) {
        const controls = this.keyIndicatorsForm.get('profitability') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // grossProfitMargin
    setGrossProfitMargin(currentData) {
        const controls = this.keyIndicatorsForm.get('grossProfitMargin') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netProfitMargin
    setNetProfitMargin(currentData) {
        const controls = this.keyIndicatorsForm.get('netProfitMargin') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // eBITtoSales
    setEBITtoSales(currentData) {
        const controls = this.keyIndicatorsForm.get('eBITtoSales') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // returnOnEquity
    setReturnOnEquity(currentData) {
        const controls = this.keyIndicatorsForm.get('returnOnEquity') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // solvency
    setSolvency(currentData) {
        const controls = this.keyIndicatorsForm.get('solvency') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // quickRatio
    setQuickRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('quickRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // currentRatio
    setCurrentRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('currentRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtServiceCoverageRatio
    setDebtServiceCoverageRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('debtServiceCoverageRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // interestCoverageRatio
    setInterestCoverageRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('interestCoverageRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtEquityRatioOverall
    setDebtEquityRatioOverall(currentData) {
        const controls = this.keyIndicatorsForm.get('debtEquityRatioOverall') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtEquityRatioLongTerm
    setDebtEquityRatioLongTerm(currentData) {
        const controls = this.keyIndicatorsForm.get('debtEquityRatioLongTerm') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtEquityRatioWorkingCapital
    setDebtEquityRatioWorkingCapital(currentData) {
        const controls = this.keyIndicatorsForm.get('debtEquityRatioWorkingCapital') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtEquityRatioGeneral
    setDebtEquityRatioGeneral(currentData) {
        const controls = this.keyIndicatorsForm.get('debtEquityRatioGeneral') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // operatingCycle
    setOperatingCycle(currentData) {
        const controls = this.keyIndicatorsForm.get('operatingCycle') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // inventoryTurnoverRatio
    setInventoryTurnoverRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('inventoryTurnoverRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // stockInHandDays
    setStockInHandDays(currentData) {
        const controls = this.keyIndicatorsForm.get('stockInHandDays') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // debtorTurnOverRatio
    setDebtorTurnOverRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('debtorTurnOverRatio') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // averageCollectionPeriod
    setAverageCollectionPeriod(currentData) {
        const controls = this.keyIndicatorsForm.get('averageCollectionPeriod') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // averagePaymentPeriod
    setAveragePaymentPeriod(currentData) {
        const controls = this.keyIndicatorsForm.get('averagePaymentPeriod') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netOperatingCycle
    setNetOperatingCycle(currentData) {
        const controls = this.keyIndicatorsForm.get('netOperatingCycle') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netWCBeforeBank
    setNetWCBeforeBank(currentData) {
        const controls = this.keyIndicatorsForm.get('netWCBeforeBank') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

}

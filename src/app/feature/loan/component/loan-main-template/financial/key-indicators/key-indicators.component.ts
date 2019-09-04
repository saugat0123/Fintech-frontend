import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-key-indicators',
    templateUrl: './key-indicators.component.html',
    styleUrls: ['./key-indicators.component.scss']
})
export class KeyIndicatorsComponent implements OnInit {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    keyIndicatorsForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildKeyIndicatorsForm();
        if (this.formData['data'].keyIndicatorsData !== undefined) {
            const keyIndicatorsData = this.formData['data'].keyIndicatorsData;
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
        if (this.fiscalYear.length > this.keyIndicatorsForm.get('growth')['controls'].length) {
            this.fiscalYear.forEach( yearValue => {
                this.addFiscalYearKeyIndicators(yearValue);
            });
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

    // Fiscal year addition for Key indicators---
    addFiscalYearKeyIndicators(yearValue) {
        // Push growth
        const growthControl = this.keyIndicatorsForm.get('growth') as FormArray;
        growthControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push sales
        const salesControl = this.keyIndicatorsForm.get('sales') as FormArray;
        salesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push grossProfitKI
        const grossProfitKIControl = this.keyIndicatorsForm.get('grossProfitKI') as FormArray;
        grossProfitKIControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push operatingProfitKI
        const operatingProfitKIControl = this.keyIndicatorsForm.get('operatingProfitKI') as FormArray;
        operatingProfitKIControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push pAT
        const pATControl = this.keyIndicatorsForm.get('pAT') as FormArray;
        pATControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push profitability
        const profitabilityControl = this.keyIndicatorsForm.get('profitability') as FormArray;
        profitabilityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push grossProfitMargin
        const grossProfitMarginControl = this.keyIndicatorsForm.get('grossProfitMargin') as FormArray;
        grossProfitMarginControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netProfitMargin
        const netProfitMarginControl = this.keyIndicatorsForm.get('netProfitMargin') as FormArray;
        netProfitMarginControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push eBITtoSales
        const eBITtoSalesControl = this.keyIndicatorsForm.get('eBITtoSales') as FormArray;
        eBITtoSalesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push returnOnEquity
        const returnOnEquity = this.keyIndicatorsForm.get('returnOnEquity') as FormArray;
        returnOnEquity.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push solvency
        const solvency = this.keyIndicatorsForm.get('solvency') as FormArray;
        solvency.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push quickRatio
        const quickRatio = this.keyIndicatorsForm.get('quickRatio') as FormArray;
        quickRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push currentRatio
        const currentRatio = this.keyIndicatorsForm.get('currentRatio') as FormArray;
        currentRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtServiceCoverageRatio
        const debtServiceCoverageRatio = this.keyIndicatorsForm.get('debtServiceCoverageRatio') as FormArray;
        debtServiceCoverageRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestCoverageRatio
        const interestCoverageRatio = this.keyIndicatorsForm.get('interestCoverageRatio') as FormArray;
        interestCoverageRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioOverall
        const debtEquityRatioOverall = this.keyIndicatorsForm.get('debtEquityRatioOverall') as FormArray;
        debtEquityRatioOverall.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioLongTerm
        const debtEquityRatioLongTerm = this.keyIndicatorsForm.get('debtEquityRatioLongTerm') as FormArray;
        debtEquityRatioLongTerm.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioWorkingCapital
        const debtEquityRatioWorkingCapital = this.keyIndicatorsForm.get('debtEquityRatioWorkingCapital') as FormArray;
        debtEquityRatioWorkingCapital.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioGeneral
        const debtEquityRatioGeneral = this.keyIndicatorsForm.get('debtEquityRatioGeneral') as FormArray;
        debtEquityRatioGeneral.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push operatingCycle
        const operatingCycle = this.keyIndicatorsForm.get('operatingCycle') as FormArray;
        operatingCycle.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push inventoryTurnoverRatio
        const inventoryTurnoverRatio = this.keyIndicatorsForm.get('inventoryTurnoverRatio') as FormArray;
        inventoryTurnoverRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push stockInHandDays
        const stockInHandDays = this.keyIndicatorsForm.get('stockInHandDays') as FormArray;
        stockInHandDays.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtorTurnOverRatio
        const debtorTurnOverRatio = this.keyIndicatorsForm.get('debtorTurnOverRatio') as FormArray;
        debtorTurnOverRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push averageCollectionPeriod
        const averageCollectionPeriod = this.keyIndicatorsForm.get('averageCollectionPeriod') as FormArray;
        averageCollectionPeriod.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push averagePaymentPeriod
        const averagePaymentPeriod = this.keyIndicatorsForm.get('averagePaymentPeriod') as FormArray;
        averagePaymentPeriod.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netOperatingCycle
        const netOperatingCycle = this.keyIndicatorsForm.get('netOperatingCycle') as FormArray;
        netOperatingCycle.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netWCBeforeBank
        const netWCBeforeBank = this.keyIndicatorsForm.get('netWCBeforeBank') as FormArray;
        netWCBeforeBank.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
    }

    // Removing Fiscal Year for Key indicators---
    removeFiscalYearKeyIndicators(index) {
        // remove growth
        const growth = this.keyIndicatorsForm.get('growth') as FormArray;
        growth.removeAt(index);
        // remove sales
        const sales = this.keyIndicatorsForm.get('sales') as FormArray;
        sales.removeAt(index);
        // remove grossProfitKI
        const grossProfitKI = this.keyIndicatorsForm.get('grossProfitKI') as FormArray;
        grossProfitKI.removeAt(index);
        // remove operatingProfitKI
        const operatingProfitKI = this.keyIndicatorsForm.get('operatingProfitKI') as FormArray;
        operatingProfitKI.removeAt(index);
        // remove pAT
        const pAT = this.keyIndicatorsForm.get('pAT') as FormArray;
        pAT.removeAt(index);
        // remove profitability
        const profitability = this.keyIndicatorsForm.get('profitability') as FormArray;
        profitability.removeAt(index);
        // remove grossProfitMargin
        const grossProfitMargin = this.keyIndicatorsForm.get('grossProfitMargin') as FormArray;
        grossProfitMargin.removeAt(index);
        // remove netProfitMargin
        const netProfitMargin = this.keyIndicatorsForm.get('netProfitMargin') as FormArray;
        netProfitMargin.removeAt(index);
        // remove eBITtoSales
        const eBITtoSales = this.keyIndicatorsForm.get('eBITtoSales') as FormArray;
        eBITtoSales.removeAt(index);
        // remove returnOnEquity
        const returnOnEquity = this.keyIndicatorsForm.get('returnOnEquity') as FormArray;
        returnOnEquity.removeAt(index);
        // remove solvency
        const solvency = this.keyIndicatorsForm.get('solvency') as FormArray;
        solvency.removeAt(index);
        // remove quickRatio
        const quickRatio = this.keyIndicatorsForm.get('quickRatio') as FormArray;
        quickRatio.removeAt(index);
        // remove currentRatio
        const currentRatio = this.keyIndicatorsForm.get('currentRatio') as FormArray;
        currentRatio.removeAt(index);
        // remove debtServiceCoverageRatio
        const debtServiceCoverageRatio = this.keyIndicatorsForm.get('debtServiceCoverageRatio') as FormArray;
        debtServiceCoverageRatio.removeAt(index);
        // remove interestCoverageRatio
        const interestCoverageRatio = this.keyIndicatorsForm.get('interestCoverageRatio') as FormArray;
        interestCoverageRatio.removeAt(index);
        // remove debtEquityRatioOverall
        const debtEquityRatioOverall = this.keyIndicatorsForm.get('debtEquityRatioOverall') as FormArray;
        debtEquityRatioOverall.removeAt(index);
        // remove debtEquityRatioLongTerm
        const debtEquityRatioLongTerm = this.keyIndicatorsForm.get('debtEquityRatioLongTerm') as FormArray;
        debtEquityRatioLongTerm.removeAt(index);
        // remove debtEquityRatioWorkingCapital
        const debtEquityRatioWorkingCapital = this.keyIndicatorsForm.get('debtEquityRatioWorkingCapital') as FormArray;
        debtEquityRatioWorkingCapital.removeAt(index);
        // remove debtEquityRatioGeneral
        const debtEquityRatioGeneral = this.keyIndicatorsForm.get('debtEquityRatioGeneral') as FormArray;
        debtEquityRatioGeneral.removeAt(index);
        // remove operatingCycle
        const operatingCycle = this.keyIndicatorsForm.get('operatingCycle') as FormArray;
        operatingCycle.removeAt(index);
        // remove inventoryTurnoverRatio
        const inventoryTurnoverRatio = this.keyIndicatorsForm.get('inventoryTurnoverRatio') as FormArray;
        inventoryTurnoverRatio.removeAt(index);
        // remove stockInHandDays
        const stockInHandDays = this.keyIndicatorsForm.get('stockInHandDays') as FormArray;
        stockInHandDays.removeAt(index);
        // remove debtorTurnOverRatio
        const debtorTurnOverRatio = this.keyIndicatorsForm.get('debtorTurnOverRatio') as FormArray;
        debtorTurnOverRatio.removeAt(index);
        // remove averageCollectionPeriod
        const averageCollectionPeriod = this.keyIndicatorsForm.get('averageCollectionPeriod') as FormArray;
        averageCollectionPeriod.removeAt(index);
        // remove averagePaymentPeriod
        const averagePaymentPeriod = this.keyIndicatorsForm.get('averagePaymentPeriod') as FormArray;
        averagePaymentPeriod.removeAt(index);
        // remove netOperatingCycle
        const netOperatingCycle = this.keyIndicatorsForm.get('netOperatingCycle') as FormArray;
        netOperatingCycle.removeAt(index);
        // remove netWCBeforeBank
        const netWCBeforeBank = this.keyIndicatorsForm.get('netWCBeforeBank') as FormArray;
        netWCBeforeBank.removeAt(index);
    }

    //
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

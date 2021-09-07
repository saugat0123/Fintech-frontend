import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinancialDeleteComponentComponent} from '../financial-delete-component/financial-delete-component.component';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {KeyIndicatorsConstantsEnum} from '../constants/key-indicators-constants';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-key-indicators',
    templateUrl: './key-indicators.component.html',
    styleUrls: ['./key-indicators.component.scss']
})
export class KeyIndicatorsComponent implements OnInit, OnDestroy {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    @Output() removeFiscalYear = new EventEmitter<any>();
    keyIndicatorsForm: FormGroup;
    ckeConfig = Editor.CK_CONFIG;

    summaryCheckListMap: Map<string, boolean> = new Map<string, boolean>([
        ['growth', false],
        ['sales', false],
        ['grossProfitKI', false],
        ['operatingProfitKI', false],
        ['pAT', false],
        ['profitability', false],
        ['grossProfitMargin', false],
        ['netProfitMargin', false],
        ['eBITtoSales', false],
        ['returnOnEquity', false],
        ['solvency', false],
        ['quickRatio', false],
        ['currentRatio', false],
        ['debtServiceCoverageRatio', false],
        ['interestCoverageRatio', false],
        ['deRatioExcludingLoanFromShareholderOrDirector', false],
        ['deRatioIncludingLoanFromShareholderOrDirector', false],
        ['debtEquityRatioOverall', false],
        ['debtEquityRatioLongTerm', false],
        ['debtEquityRatioWorkingCapital', false],
        ['debtEquityRatioGeneral', false],
        ['leverageRatio', false],
        ['operatingCycle', false],
        ['inventoryTurnoverRatio', false],
        ['stockInHandDays', false],
        ['debtorTurnOverRatio', false],
        ['averageCollectionPeriod', false],
        ['averagePaymentPeriod', false],
        ['netOperatingCycle', false],
        ['netWCBeforeBank', false],
        ['cashFlowKI', false]
    ]);

    summaryCheckList = KeyIndicatorsConstantsEnum.values();

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private toastService: ToastService) {
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
            this.setDeRatioExcludingLoanFromShareholderOrDirector(keyIndicatorsData.deRatioExcludingLoanFromShareholderOrDirector);
            this.setDeRatioIncludingLoanFromShareholderOrDirector(keyIndicatorsData.deRatioIncludingLoanFromShareholderOrDirector);
            this.setDebtEquityRatioOverall(keyIndicatorsData.debtEquityRatioOverall);
            this.setDebtEquityRatioLongTerm(keyIndicatorsData.debtEquityRatioLongTerm);
            this.setDebtEquityRatioWorkingCapital(keyIndicatorsData.debtEquityRatioWorkingCapital);
            this.setDebtEquityRatioGeneral(keyIndicatorsData.debtEquityRatioGeneral);
            this.setLeverageRatio(keyIndicatorsData.leverageRatio);
            this.setOperatingCycle(keyIndicatorsData.operatingCycle);
            this.setInventoryTurnoverRatio(keyIndicatorsData.inventoryTurnoverRatio);
            this.setStockInHandDays(keyIndicatorsData.stockInHandDays);
            this.setDebtorTurnOverRatio(keyIndicatorsData.debtorTurnOverRatio);
            this.setAverageCollectionPeriod(keyIndicatorsData.averageCollectionPeriod);
            this.setAveragePaymentPeriod(keyIndicatorsData.averagePaymentPeriod);
            this.setNetOperatingCycle(keyIndicatorsData.netOperatingCycle);
            this.setNetWCBeforeBank(keyIndicatorsData.netWCBeforeBank);
            keyIndicatorsData.cashFlowKI === undefined ? this.setMockCashFlowKI(keyIndicatorsData.netOperatingCycle) :
                this.setCashFlowKI(keyIndicatorsData.cashFlowKI);
            this.keyIndicatorsForm.get('justificationKeyIndicators').patchValue(keyIndicatorsData.justificationKeyIndicators);
            try {
                if (keyIndicatorsData.summaryCheckList.length > 0) {
                    this.keyIndicatorsForm.get('summaryCheckList').patchValue(keyIndicatorsData.summaryCheckList);
                }
                this.setSummaryCheckListTemplateValues(keyIndicatorsData.summaryCheckList);
            } catch (e) {
                this.toastService.show(new Alert(AlertType.WARNING, 'No existing value found for summary checklist!'));
            }
        } else {
            this.setSummaryCheckListTemplateValues(this.summaryCheckList);
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
            deRatioExcludingLoanFromShareholderOrDirector: this.formBuilder.array([]),
            deRatioIncludingLoanFromShareholderOrDirector: this.formBuilder.array([]),
            debtEquityRatioOverall: this.formBuilder.array([]),
            debtEquityRatioLongTerm: this.formBuilder.array([]),
            debtEquityRatioWorkingCapital: this.formBuilder.array([]),
            debtEquityRatioGeneral: this.formBuilder.array([]),
            leverageRatio: this.formBuilder.array([]),
            operatingCycle: this.formBuilder.array([]),
            inventoryTurnoverRatio: this.formBuilder.array([]),
            stockInHandDays: this.formBuilder.array([]),
            debtorTurnOverRatio: this.formBuilder.array([]),
            averageCollectionPeriod: this.formBuilder.array([]),
            averagePaymentPeriod: this.formBuilder.array([]),
            netOperatingCycle: this.formBuilder.array([]),
            netWCBeforeBank: this.formBuilder.array([]),
            cashFlowKI: this.formBuilder.array([]),
            justificationKeyIndicators: [undefined],
            summaryCheckList: [this.summaryCheckList]
        });
    }

    checkForSummaryList(particular: string, event: boolean) {
        const onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        };
        if (event) {
            this.summaryCheckList.push(particular);
        } else {
            const spliceIndex = this.summaryCheckList.indexOf(particular);
            this.summaryCheckList.splice(spliceIndex, 1);
            if (this.summaryCheckList.length < 1) {
                this.toastService.show(new Alert(AlertType.WARNING, 'Please select at least one Key Indicator!'));
            }
        }
        this.summaryCheckList = this.summaryCheckList.filter(onlyUnique);
    }

    setSummaryCheckListTemplateValues(summaryCheckList) {
        this.summaryCheckList = summaryCheckList;
        summaryCheckList.forEach(singleParameter => {
            this.summaryCheckListMap.set(singleParameter, true);
        });
    }

    removingFiscalYear(fiscalYear, index) {
        this.modalService.open(FinancialDeleteComponentComponent).result.then(message => {
            if (message === ModalResponse.SUCCESS) {
                const removeParamsObject = {fiscalYear: fiscalYear, index: index};
                this.removeFiscalYear.next(removeParamsObject);
            }
        });
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

    // deRatioExcludingLoanFromShareholderOrDirector
    setDeRatioExcludingLoanFromShareholderOrDirector(currentData) {
        const controls = this.keyIndicatorsForm.get('deRatioExcludingLoanFromShareholderOrDirector') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // deRatioIncludingLoanFromShareholderOrDirector
    setDeRatioIncludingLoanFromShareholderOrDirector(currentData) {
        const controls = this.keyIndicatorsForm.get('deRatioIncludingLoanFromShareholderOrDirector') as FormArray;
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

    // leverageRatio
    setLeverageRatio(currentData) {
        const controls = this.keyIndicatorsForm.get('leverageRatio') as FormArray;
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

    // cashFlowKI
    setCashFlowKI(currentData) {
        const controls = this.keyIndicatorsForm.get('cashFlowKI') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setMockCashFlowKI(currentData) {
        const controls = this.keyIndicatorsForm.get('cashFlowKI') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [0],
                    year: [0]
                })
            );
        });
    }

    ngOnDestroy(): void {
        this.keyIndicatorsForm.get('summaryCheckList').patchValue(this.summaryCheckList);
        this.formData['keyIndicatorsData'].summaryCheckList = this.keyIndicatorsForm.get('summaryCheckList').value;
        this.formData['keyIndicatorsData'].cashFlowKI = this.keyIndicatorsForm.get('cashFlowKI').value;
        this.formData['keyIndicatorsData'].justificationKeyIndicators = this.keyIndicatorsForm.get('justificationKeyIndicators').value;
    }
}

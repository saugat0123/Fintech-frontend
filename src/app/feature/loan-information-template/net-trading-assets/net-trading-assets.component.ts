import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
    selector: 'app-net-trading-assets',
    templateUrl: './net-trading-assets.component.html',
    styleUrls: ['./net-trading-assets.component.scss']
})
export class NetTradingAssetsComponent implements OnInit {
    @Input() netTradingAssetsData?: NetTradingAssets;
    @Input() fromProfile: boolean;
    @Output() netTradingAssetsEventEmitter = new EventEmitter();

    currentYearIndex = 0;
    selectedIndex = 0;

    quarterCalculationObject = {
        q1: undefined,
        q2: undefined,
        q3: undefined,
        q4: undefined,
        average: undefined
    };

    netTradingAssetSubmitData: NetTradingAssets = new NetTradingAssets();
    parentForm: FormGroup;
    netTradingAssetsFormArray: FormArray;
    fiscalYearArray = new Array<FiscalYear>();

    spinner = false;

    constructor(protected formBuilder: FormBuilder,
                protected fiscalYearService: FiscalYearService,
                protected toastService: ToastService) {
    }

    get activeFormGroup() {
        return this.netTradingAssetsFormArray.at(this.selectedIndex) as FormGroup;
    }

    ngOnInit() {
        this.parentForm = this.formBuilder.group({
            netTradingAssetsFormArray: this.formBuilder.array([])
        });
        this.netTradingAssetsFormArray = this.parentForm.get('netTradingAssetsFormArray') as FormArray;
        this.getFiscalYears();
    }

    verifyDataWithFiscalYear(fiscalYearArray: Array<FiscalYear>) {
        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {

            const parsedNtaData = JSON.parse(this.netTradingAssetsData.data) as Array<any>;

            const fiscalYearComparisonArray = this.mapObjectToIdArray(fiscalYearArray);
            const parsedNtaDataComparisonArray = this.mapObjectToIdArray(parsedNtaData);

            console.log(fiscalYearComparisonArray, parsedNtaDataComparisonArray, 'u');

            // check if new year has been added
            const newFiscalArray = fiscalYearComparisonArray.filter(f => {
                return !parsedNtaDataComparisonArray.includes(f);
            });

            // check if a year has been disabled TODO: test-scenario
            const disabledFiscalArray = parsedNtaDataComparisonArray.filter(p => {
                return !fiscalYearComparisonArray.includes(p);
            });

            console.log(newFiscalArray, disabledFiscalArray, 'u');

            // add new array --
            if (newFiscalArray.length > 0) {
                newFiscalArray.forEach(v => {
                    parsedNtaData.push({
                        id: v,
                        isCurrentYear: false,
                        valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfDebtors: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfGoodsInTrans: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
                        netTradingAssetsBefore: this.formBuilder.group(this.quarterCalculationObject),
                        otherBanksFinancing: this.formBuilder.group(this.quarterCalculationObject),
                        netTradingAssetsAfter: this.formBuilder.group(this.quarterCalculationObject)
                    });
                });
            }

            // remove disabled -- TODO: test-scenario
            if (disabledFiscalArray.length > 0) {
                parsedNtaData.forEach((o, i) => {
                    disabledFiscalArray.forEach((vId, j) => {
                        if (Number(o.id) === Number(vId)) {
                            parsedNtaData.splice(i, 1);
                        }
                    });
                });
            }

            // Check current Year --
            parsedNtaData.forEach(pObj => {
                pObj.isCurrentYear = false;
            });
            this.fiscalYearArray.forEach(obj => {
                if (obj.isCurrentYear) {
                    parsedNtaData.some(po => {
                        if (Number(po.id) === Number(obj.id)) {
                            po.isCurrentYear = true;
                            this.currentYearIndex = parsedNtaData.indexOf(po);
                            return true;
                        } else { return false; }
                    });
                }
            });

            parsedNtaData.forEach((v, i) => {
                const formObjectData = {
                    id: v.id,
                    isCurrentYear: v.isCurrentYear,
                    valueOfStock: this.formBuilder.group(this.setNestedFormValues(v.valueOfStock)),
                    valueOfDebtors: this.formBuilder.group(this.setNestedFormValues(v.valueOfDebtors)),
                    valueOfGoodsInTrans: this.formBuilder.group(this.setNestedFormValues(v.valueOfGoodsInTrans)),
                    valueOfCreditors: this.formBuilder.group(this.setNestedFormValues(v.valueOfCreditors)),
                    netTradingAssetsBefore: this.formBuilder.group(this.setNestedFormValues(v.netTradingAssetsBefore)),
                    otherBanksFinancing: this.formBuilder.group(this.setNestedFormValues(v.otherBanksFinancing)),
                    netTradingAssetsAfter: this.formBuilder.group(this.setNestedFormValues(v.netTradingAssetsAfter))
                };
                this.netTradingAssetsFormArray.push(
                    this.formBuilder.group(formObjectData)
                );
                if (v.isCurrentYear) {
                    this.currentYearIndex = parsedNtaData.indexOf(v);
                    this.selectedIndex = this.currentYearIndex;
                }
            });

        } else {
            this.fiscalYearArray.forEach(fiscalYearObj => {
                const formObjectData = {
                    id: fiscalYearObj.id,
                    isCurrentYear: fiscalYearObj.isCurrentYear,
                    valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfDebtors: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfGoodsInTrans: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
                    netTradingAssetsBefore: this.formBuilder.group(this.quarterCalculationObject),
                    otherBanksFinancing: this.formBuilder.group(this.quarterCalculationObject),
                    netTradingAssetsAfter: this.formBuilder.group(this.quarterCalculationObject)
                };
                this.netTradingAssetsFormArray.push(this.formBuilder.group(formObjectData));
                if (fiscalYearObj.isCurrentYear) {
                    this.currentYearIndex = this.fiscalYearArray.indexOf(fiscalYearObj);
                    this.selectedIndex = this.currentYearIndex;
                }
            });
            console.log(this.netTradingAssetsFormArray.at(this.selectedIndex).value);
        }
    }

    getFiscalYears() {
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
            this.verifyDataWithFiscalYear(this.fiscalYearArray);
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
    }

    setNestedFormValues(param) {
        return {
            q1: param.q1,
            q2: param.q2,
            q3: param.q3,
            q4: param.q4,
            average: param.average
        };
    }

    mapObjectToIdArray(objectArray: Array<any>): Array<any> {
        return objectArray.map(o => {
            return o.id;
        });
    }

    calculateNta(ntaFormGroup, q) {
        this.calculateNtaBefore(ntaFormGroup, q);
        this.calculateNtaAfter(ntaFormGroup, q);
    }

    calculateNtaBefore(ntaFormGroup, quarter) {
        ntaFormGroup.get(['netTradingAssetsBefore', quarter]).patchValue(
            Number((ntaFormGroup.get(['valueOfDebtors', quarter]).value)) +
            Number((ntaFormGroup.get(['valueOfStock', quarter]).value)) +
            Number((ntaFormGroup.get(['valueOfGoodsInTrans', quarter]).value)) -
            Number((ntaFormGroup.get(['valueOfCreditors', quarter]).value))
        );
    }

    calculateNtaAfter(ntaFormGroup, quarter) {
        ntaFormGroup.get(['netTradingAssetsAfter', quarter]).patchValue(
            Number((ntaFormGroup.get(['valueOfStock', quarter]).value)) +
            Number((ntaFormGroup.get(['valueOfDebtors', quarter]).value)) +
            Number((ntaFormGroup.get(['valueOfGoodsInTrans', quarter]).value)) -
            Number((ntaFormGroup.get(['valueOfCreditors', quarter]).value)) -
            Number((ntaFormGroup.get(['otherBanksFinancing', quarter]).value))
        );
    }

    onChangeFiscalYear(selectedFiscalYearObj) {
        this.netTradingAssetsFormArray.controls.forEach(singleControl => {
            if (Number(selectedFiscalYearObj.id) === Number(singleControl.value.id)) {
                this.selectedIndex = this.netTradingAssetsFormArray.controls.indexOf(singleControl);
            }
        });
    }

    onSubmit() {

        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
            this.netTradingAssetSubmitData = this.netTradingAssetsData;
        }
        this.netTradingAssetSubmitData.data = JSON.stringify(this.netTradingAssetsFormArray.value);
        this.netTradingAssetsEventEmitter.emit(this.netTradingAssetSubmitData);
    }

}

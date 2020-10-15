import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';

@Component({
    selector: 'app-net-trading-assets',
    templateUrl: './net-trading-assets.component.html',
    styleUrls: ['./net-trading-assets.component.scss']
})
export class NetTradingAssetsComponent implements OnInit {
    @Input() netTradingAssetsData: NetTradingAssets;
    @Input() fromProfile: boolean;
    @Output() netTradingAssetsEventEmitter = new EventEmitter();

    toBeSavedFiscalYear: FiscalYear;

    netTradingAssetSubmitData: NetTradingAssets;
    netTradingAssetsForm: FormGroup;
    fiscalYearArray = new Array<FiscalYear>();

    spinner = false;

    constructor(protected formBuilder: FormBuilder,
                protected fiscalYearService: FiscalYearService) {
    }

    get quartersFormGroup() {
        return this.formBuilder.group({
            q1: undefined,
            q2: undefined,
            q3: undefined,
            q4: undefined
        });
    }

    ngOnInit() {
        this.buildNtaForm();
        this.getFiscalYears();
    }

    getFiscalYears() {
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail as Array<FiscalYear>;
            this.toBeSavedFiscalYear = this.fiscalYearArray[0];
            if (!ObjectUtil.isEmpty(this.fiscalYearArray[0].ntaData)) {
                this.netTradingAssetsForm.patchValue(JSON.parse(this.fiscalYearArray[0].ntaData));
            }
        }, error => {
            console.log(error);
        });
    }

    buildNtaForm() {
        this.netTradingAssetsForm = this.formBuilder.group({
            valueOfStock: this.quartersFormGroup,
            valueOfDebtors: this.quartersFormGroup,
            valueOfGoodsInTrans: this.quartersFormGroup,
            valueOfCreditors: this.quartersFormGroup,
            netTradingAssetsBefore: this.quartersFormGroup,
            otherBanksFinancing: this.quartersFormGroup,
            netTradingAssetsAfter: this.quartersFormGroup
        });
    }

    calculateNta(q) {
        this.calculateNtaBefore(q);
        this.calculateNtaAfter(q);
    }

    calculateNtaBefore(quarter) {
        this.netTradingAssetsForm.get(['netTradingAssetsBefore', quarter]).patchValue(
            Number((this.netTradingAssetsForm.get(['valueOfDebtors', quarter]).value)) +
            Number((this.netTradingAssetsForm.get(['valueOfStock', quarter]).value)) +
            Number((this.netTradingAssetsForm.get(['valueOfGoodsInTrans', quarter]).value)) -
            Number((this.netTradingAssetsForm.get(['valueOfCreditors', quarter]).value))
        );
    }

    calculateNtaAfter(quarter) {
        this.netTradingAssetsForm.get(['netTradingAssetsAfter', quarter]).patchValue(
            Number((this.netTradingAssetsForm.get(['valueOfStock', quarter]).value)) +
            Number((this.netTradingAssetsForm.get(['valueOfDebtors', quarter]).value)) +
            Number((this.netTradingAssetsForm.get(['valueOfGoodsInTrans', quarter]).value)) -
            Number((this.netTradingAssetsForm.get(['valueOfCreditors', quarter]).value)) -
            Number((this.netTradingAssetsForm.get(['otherBanksFinancing', quarter]).value))
        );
    }

    onChangeFiscalYear(fiscalYearObj) {
        this.spinner = true;
        this.toBeSavedFiscalYear.ntaData = JSON.stringify(this.netTradingAssetsForm.value);
        this.fiscalYearService.save(this.toBeSavedFiscalYear).subscribe(() => {
            this.spinner = false;
            this.buildNtaForm();
        }, error => {
            console.log(error);
            this.spinner = false;
            this.buildNtaForm();
        });
        this.fiscalYearService.detail(fiscalYearObj.id).subscribe(res => {
            this.toBeSavedFiscalYear = res.detail;
            if (!ObjectUtil.isEmpty(this.toBeSavedFiscalYear.ntaData)) {
                this.netTradingAssetsForm.patchValue(JSON.parse(this.toBeSavedFiscalYear.ntaData));
            }
        }, error => {
            console.log(error);
        });
    }

    onSubmit() {
        this.spinner = true;
        this.toBeSavedFiscalYear.ntaData = JSON.stringify(this.netTradingAssetsForm.value);

        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
            this.netTradingAssetSubmitData = this.netTradingAssetsData;
        }

        this.fiscalYearService.save(this.toBeSavedFiscalYear).subscribe(() => {
            this.spinner = false;
        }, error => {
            console.log(error);
            this.spinner = false;
        });
        this.netTradingAssetSubmitData.data = JSON.stringify(this.netTradingAssetsForm.value);
        this.netTradingAssetsEventEmitter.emit(this.netTradingAssetSubmitData);
    }

}

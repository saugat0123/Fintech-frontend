import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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

    netTradingAssetSubmitData: NetTradingAssets;
    netTradingAssetsForm: FormGroup;
    fiscalYearArray = new Array<FiscalYear>();
    selectedFiscalYearIndex = 0;

    constructor(protected formBuilder: FormBuilder,
                protected fiscalYearService: FiscalYearService) {
    }

    ngOnInit() {
        this.buildNtaForm();
        this.getFiscalYears();
    }

    getFiscalYears() {
        this.fiscalYearService.getAll().subscribe( response => {
            this.fiscalYearArray = response.detail as Array<FiscalYear>;
            console.log(this.fiscalYearArray);
        }, error => {
            console.log(error);
        });
    }

    buildNtaForm() {
        this.netTradingAssetsForm = this.formBuilder.group({
            valueOfShare: [],
            valueOfDebtors: [],
            valueOfGoodsInTrans: [],
            valueOfCreditors: [],
            netTradingAssetsBefore: [],
            otherBanksFinancing: [],
            netTradingAssetsAfter: []
        });
    }

    get netTradingAssetsFormControl() {
        return this.netTradingAssetsForm.controls;
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
            this.netTradingAssetSubmitData = this.netTradingAssetsData;
        }
        this.netTradingAssetSubmitData.data = JSON.stringify(this.netTradingAssetsForm.value);
        this.netTradingAssetsEventEmitter.emit(this.netTradingAssetSubmitData);
    }

}

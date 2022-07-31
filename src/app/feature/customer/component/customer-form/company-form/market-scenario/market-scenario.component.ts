import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-market-scenario',
    templateUrl: './market-scenario.component.html',
    styleUrls: ['./market-scenario.component.scss']
})
export class MarketScenarioComponent implements OnInit {
    @Input() marketScenario;
    @Input() clientTypeInput;
    marketScenarioForm: FormGroup;
    submitted = false;
    ckeConfig = Editor.CK_CONFIG;
    smallBusiness = false;
    deprivedSector = false;
    microFinancialService = false;

    submitData;

    constructor(private formBuilder: FormBuilder) {
    }

    get form() {
        return this.marketScenarioForm.controls;
    }

    ngOnInit() {
        if (this.clientTypeInput === 'SMALL_BUSINESS_FINANCIAL_SERVICES') {
            this.smallBusiness = true;
        }
        if (this.clientTypeInput === 'DEPRIVED_SECTOR') {
            this.deprivedSector = true;
        }
        if (this.clientTypeInput === 'MICRO_FINANCIAL_SERVICES') {
            this.microFinancialService = true;
        }
        this.buildForm();
        this.setMarketData();
    }

    buildForm() {
        this.marketScenarioForm = this.formBuilder.group({
            keySupplier: [undefined],
            KeyBuyers: [undefined],
            competitorsOverview: [undefined],
            marketDemandService: [undefined],
            BusinessIndustryOutlook: [undefined],
            marketingStrategies: [undefined],
            technicalAspect: [undefined],
            securityRisk: [undefined],
            futurePlan: [undefined],
            latestBusinessUpdates: [undefined],
        });
    }

    onSubmit() {
        this.submitted = true;
        this.submitData = this.marketScenarioForm.value;
    }

    setMarketData() {
        if (!ObjectUtil.isEmpty(this.marketScenario)) {
            this.marketScenarioForm.patchValue(this.marketScenario);
        }
    }

}

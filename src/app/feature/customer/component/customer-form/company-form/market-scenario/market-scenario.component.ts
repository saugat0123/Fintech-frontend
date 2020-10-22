import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-market-scenario',
  templateUrl: './market-scenario.component.html',
  styleUrls: ['./market-scenario.component.scss']
})
export class MarketScenarioComponent implements OnInit, OnChanges {
  @Input() marketScenario;
  marketScenarioForm: FormGroup;
  submitted = false;

  submitData;

  constructor(private formBuilder: FormBuilder) {
  }

  get form() {
    return this.marketScenarioForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.setMarketData();
  }

  buildForm() {
    this.marketScenarioForm = this.formBuilder.group({
      keySupplier: [undefined, Validators.required],
      KeyBuyers: [undefined, Validators.required],
      competitorsOverview: [undefined],
      marketDemandService: [undefined],
      BusinessIndustryOutlook: [undefined],
      marketingStrategies: [undefined],
      technicalAspect: [undefined],
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

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(changes.marketScenario.currentValue)) {
      this.marketScenarioForm.patchValue(changes.marketScenario.currentValue);
    }
  }

}

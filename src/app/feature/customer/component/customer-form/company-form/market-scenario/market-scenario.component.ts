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
      competitorsOverview: [undefined, Validators.required],
      marketDemandService: [undefined, Validators.required],
      BusinessIndustryOutlook: [undefined, Validators.required],
      marketingStrategies: [undefined, Validators.required],
      technicalAspect: [undefined, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submitData = this.marketScenarioForm.value;
  }

  setMarketData() {
    console.log(this.marketScenario);
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

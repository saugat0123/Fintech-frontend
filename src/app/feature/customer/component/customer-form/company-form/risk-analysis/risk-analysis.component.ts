import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-risk-analysis',
    templateUrl: './risk-analysis.component.html',
    styleUrls: ['./risk-analysis.component.scss']
})
export class RiskAnalysisComponent implements OnInit {
    @Input() riskData;
    riskAnalysisForm: FormGroup;
    submitData;
    submitted = false;
    tempData;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.riskData)) {
            this.tempData = JSON.parse(this.riskData);
            this.riskAnalysisForm.patchValue(this.tempData);
        }
    }

    buildForm() {
        this.riskAnalysisForm = this.formBuilder.group({
            // Perceived risks
            industryRisk: [undefined],
            businessRisk: [undefined],
            financialRisk: [undefined],
            managementRisk: [undefined],
            successionRisk: [undefined],
            environmentalIssues: [undefined],
            adverseFeatures: [undefined],
            politicalRisk: [undefined],
            otherRisk: [undefined],
            // Mitigating factors
            industryFactor: [undefined],
            businessFactor: [undefined],
            financialFactor: [undefined],
            managementFactor: [undefined],
            successionFactor: [undefined],
            environmentalIssuesFactor: [undefined],
            adverseFeaturesFactor: [undefined],
            politicalFactor: [undefined],
            otherFactor: [undefined],
        });
    }

    get form() {
        return this.riskAnalysisForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        this.submitData = this.riskAnalysisForm.value;
    }

}

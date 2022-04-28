import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-risk-analysis',
    templateUrl: './risk-analysis.component.html',
    styleUrls: ['./risk-analysis.component.scss']
})
export class RiskAnalysisComponent implements OnInit {
    @Input() customerInfo;
    @Input() fromProfile: boolean;
    @Input() riskData;
    riskAnalysisForm: FormGroup;
    submitData;
    submitted = false;
    tempData;
    @Output() riskAnalysisDataEmitter = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService) {
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
        this.overlay.show();
        this.submitted = true;
        if (!ObjectUtil.isEmpty(this.riskData)) {
            this.submitData = this.riskData;
        }
        this.submitData = JSON.stringify(this.riskAnalysisForm.value);
        this.overlay.hide();
        this.riskAnalysisDataEmitter.emit(this.submitData);
    }

}

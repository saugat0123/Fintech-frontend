import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
            if (!ObjectUtil.isEmpty(this.tempData.riskAnalysisFreeText)) {
                this.setRiskAnalysis(this.tempData.riskAnalysisFreeText);
            }
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
            // Mitigating factors
            industryFactor: [undefined],
            businessFactor: [undefined],
            financialFactor: [undefined],
            managementFactor: [undefined],
            successionFactor: [undefined],
            environmentalIssuesFactor: [undefined],
            adverseFeaturesFactor: [undefined],
            politicalFactor: [undefined],
            riskAnalysisFreeText: this.formBuilder.array([])
        });
    }

    riskAnalysisFree() {
       return this.formBuilder.group({
            riskTypeName: [undefined],
            perceiveRisk: [undefined],
            mitigatingRisk: [undefined]
        });
    }

    addRiskAnalysis() {
        (this.riskAnalysisForm.get('riskAnalysisFreeText') as FormArray).push(this.riskAnalysisFree());
    }

    removeRiskAnalysis(i) {
        (this.riskAnalysisForm.get('riskAnalysisFreeText') as FormArray).removeAt(i);
    }

    setRiskAnalysis(data) {
        const arrayForm = this.riskAnalysisForm.get('riskAnalysisFreeText') as FormArray;
        data.forEach(val => {
            arrayForm.push(this.formBuilder.group({
                riskTypeName: [val ? val.riskTypeName : ''],
                perceiveRisk: [val ? val.perceiveRisk : ''],
                mitigatingRisk: [val ? val.mitigatingRisk : '']
            }));
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

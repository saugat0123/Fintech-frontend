import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-borrower-risk-rating',
    templateUrl: './borrower-risk-rating.component.html',
    styleUrls: ['./borrower-risk-rating.component.scss']
})
export class BorrowerRiskRatingComponent implements OnInit {
    @Input() formDataForBrrEdit;

    borrowerRiskRating: FormGroup;
    riskRating = ['Very High', 'High', 'Average', 'Moderate', 'Low', 'Very Low'];
    ratingData: Map<string, number>;
    riskAverage = '';

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.ratingData = new Map<string, number>();

        this.borrowerRiskRating = this.formBuilder.group({
            management: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.management, Validators.required],
            financialStatementQuality: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.financialStatementQuality, Validators.required],
            financialStatementSource: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.financialStatementSource, Validators.required],
            industryTrend: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.industryTrend, Validators.required],
            timeInBusiness: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.timeInBusiness, Validators.required],
            collateral: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.collateral, Validators.required],
            balanceSheetRatios: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.balanceSheetRatios, Validators.required],
            pAndLHistory: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.pAndLHistory, Validators.required],
            debtServiceCapacity: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.debtServiceCapacity, Validators.required],
            salesTrade: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.salesTrade, Validators.required],
            repaymentSource: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.repaymentSource, Validators.required],
            totalBrr: [this.formDataForBrrEdit === null ? undefined :
                this.formDataForBrrEdit.totalBrr]
        });

        if (this.formDataForBrrEdit !== null) {
            this.riskAverage = this.formDataForBrrEdit.totalBrr;
            this.ratingData.set('management', this.formDataForBrrEdit.management);
            this.ratingData.set('financialStatementQuality', this.formDataForBrrEdit.financialStatementQuality);
            this.ratingData.set('financialStatementSource', this.formDataForBrrEdit.financialStatementSource);
            this.ratingData.set('industryTrend', this.formDataForBrrEdit.industryTrend);
            this.ratingData.set('timeInBusiness', this.formDataForBrrEdit.timeInBusiness);
            this.ratingData.set('collateral', this.formDataForBrrEdit.collateral);
            this.ratingData.set('balanceSheetRatios', this.formDataForBrrEdit.balanceSheetRatios);
            this.ratingData.set('pAndLHistory', this.formDataForBrrEdit.pAndLHistory);
            this.ratingData.set('debtServiceCapacity', this.formDataForBrrEdit.debtServiceCapacity);
            this.ratingData.set('salesTrade', this.formDataForBrrEdit.salesTrade);
            this.ratingData.set('repaymentSource', this.formDataForBrrEdit.repaymentSource);
        }
    }

    checkRating(field, rating) {
        this.ratingData.set(field, rating);
        if (this.ratingData.size === 11) {
            let sum = 0;
            this.ratingData.forEach(value => {
                sum = sum + value;
            });
            const avg = sum / 11;
            this.riskAverage = avg.toFixed(2);
            this.borrowerRiskRating.get('totalBrr').patchValue(this.riskAverage);
        }
    }

}

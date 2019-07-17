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
            management: [undefined, Validators.required],
            financialStatementQuality: [undefined, Validators.required],
            financialStatementSource: [undefined, Validators.required],
            industryTrend: [undefined, Validators.required],
            timeInBusiness: [undefined, Validators.required],
            collateral: [undefined, Validators.required],
            balanceSheetRatios: [undefined, Validators.required],
            pAndLHistory: [undefined, Validators.required],
            debtServiceCapacity: [undefined, Validators.required],
            salesTrade: [undefined, Validators.required],
            repaymentSource: [undefined, Validators.required],
            totalBrr: [undefined]
        });

        /*this.ratingData.set('management', this.formDataForBrrEdit.management);
        this.ratingData.set('financialStatementQuality', this.formDataForBrrEdit.financialStatementQuality);
        this.ratingData.set('financialStatementSource', this.formDataForBrrEdit.financialStatementSource);
        this.ratingData.set('industryTrend', this.formDataForBrrEdit.industryTrend);
        this.ratingData.set('timeInBusiness', this.formDataForBrrEdit.timeInBusiness);
        this.ratingData.set('collateral', this.formDataForBrrEdit.collateral);
        this.ratingData.set('balanceSheetRatios', this.formDataForBrrEdit.balanceSheetRatios);
        this.ratingData.set('pAndLHistory', this.formDataForBrrEdit.pAndLHistory);
        this.ratingData.set('debtServiceCapacity', this.formDataForBrrEdit.debtServiceCapacity);
        this.ratingData.set('salesTrade', this.formDataForBrrEdit.salesTrade);
        this.ratingData.set('repaymentSource', this.formDataForBrrEdit.repaymentSource);*/
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
            this.borrowerRiskRating.get('totalBrr').setValue(this.riskAverage);
            console.log(this.ratingData);
        }
    }

}

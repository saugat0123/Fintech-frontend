import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-template-data',
    templateUrl: './template-data.component.html',
    styleUrls: ['./template-data.component.scss']
})
export class TemplateDataComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    offerLetterTypes = [];
    private offerLetterConst;
    offerLetterSelect;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.offerLetterTypes = MegaOfferLetterConst.enumObject();
        this.offerLetterConst = MegaOfferLetterConst;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            drawingPowerRate: [undefined],
            nepDrawingPowerRate: [undefined],
            baseRate: [undefined],
            nepBaseRate: [undefined],
            premiumRate: [undefined],
            nepPremiumRate: [undefined],
            yearlyFloatingInterestRate: [undefined],
            nepYearlyFloatingInterestRate: [undefined],
            serviceCharge: [undefined],
            nepServiceCharge: [undefined],
        });
    }

    translate() {
        console.log('Selected');
        this.http.post('https://translation.googleapis.com/language/translate/v2?key=' + environment.GOOGLE_TRANSLATE_API_KEY, {
            'q': [
                this.form.get('drawingPowerRate').value,
                this.form.get('baseRate').value,
                this.form.get('premiumRate').value,
                this.form.get('yearlyFloatingInterestRate').value,
                this.form.get('serviceCharge').value,
            ],
            'target': 'ne'
        }).subscribe((res: any) => {
            console.log('Value :', res);
            // this.translatedname = res.data.translations[0].translatedText;
            // this.translatedaddress = res.data.translations[1].translatedText;
            this.form.get('nepDrawingPowerRate').patchValue(res.data.translations[0].translatedText);
            this.form.get('nepBaseRate').patchValue(res.data.translations[1].translatedText);
            this.form.get('nepPremiumRate').patchValue(res.data.translations[2].translatedText);
            this.form.get('nepYearlyFloatingInterestRate').patchValue(res.data.translations[3].translatedText);
            this.form.get('nepServiceCharge').patchValue(res.data.translations[4].translatedText);
        });
    }


    submit() {

    }
}

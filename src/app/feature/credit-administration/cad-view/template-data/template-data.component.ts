import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
    selector: 'app-template-data',
    templateUrl: './template-data.component.html',
    styleUrls: ['./template-data.component.scss']
})
export class TemplateDataComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    offerLetterTypes = MegaOfferLetterConst.enumObject();
    offerLetterConst = MegaOfferLetterConst;
    offerLetterSelect;
    form: FormGroup;
    translatedValues: any = {};
    spinner = false;


    constructor(
        private formBuilder: FormBuilder,
        private translateService: SbTranslateService,
    ) {
    }

    ngOnInit() {
    }

    submit() {

    }
}

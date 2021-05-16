import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-dristibadhaki',
    templateUrl: './dristibadhaki.component.html',
    styleUrls: ['./dristibadhaki.component.scss']
})
export class DristibadhakiComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    spinner;
    form: FormGroup;
    offerLetterConst = ExcelOfferLetterConst;
    initialInfoPrint;


    constructor(
        private dialogRef: NbDialogRef<DristibadhakiComponent>,
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.fillForm();
    }

    fillForm() {
        if (ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
            const nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);

            this.form.patchValue({
                grandParent: [undefined],
                parent: [undefined],
                permanentDistrict: [undefined],
                permanentMunicipalities: [undefined],
                permanentWard: [undefined],
                temporaryDistrict: [undefined],
                temporaryMunicipalities: [undefined],
                temporaryWard: [undefined],
                age: [undefined],
                guarantor: [undefined],
                ministry: [undefined],
                department: [undefined],
                office: [undefined],
                date: [undefined],
                registrationNumber: [undefined],
                companyDistrict: [undefined],
                companyMunicipalities: [undefined],
                number: [undefined],
                company: [undefined],
                guarantorGrandParent: [undefined],
                guarantorParent: [undefined],
                guarantorDistrict: [undefined],
                guarantorMunicipalities: [undefined],
                guarantorWard: [undefined],
                guarantorAge: [undefined],
                name: [undefined],
                amountInNumber: [undefined],
                amountInWord: [undefined],
                creditor: [undefined],
                freight: [undefined],
                self: [undefined],
            });
        }
    }

    submit() {
    }

    buildForm() {
        this.form = this.formBuilder.group({
            grandParent: [undefined],
            parent: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipalities: [undefined],
            permanentWard: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipalities: [undefined],
            temporaryWard: [undefined],
            age: [undefined],
            guarantor: [undefined],
            ministry: [undefined],
            department: [undefined],
            office: [undefined],
            date: [undefined],
            registrationNumber: [undefined],
            companyDistrict: [undefined],
            companyMunicipalities: [undefined],
            number: [undefined],
            company: [undefined],
            guarantorGrandParent: [undefined],
            guarantorParent: [undefined],
            guarantorDistrict: [undefined],
            guarantorMunicipalities: [undefined],
            guarantorWard: [undefined],
            guarantorAge: [undefined],
            name: [undefined],
            amountInNumber: [undefined],
            amountInWord: [undefined],
            creditor: [undefined],
            freight: [undefined],
            self: [undefined],
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}

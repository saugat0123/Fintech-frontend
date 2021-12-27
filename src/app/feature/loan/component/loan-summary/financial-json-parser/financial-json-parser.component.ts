import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-financial-json-parser',
    templateUrl: './financial-json-parser.component.html',
    styleUrls: ['./financial-json-parser.component.scss']
})
export class FinancialJsonParserComponent implements OnInit {

    @Input()   financialJson;

    form: FormGroup;
    schemaIndex = 0;
    columnIndex = 0;
    constructor(
        private formBuilder: FormBuilder
    ) {
    }



    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            fiscalYear: [undefined],
            schema: [undefined],
            value: [undefined],
        });
    }

    getColumnIndex(data) {
        this.columnIndex = data;
        this.getDataValue();
    }

    getSchemaIndex(data) {
        this.schemaIndex = data;
        this.getDataValue();
    }

    getDataValue() {
        const value = this.financialJson.data[this.schemaIndex][this.columnIndex];
        this.form.patchValue({
            value: value
        });
    }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-financial-json-parser',
    templateUrl: './financial-json-parser.component.html',
    styleUrls: ['./financial-json-parser.component.scss']
})
export class FinancialJsonParserComponent implements OnInit {

    @Input() financialJson;
    @Input() title;
    @Input() summaryOnly;

    form: FormGroup;
    schemaIndex = 0;
    columnIndex = 0;
    audited = [];


    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        // this.getLastThreeFYAuditedValue();
    }

    getLastThreeFYAuditedValue() {
        this.financialJson.column.forEach((data, i) => {
            if (data.includes('Audited')) {
                this.audited.push({
                    audited: data,
                    index: i
                });
            }
        });
        this.audited = this.audited.splice(this.audited.length - 3, this.audited.length);
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

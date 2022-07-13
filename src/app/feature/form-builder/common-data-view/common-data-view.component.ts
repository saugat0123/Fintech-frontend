import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormType} from '../constants/formType';
import {DataDisplayModal} from '../model/dataDisplayModal';

@Component({
    selector: 'app-common-data-view',
    templateUrl: './common-data-view.component.html',
    styleUrls: ['./common-data-view.component.scss']
})
export class CommonDataViewComponent implements OnInit, OnChanges {

    @Input()
    config: any;

    @Input()
    data: any;
    FormType = FormType;
    displayData = [];


    constructor() {
    }

    ngOnInit() {
        this.renderData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.renderData();
    }

    public renderData() {
        this.displayData = [];
        console.log('data', this.data);
        this.config.forEach(c => {
            let model = new DataDisplayModal();
            if (c.type === this.FormType.ADDRESS) {
                this.setAddressData(model, c);
            } else {
                model = new DataDisplayModal();
                model.id = c.id;
                model.type = c.type;
                model.label = 'label';
                model.data = this.data[model.id];
                this.displayData.push(model);
            }
        });
        console.table(this.displayData);
    }


    setAddressData(model, c) {
        model.id = c.id + '_province';
        model.type = c.type;
        model.label = 'Province';
        model.data = this.data[model.id] === null ? null : this.data[model.id].name;
        this.displayData.push(model);
        model = new DataDisplayModal();
        model.id = c.id + '_district';
        model.type = c.type;
        model.label = 'District';
        model.data = this.data[model.id] === null ? null : this.data[model.id].name;
        this.displayData.push(model);
        model = new DataDisplayModal();
        model.id = c.id + '_municipality';
        model.type = c.type;
        model.label = 'Municipality';
        model.data = this.data[model.id] === null ? null : this.data[model.id].name;
        this.displayData.push(model);
    }

}

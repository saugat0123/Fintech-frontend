import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfig} from '../../admin/modal/loan-config';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'app-product-paper-checklist',
    templateUrl: './product-paper-checklist.component.html',
    styleUrls: ['./product-paper-checklist.component.scss']
})
export class ProductPaperChecklistComponent implements OnInit , AfterViewInit {

    constructor(private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef, private el: ElementRef) {
    }

    @Input() loan: LoanConfig;
    @Input() fromLoan;
    @Input() loanDataHolder: LoanDataHolder;
    @Output() checkList = new EventEmitter();
    @Input() paper;
    paperFormIndividual: FormGroup;
    paperFormInstitutional: FormGroup;
    yesNoNa = ['Yes', 'No', 'Na'];
    yesNo = ['Yes', 'No'];
    formData;
    allIds = [];
    parser: DOMParser;
    parsedData: Document;
    ngOnInit() {
            this.parser = new DOMParser();
            this.parsedData = this.parser.parseFromString(this.paper, 'text/html');
    }
    change(id) {
        console.log('asdasdasdasdid', id);
       const ids = id.split(/([0-9]+)/);
        //id appended to name (each button id is greater or lesser by 10);
        let positiveNum = Number(ids[1]);
        let negativeNum = Number(ids[1]);
        //total input field in a row
        const totalInput = ids[3];
        // current position in the row
        const  name = ids[5];
        const rowId = [];
        for (let i = 1; i < Number(totalInput); i++) {
            positiveNum += 10;
            negativeNum -= 10;
            const currentId  = `name${(positiveNum)}n${totalInput}n${name}`;
            const currentIds  = `name${(negativeNum)}n${totalInput}n${name}`;
            rowId.push(currentId);
            rowId.push(currentIds);
        }
        for (let i = 0; i < rowId.length; i++) {
           const elem = this.parsedData.getElementById(rowId[i]);
           if(elem) {
           elem.innerHTML = `<input type="radio" click = "change()"  name="hello${name}">`;
           }

        }
        this.parsedData.getElementById(id).innerHTML = `<input type="radio" click = "change()" checked = "checked"  name="hello${name}">`;
    }

    save() {
            this.checkList.emit(this.parsedData.documentElement.innerHTML);
    }

    ngAfterViewInit(): void {
        this.allIds = JSON.parse(this.loan.paperChecklist).id;
        this.changeDetectorRef.detectChanges();
        if (this.allIds.length > 0) {
                this.allIds.forEach((id, i) => {
                    console.log(id);
                    const elem = this.el.nativeElement.querySelector(`#${id}`);
                    if (elem) {
                         elem.addEventListener('change', this.change.bind(this, id));
                       }
                });
        }
    }
}


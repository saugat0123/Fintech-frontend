import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AddAdditionalDocumentComponent} from './add-additional-document/add-additional-document.component';

@Component({
    selector: 'app-additional-document',
    templateUrl: './additional-document.component.html',
    styleUrls: ['./additional-document.component.scss']
})
export class AdditionalDocumentComponent implements OnInit, OnChanges {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    addDocForm: FormGroup;

    constructor(private nbService: NbDialogService) {
    }

    ngOnInit() {
    }



    openAdd() {
        this.nbService.open(AddAdditionalDocumentComponent);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

}

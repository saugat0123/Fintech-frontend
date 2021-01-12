import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormGroup} from '@angular/forms';
import {AddAdditionalDocumentComponent} from './add-additional-document/add-additional-document.component';
import {AdditionalDocument} from '../../../../model/AdditionalDocument';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CommonService} from '../../../../../../@core/service/common.service';

@Component({
    selector: 'app-additional-document',
    templateUrl: './additional-document.component.html',
    styleUrls: ['./additional-document.component.scss']
})
export class AdditionalDocumentComponent implements OnInit, OnChanges {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    addDocForm: FormGroup;
    additionalDocument = Array<AdditionalDocument>();

    @Output()
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();


    constructor(private nbService: NbDialogService,public commonService:CommonService) {
    }

    ngOnInit() {
        this.initial();
    }

    initial() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.additionalDocument = this.cadData.additionalDocumentList;
        }
    }

    openAdd() {
        this.nbService.open(AddAdditionalDocumentComponent, {
            context: {
                cadData: this.cadData
            }
        }).onClose.subscribe((res: any) => {
            if (!ObjectUtil.isEmpty(res)) {
                this.responseCadData.emit(res);
            }

        });
    }

    editDoc(data) {
        this.nbService.open(AddAdditionalDocumentComponent, {
            context: {
                cadData: this.cadData,
                additionalDocument: data
            }
        }).onClose.subscribe((res: any) => {
            if (!ObjectUtil.isEmpty(res)) {
                this.responseCadData.emit(res);
            }

        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();
    }

}

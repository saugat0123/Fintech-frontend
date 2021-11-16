import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {DmsLoanFileComponent} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-multi-document-template',
    templateUrl: './multi-document-template.component.html',
    styleUrls: ['./multi-document-template.component.scss']
})
export class MultiDocumentUploadTemplateComponent implements OnInit {
    @Input() docName;
    @Output() docPathEmitter = new EventEmitter();
    @Input() customerInfo;
    @Input() pathValue;
    @Input() docTitle;
    @Input() docFolderName;
    @Input() heading;
    checked = false;
    pathValueData;
    documentName: string;
    index: number;
    documentPath: string;

    constructor(private customerInfoService: CustomerInfoService,
                private toast: ToastService,
                private loanService: LoanFormService,
                private modelService: NgbModal) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.pathValue)) {
            this.checked = true;
            this.pathValueData = (this.pathValue).toString().split(',');
        }
    }

    fileUpload(file) {
        const doc: File[] = file.target.files;
        const formData: FormData = new FormData();
        for (let i = 0; i < doc.length; i++) {
            if (doc[i].size > DmsLoanFileComponent.FILE_SIZE_5MB) {
                this.toast.show(new Alert(AlertType.INFO, 'Maximum File Size is 5MB'));
                return;
            }
            formData.append('file', doc[i]);
        }
        formData.append('customerName', this.customerInfo.name);
        formData.append('documentName', this.docName);
        formData.append('customerInfoId', this.customerInfo.id);
        formData.append('customerType', this.customerInfo.customerType);
        formData.append('folderName', this.docFolderName);
        formData.append('uploadedDoc', (this.pathValueData === undefined ? '' : this.pathValueData));
        this.customerInfoService.uploadMultipleDocument(formData).subscribe((res: any) => {
            this.docPathEmitter.emit(res.detail);
            this.checked = true;
            this.pathValueData = res.detail;
        }, error => this.toast.show(new Alert(AlertType.WARNING, 'Please read the note to Upload the Document')));
    }

    previewDoc(url: string) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    deleteDocument(path, index): void {
        this.loanService.deleteCustomerDocFromSystem(path).subscribe((res: any) => {
            this.pathValueData.splice(index, 1);
            this.docPathEmitter.emit(this.pathValueData);
        }, error => {
            this.toast.show(new Alert(AlertType.WARNING, 'Unable to delete document!'));
        });
        if (this.pathValueData.length < 1) {
            this.checked = false;
        }
    }

    onClose() {
        this.modelService.dismissAll();
    }

    openModel(model, path: string, index: number) {
        this.documentPath = path;
        this.index = index;
        this.modelService.open(model);
        const doc = path.split('/');
        this.documentName = doc[doc.length - 1];
    }

}

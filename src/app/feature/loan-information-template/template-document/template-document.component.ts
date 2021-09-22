import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerGeneralDocumentService} from '../../customer/service/customer-general-document.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {DmsLoanFileComponent} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';

@Component({
  selector: 'app-template-document',
  templateUrl: './template-document.component.html',
  styleUrls: ['./template-document.component.scss']
})
export class TemplateDocumentComponent implements OnInit {
  @Input() docName;
  @Output() docPathEmitter = new EventEmitter();
  @Input() customerInfo;
  @Input() pathValue;
  @Input() docTitle;
  @Input() docFolderName;
  @Input() heading;
  checked = false;
  pathValueData;

  constructor(private customerInfoService: CustomerInfoService,
              private toast: ToastService,
              private loanService: LoanFormService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.pathValue)) {
      this.checked = true;
      this.pathValueData = (this.pathValue).split(',');
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
    this.customerInfoService.upload(formData).subscribe((res: any) => {
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

  deleteDocument(index): void {
    this.loanService.deleteCustomerDocFromSystem(this.pathValueData[index]).subscribe((res: any) => {
      this.pathValueData.splice(index, 1);
      this.docPathEmitter.emit(this.pathValueData);
    }, error => {
      this.toast.show(new Alert(AlertType.WARNING, 'Unable to delete document!'));
    });
    if (this.pathValueData.length < 1) {
      this.checked = false;
    }
  }

}

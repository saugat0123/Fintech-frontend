import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerGeneralDocumentService} from '../../customer/service/customer-general-document.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {DmsLoanFileComponent} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';

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
  checked = false;

  constructor(private customerInfoService: CustomerInfoService,
              private toast: ToastService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.pathValue)) {
      this.checked = true;
    }
    console.log('checked', this.checked);
  }

  fileUpload(file) {
    const doc = file.target.files[0];
    if (doc.size > DmsLoanFileComponent.FILE_SIZE_5MB) {
      this.toast.show(new Alert(AlertType.INFO, 'Maximum File Size is 5MB'));
      return;
    }
    const formData: FormData = new FormData();
    formData.append('customerName', this.customerInfo.name);
    formData.append('documentName', this.docName);
    formData.append('customerInfoId', this.customerInfo.id);
    formData.append('customerType', this.customerInfo.customerType);
    formData.append('file', doc);
    formData.append('folderName', this.docFolderName);
    this.customerInfoService.upload(formData).subscribe((res: any) => {
      this.docPathEmitter.emit(res.detail);
      this.checked = true;
    }, error => this.toast.show(new Alert(AlertType.WARNING, error.error.message)));
  }

  previewDoc(url: string) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  deleteDocument(): void {
    delete this.pathValue;
    this.docPathEmitter.emit(this.pathValue);
    this.checked = false;
  }

}

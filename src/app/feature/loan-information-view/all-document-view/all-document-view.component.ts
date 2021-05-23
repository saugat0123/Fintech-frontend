import {Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {DmsLoanService} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {ToastService} from '../../../@core/utils';
import {DocumentService} from '../../admin/component/document/document.service';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';

@Component({
  selector: 'app-all-document-view',
  templateUrl: './all-document-view.component.html',
  styleUrls: ['./all-document-view.component.scss']
})
export class AllDocumentViewComponent implements OnInit {
  @Input() loanDataHolder;
  minOneGuarantorDoc;
  minOneInsuranceDoc;
  taggedGuarantorWithDoc = [];
  insuranceWithDoc = [];
  showCadDoc;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  affiliatedId;

  constructor(private dmsLoanService: DmsLoanService,
              private toastService: ToastService,
              private documentService: DocumentService,
  ) {
  }

  ngOnInit() {
    this.affiliatedId = LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID = AffiliateId.SRDB;
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.taggedGuarantors)) {
        this.loanDataHolder.taggedGuarantors.forEach(value => {
          if (!ObjectUtil.isEmpty(value.docPath)) {
            this.taggedGuarantorWithDoc.push(value);
            this.minOneGuarantorDoc = true;
          }
        });
      }
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
        this.loanDataHolder.insurance.forEach(value => {
          if (value.policyDocumentPath) {
            this.insuranceWithDoc.push(value);
            this.minOneInsuranceDoc = true;
          }
        });
      }
    }
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
  }

  downloadCustomerDocument(documentPath, documentName) {
    this.dmsLoanService.downloadDocument(documentPath).subscribe(
        (response: any) => {
          const downloadUrl = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = downloadUrl;
          const toArray = documentPath.split('.');
          const extension = toArray[toArray.length - 1];
          link.download = documentName + '.' + extension;
          link.click();
        },
        error => {
          console.log(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'File not Found'));
        }
    );
  }

  downloadAllDocument(path: string) {
    path = '/doc';
    this.documentService.downloadAllDoc(path, this.loanDataHolder.id).subscribe((res: any) => {
      this.previewOfferLetterDocument(res.detail, res.detail);
    }, error => this.toastService.show(new Alert(AlertType.ERROR, error.error.message)));
  }

  previewOfferLetterDocument(url: string, name: string): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
    link.download = name;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

}

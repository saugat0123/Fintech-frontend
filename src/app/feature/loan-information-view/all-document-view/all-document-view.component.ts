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
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils/lib/index.js';
import {saveAs as importedSaveAs} from 'file-saver';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {DocStatus} from '../../loan/model/docStatus';


@Component({
  selector: 'app-all-document-view',
  templateUrl: './all-document-view.component.html',
  styleUrls: ['./all-document-view.component.scss']
})
export class AllDocumentViewComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() siteVisitDocument: Array<SiteVisitDocument>;
  minOneGuarantorDoc;
  minOneInsuranceDoc;
  taggedGuarantorWithDoc = [];
  insuranceWithDoc = [];
  showCadDoc;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  affiliatedId;
  hidePreviewButton = false;
  documentName;

  constructor(private dmsLoanService: DmsLoanService,
              private toastService: ToastService,
              private documentService: DocumentService,
  ) {
  }

  ngOnInit() {
    // this.affiliatedId = LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID = AffiliateId.SRDB;
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
    this.checkDocumentStatus();
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

  // method to get all the paths which is require to zipping all files
  public getDocPath(): void {
    const docPaths = [];
    if (this.loanDataHolder.zipPath === null || this.loanDataHolder.zipPath === '') {
      const loanDocument = this.loanDataHolder.customerDocument;
      for (const doc of loanDocument) {
        docPaths.push(doc.documentPath);
      }
      const generalDocument = this.loanDataHolder.loanHolder.customerGeneralDocuments;
      for (const doc of generalDocument) {
        docPaths.push(doc.docPath);
      }
      const guarantorDocument = this.taggedGuarantorWithDoc;
      for (const doc of guarantorDocument) {
        docPaths.push(doc.docPath);
      }
      const insuranceDocument = this.insuranceWithDoc;
      for (const doc of insuranceDocument) {
        docPaths.push(doc.policyDocumentPath);
      }
      // Collateral Document
      const siteVisitDocument = this.siteVisitDocument;
      if (!ObjectUtil.isEmpty(siteVisitDocument)) {
        for (const doc of siteVisitDocument) {
          docPaths.push(doc.docPath.concat(doc.docName).concat('.jpg'));
        }
      }
    } else {
      docPaths.push(this.loanDataHolder.zipPath);
    }
    this.downloadAll(docPaths);
  }

  // method to make all files as a .zip file
  private downloadAll(documentUrls: string[]): void {
    const zip = new JSZip();
    let count = 0;
    const zipFilename = 'AllDocument.zip';
    const urls = [];
    if (documentUrls.length > 0) {
      documentUrls.map(d => {
        d = ApiConfig.URL + '/' + d;
        urls.push(d);
      });

      urls.forEach((url: string) => {
        const pathToZipFrom = new URL(url).pathname;
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            throw err; // or handle the error
          }
          zip.file(pathToZipFrom, data, {binary: true});
          count++;
          if (count === urls.length) {
            zip.generateAsync({type: 'blob'}).then(content => {
              importedSaveAs(content, zipFilename);
            });
          }
        });
      });
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Files has been downloaded!'));
    } else {
      this.toastService.show(new Alert(AlertType.ERROR, 'No file found!!!'));
    }
  }

  checkDocumentStatus() {
    if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.REJECTED) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
      this.hidePreviewButton = true;
      if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED)) {
        this.documentName = '-documents';
      } else if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
        this.documentName = '-closed-documents';
      } else {
        this.documentName = '-rejected-documents';
      }
    } else {
      this.hidePreviewButton = false;
    }
  }

}

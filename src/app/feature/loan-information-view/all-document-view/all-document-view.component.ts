import {Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {DmsLoanService} from '../../loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {ToastService} from '../../../@core/utils';
import {DocumentService} from '../../admin/component/document/document.service';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils/lib/index.js';
import {saveAs as importedSaveAs} from 'file-saver';
import {DocStatus} from '../../loan/model/docStatus';
import {
  CollateralSiteVisitService
} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';


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
  hidePreviewButton = false;
  documentName;
  fixedAssetsData = [];
  colSiteVisitDocument = [];
  fileType = '.jpg';
  customerGeneralDocument;
  ccblDocument = [];

  constructor(private dmsLoanService: DmsLoanService,
              private toastService: ToastService,
              private documentService: DocumentService,
              private collateralSiteVisitService: CollateralSiteVisitService,
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.taggedGuarantors)) {
        this.loanDataHolder.taggedGuarantors.forEach(value => {
          if (!ObjectUtil.isEmpty(value.docPath)) {
            this.taggedGuarantorWithDoc.push(value);
            this.minOneGuarantorDoc = true;
          }
        });
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
        this.loanDataHolder.insurance.forEach(value => {
          if (value.policyDocumentPath) {
            this.insuranceWithDoc.push(value);
            this.minOneInsuranceDoc = true;
          }
        });
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.customerGeneralDocuments)) {
        this.customerGeneralDocument = [];
        const gDocSet = new Set();
        const gDoc = this.loanDataHolder.loanHolder.customerGeneralDocuments;
        gDoc.forEach(g => {
          gDocSet.add(g.document.id);
        });
        gDocSet.forEach(gd => {
          const gDocument = gDoc.filter(d => d.document.id === gd);
          this.customerGeneralDocument.push(gDocument);
        });
      }

      if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
        const securityId = this.loanDataHolder.security.id;
        const securityData = JSON.parse(this.loanDataHolder.security.data);
        if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
          const doc = this.loanDataHolder.collateralSiteVisits;
          if (doc.length > 0) {
            doc.forEach(d => {
              if (!ObjectUtil.isEmpty(d.siteVisitDocuments)) {
                d.siteVisitDocuments.forEach(sv => {
                  this.colSiteVisitDocument.push(sv);
                });
              }
            });
          }
        } else {
          if (securityData['selectedArray'] !== undefined) {
            // land security
            securityData['selectedArray'].filter(f => {
              if (f.indexOf('LandSecurity') !== -1) {
                securityData['initialForm']['landDetails'].forEach((ld, index) => {
                  this.getFixedAssetsCollateral('Land Security ' + (index + 1),
                      securityId, ld.uuid);
                });
              }
            });
            // apartment security
            securityData['selectedArray'].filter(f => {
              if (f.indexOf('ApartmentSecurity') !== -1) {
                securityData['initialForm']['buildingDetails'].forEach((appart, ind) => {
                  this.getFixedAssetsCollateral('Apartment Security ' + (ind + 1),
                      securityId, appart.uuid);
                });
              }
            });
            // land and building security
            securityData['selectedArray'].filter(f => {
              if (f.indexOf('Land and Building Security') !== -1) {
                securityData['initialForm']['landBuilding'].forEach((ld, index) => {
                  this.getFixedAssetsCollateral('Land And Building Security ' + (index + 1),
                      securityId, ld.uuid);
                });
              }
            });
          }
        }
      }
    }
    this.getCCBLDocument();
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
      for (const g of guarantorDocument) {
        for (const doc of g.docPath.split(',')) {
          docPaths.push(doc);
        }
      }
      const insuranceDocument = this.insuranceWithDoc;
      for (const i of insuranceDocument) {
        for (const doc of i.policyDocumentPath.split(',')) {
          docPaths.push(doc);
        }
      }
      // Collateral SiteVisit Document
      const siteVisitDocument = this.colSiteVisitDocument;
      if (!ObjectUtil.isEmpty(siteVisitDocument)) {
        for (const doc of siteVisitDocument) {
          docPaths.push(doc.docPath);
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
        this.documentName = '-approved-documents';
      } else if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
        this.documentName = '-closed-documents';
      } else {
        this.documentName = '-rejected-documents';
      }
    } else {
      this.hidePreviewButton = false;
    }
  }

  getFixedAssetsCollateral(securityName: string, securityId: number, uuid: string) {
    this.collateralSiteVisitService.getCollateralByUUID(securityName, securityId, uuid)
        .subscribe((response: any) => {
          if (response.detail.length > 0) {
            response.detail.forEach(rd => {
              this.fixedAssetsData.push(rd);
            });
          }
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, `Unable to load site visit info of ${securityName}`));
        }, () => {
          const doc = new Set();
          this.colSiteVisitDocument = [];
          this.fixedAssetsData.forEach(fd => {
            if (fd.siteVisitDocuments.length > 0) {
              doc.add(fd.siteVisitDocuments);
            }
          });
          if (doc.size > 0) {
            doc.forEach(d => {
              d.forEach(cd => {
                this.colSiteVisitDocument.push(cd);
              });
            });
          }
        });

  }

  getCCBLDocument() {
    const doc = {
      documentName: null,
      docPath: null
    };
    const docSet = new Set();
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.crgCcbl)) {
        const crgDocument = JSON.parse(this.loanDataHolder.loanHolder.crgCcbl);
        if (!ObjectUtil.isEmpty(crgDocument.file)) {
          const splitDocument = crgDocument.file.split('/');
          const docFullName = splitDocument[splitDocument.length - 1];
          const docName = docFullName.split('.');
          const documentName = docName[0];
          doc.documentName = documentName;
          doc.docPath = crgDocument.file;
          docSet.add(doc);
        }
      }

      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financialCcbl)) {
        const financialDocument = JSON.parse(this.loanDataHolder.loanHolder.financialCcbl);
        if (!ObjectUtil.isEmpty(financialDocument.file)) {
          const splitDocument = financialDocument.file.split('/');
          const docFullName = splitDocument[splitDocument.length - 1];
          const docName = docFullName.split('.');
          const documentName = docName[0];
          doc.documentName = documentName;
          doc.docPath = financialDocument.file;
          docSet.add(doc);
        }
      }

      if (docSet.size > 0) {
        docSet.forEach(d => {
          this.ccblDocument.push(d);
        });
        console.log('ccblDocument', this.ccblDocument);
      }
    }
  }

}

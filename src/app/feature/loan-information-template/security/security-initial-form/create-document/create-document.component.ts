import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../@core/utils';
import {SiteVisitDocument} from '../fix-asset-collateral/site-visit-document';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CollateralSiteVisit} from '../fix-asset-collateral/CollateralSiteVisit';
import {DmsLoanFileComponent} from '../../../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit {
  spinner = false;
  @Input() collateralSiteVisitDoc: CollateralSiteVisit;
  @Input() editId;
  @Input() siteVisitDocument: Array<SiteVisitDocument>;
  docName;
  isPrintable;
  file;
  isEdit = false;
  docNameExist;
  docNameChange = false;
  docUpload = false;
  jpegType = 'image/jpeg';

  constructor(private dialogRef: NbDialogRef<CreateDocumentComponent>,
              private toastService: ToastService ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.editId)) {
      this.docUpload = true;
      const siteVisitDoc = this.siteVisitDocument[this.editId];
      this.docName = siteVisitDoc.docName;
      this.isPrintable = siteVisitDoc.isPrintable;
    }
  }

  public create(): void {
    const siteVisitDoc = new SiteVisitDocument;
    siteVisitDoc.docName = this.docName;
    siteVisitDoc.isPrintable = this.isPrintable;
    siteVisitDoc.multipartFile = this.file;
    if (!ObjectUtil.isEmpty(this.file) && this.file.size > DmsLoanFileComponent.FILE_SIZE_5MB) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please upload file less than 5MB'));
      return;
    }
    // if (!ObjectUtil.isEmpty(this.file) && this.file.type !== this.jpegType) {
    //   this.toastService.show(new Alert(AlertType.ERROR, 'File format not supported please upload jpg'));
    //   return;
    // }
    if (!ObjectUtil.isEmpty(this.docName) && ObjectUtil.isEmpty(this.editId)) {
      try {
        this.siteVisitDocument.forEach((value) => {
          if (value.docName === this.docName) {
            this.toastService.show(new Alert(AlertType.ERROR, `${value.docName} is already exist`));
            throw this.docNameExist;
          }
        });
      } catch (ex) {
        return;
      }
    }
    if (!ObjectUtil.isEmpty(this.editId)) {
      const item = this.siteVisitDocument[this.editId];
      siteVisitDoc.id = item.id;
      siteVisitDoc.docName = this.docName;
      siteVisitDoc.isPrintable = this.isPrintable;
      siteVisitDoc.multipartFile = this.file;
      this.siteVisitDocument.splice(this.editId, 1, siteVisitDoc);
      try {
        const doc = this.siteVisitDocument.filter(d => d.docName === this.docName);
        if (doc.length > 1) {
          this.toastService.show(new Alert(AlertType.ERROR, `${this.docName} is already exist`));
          throw this.docNameExist;
        }
      } catch (ex) {
        return;
      }
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Document updated successfully'));
    } else {
      this.siteVisitDocument.push(siteVisitDoc);
    }
    this.dialogRef.close();
  }

  uploadDoc(event) {
    this.file = event.target.files[0];
    this.docUpload = false;
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  checkValue(event) {
    if (event) {
      if (ObjectUtil.isEmpty(this.docName)) {
        this.docNameChange = true;
      } else {
        this.docNameChange = false;
      }
    }
  }
}

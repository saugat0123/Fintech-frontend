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
  docNameExist = false;
  jpegType = 'image/jpeg';

  constructor(private dialogRef: NbDialogRef<CreateDocumentComponent>,
              private toastService: ToastService ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.editId)) {
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
    console.log(siteVisitDoc);
    if (!ObjectUtil.isEmpty(this.file) && this.file.size > DmsLoanFileComponent.FILE_SIZE_5MB) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please upload file less than 5MB'));
      return;
    }
    if (!ObjectUtil.isEmpty(this.file) && this.file.type !== this.jpegType) {
      this.toastService.show(new Alert(AlertType.ERROR, 'File format not supported please upload jpg'));
      return;
    }
    if (!ObjectUtil.isEmpty(this.docName) && ObjectUtil.isEmpty(this.editId)) {
      this.siteVisitDocument.forEach((value) => {
        if (value.docName === this.docName) {
          this.toastService.show(new Alert(AlertType.ERROR, `${value.docName} is already exist`));
          this.docNameExist = true;
        } else {
          this.docNameExist = false;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.editId)) {
      const docItem = this.siteVisitDocument[this.editId];
      if (this.docName === docItem.docName) {
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Document updated'));
      } else {
        this.siteVisitDocument.forEach((value) => {
          if (value.docName === this.docName) {
            this.toastService.show(new Alert(AlertType.ERROR, `${value.docName} is already exist`));
            this.docNameExist = true;
          } else {
            this.docNameExist = false;
          }
        });
      }
    }
    if (this.docNameExist) {
      return;
    }
    if (!ObjectUtil.isEmpty(this.editId)) {
      const item = this.siteVisitDocument[this.editId];
      siteVisitDoc.id = item.id;
      siteVisitDoc.docName = this.docName;
      siteVisitDoc.isPrintable = this.isPrintable;
      siteVisitDoc.multipartFile = this.file;
      this.siteVisitDocument.splice(this.editId, 1, siteVisitDoc);
    } else {
      this.siteVisitDocument.push(siteVisitDoc);
    }
    this.dialogRef.close();
  }

  uploadDoc(event) {
    this.file = event.target.files[0];
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}

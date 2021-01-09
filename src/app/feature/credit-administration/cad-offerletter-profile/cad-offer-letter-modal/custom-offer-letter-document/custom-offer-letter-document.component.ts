import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {OfferDocType} from '../../../model/OfferDocType';

@Component({
  selector: 'app-custom-offer-letter-document',
  templateUrl: './custom-offer-letter-document.component.html',
  styleUrls: ['./custom-offer-letter-document.component.scss']
})
export class CustomOfferLetterDocumentComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  docName;

  currentDocument: OfferDocument;

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  @Input() editId;

  isEdit = false;

  constructor(private service: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private dialogRef: NbDialogRef<CustomOfferLetterDocumentComponent>) {
  }

  get formDetail() {
    return this.form.controls;
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.editId)) {
      this.isEdit = true;
      this.currentDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.id === Number(this.editId))[0];
      this.docName = this.currentDocument.docName;
    }
  }

  save() {
    const d = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString() === this.docName)[0];
    if (!ObjectUtil.isEmpty(this.offerLetterConst.keysEnum(this.docName.toUpperCase()))) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Provided Name is not available !!'));
      return;
    }
    if (!ObjectUtil.isEmpty(d) && !this.isEdit) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Document Already Exist with name ' + this.docName.toUpperCase()));
      return;
    } else {
      if (this.isEdit) {
        this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
          if (offerLetterPath.id === this.editId) {
            offerLetterPath.docName = this.docName;
          }
        });
      } else {
        const offerDocument = new OfferDocument();
        offerDocument.docName = this.docName;
        offerDocument.offerDocType = OfferDocType.CUSTOM;
        this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      }
      this.service.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Added Offer Letter!!!'));
        this.spinner = false;
        this.dialogRef.close();
        this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Fail to Add Offer Letter!!!'));
        this.spinner = false;
        this.dialogRef.close();
        this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
      });
    }
  }

  submit(): void {
    this.spinner = true;
    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.service.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.onClose();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.onClose();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }

  onClose() {
    this.dialogRef.close();
  }
}

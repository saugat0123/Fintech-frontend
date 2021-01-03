import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterModalComponent} from './cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-cad-offerletter-profile',
  templateUrl: './cad-offerletter-profile.component.html',
  styleUrls: ['./cad-offerletter-profile.component.scss']
})
export class CadOfferLetterProfileComponent implements OnInit {

/*  todo get data from input and remove fetch here
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;*/

  constructor(
      private activatedRoute: ActivatedRoute,
      private service: CreditAdministrationService,
      private nbDialogService: NbDialogService ,
      private modelService: NgbModal,
      private toastrService: ToastService,
  ) {
  }

  spinner = false;
  offerLetterId;
  loanHolderId;
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  customerInfoData: CustomerInfoData;
  offerLetterTypes = MegaOfferLetterConst.enumObject();

  // todo move document upload to different to component
  documentName;
  documentId;
  docType = null;
  uploadFile;
  index;

  static loadData(other: CadOfferLetterProfileComponent) {
    other.spinner = true;
    other.service.detail(other.offerLetterId).subscribe((res: any) => {
      other.cadOfferLetterApprovedDoc = res.detail;
      other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
      console.log(res.detail);
      other.spinner = false;
    }, error => {
      console.log(error);
      other.spinner = false;
    });
  }

  ngOnInit() {
    console.log(this.offerLetterTypes);
    this.offerLetterId = Number(this.activatedRoute.snapshot.queryParamMap.get('offerLetterId'));
    this.loanHolderId = Number(this.activatedRoute.snapshot.queryParamMap.get('loanHolderId'));
    CadOfferLetterProfileComponent.loadData(this);
  }

  openOfferLetterDocumentModal(offerLetterType) {
    if (ObjectUtil.isEmpty(offerLetterType)) {
      this.toastrService.show(new Alert(AlertType.WARNING , 'Please Select Offer letter type'));
      return;
    }
    const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
    this.nbDialogService.open(CadOfferLetterModalComponent, {context: {offerLetterType, cadOfferLetterApprovedDoc}
        }).onClose.subscribe(() => CadOfferLetterProfileComponent.loadData(this));
  }

  openModel(model, documentName: string, documentId, index: number) {
    this.documentName = documentName;
    this.documentId = documentId;
    this.index = index;
    this.modelService.open(model);
  }

  // todo move document upload to seperate to component
  submitOfferLetter() {
    const formData: FormData = new FormData();

    formData.append('file', this.uploadFile);
    formData.append('customerApprovedDocId', this.cadOfferLetterApprovedDoc.id.toString());
    formData.append('offerLetterId', this.offerLetterId.toString());
    formData.append('type', this.docType.toString());
    if (this.customerInfoData.id === undefined) {
      return this.toastrService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
    }
    this.service.uploadOfferFile(formData).subscribe((response: any) => {
      this.toastrService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
     this.modelService.dismissAll();
     CadOfferLetterProfileComponent.loadData(this);
    }, error => {
      this.toastrService.show(new Alert(AlertType.ERROR, error.error.message));
      console.error(error);
    });

  }


  uploadOfferLetter(event) {
    this.uploadFile = event.target.files[0];
  }

  previewClick(file) {
    let fileName = this.uploadFile;
    if (file !== null) {
      fileName = ApiConfig.URL + '/' + file;

      const link = document.createElement('a');
      link.href = fileName;
      link.target = '_blank';
      link.click();
    } else {
      const downloadUrl = window.URL.createObjectURL(fileName);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.click();
    }
  }

}

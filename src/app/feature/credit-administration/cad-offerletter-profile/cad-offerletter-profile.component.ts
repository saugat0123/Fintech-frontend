import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
import {RouterUtilsService} from '../utils/router-utils.service';
import {RouteConst} from '../model/RouteConst';

@Component({
  selector: 'app-cad-offerletter-profile',
  templateUrl: './cad-offerletter-profile.component.html',
  styleUrls: ['./cad-offerletter-profile.component.scss']
})
export class CadOfferLetterProfileComponent implements OnInit {

  /*todo get data from input and remove fetch here*/
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  constructor(
      private activatedRoute: ActivatedRoute,
      private service: CreditAdministrationService,
      private nbDialogService: NbDialogService ,
      private modelService: NgbModal,
      private toastrService: ToastService,
      private router: Router,
      private routerUtilsService: RouterUtilsService
  ) {
  }

  spinner = false;
  offerLetterId;
  loanHolderId;
  customerInfoData: CustomerInfoData;
  offerLetterTypes = MegaOfferLetterConst.enumObject();

  // todo move document upload to different to component
  documentName;
  documentId;
  docType = null;
  uploadFile;
  index;

  ngOnInit() {
    this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
  }

  openOfferLetterDocumentModal(offerLetterType) {
    if (ObjectUtil.isEmpty(offerLetterType)) {
      this.toastrService.show(new Alert(AlertType.WARNING , 'Please Select Offer letter type'));
      return;
    }
    const cadOfferLetterApprovedDoc = this.cadOfferLetterApprovedDoc;
    this.nbDialogService.open(CadOfferLetterModalComponent, {context: {offerLetterType, cadOfferLetterApprovedDoc}
        });
  }

  openModel(model, documentName: string, documentId, index: number) {
    this.documentName = documentName;
    this.documentId = documentId;
    this.modelService.open(model);
  }

  // todo move document upload to seperate to component
  submitOfferLetter() {
    this.spinner = true;
    const formData: FormData = new FormData();

    formData.append('file', this.uploadFile);
    formData.append('customerApprovedDocId', this.cadOfferLetterApprovedDoc.id.toString());
    formData.append('offerLetterId', this.documentId.toString());
    formData.append('type', this.docType.toString());
    if (this.customerInfoData.id === undefined) {
      return this.toastrService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
    }
    this.service.uploadOfferFile(formData).subscribe((response: any) => {
      this.toastrService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
     this.modelService.dismissAll();
     this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../service/credit-administration.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {MegaOfferLetterConst} from '../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterModalComponent} from './cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
  selector: 'app-cad-offerletter-profile',
  templateUrl: './cad-offerletter-profile.component.html',
  styleUrls: ['./cad-offerletter-profile.component.scss']
})
export class CadOfferLetterProfileComponent implements OnInit {


  constructor(
      private activatedRoute: ActivatedRoute,
      private service: CreditAdministrationService,
      private nbDialogService: NbDialogService ,
      private toastrService: ToastService,
  ) {
  }

  spinner = false;
  offerLetterId;
  loanHolderId;
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  customerInfoData: CustomerInfoData;
  offerLetterTypes = MegaOfferLetterConst.enumObject();

  static loadData(other: CadOfferLetterProfileComponent) {
    /*other.spinner = true;*/
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

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {CommonService} from '../../../../@core/service/common.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-cad',
  templateUrl: './preview-cad.component.html',
  styleUrls: ['./preview-cad.component.scss']
})
export class PreviewCadComponent implements OnInit {

  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  customerInfoData: CustomerInfoData;
  @Input()
  cadDocumentId;
  spinner = false;
  currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
  toggleArray: { toggled: boolean }[] = [];
  checkListLiteVersion = LocalStorageUtil.getStorage().productUtil.CHECK_LIST_LITE_VERSION;

  constructor(private activatedRoute: ActivatedRoute,
              private service: CreditAdministrationService,
              public commonService: CommonService,
              public  modalService: NgbActiveModal
  ) {
  }

  static loadData(other: PreviewCadComponent) {
    other.spinner = true;
    other.service.detail(other.cadDocumentId).subscribe((res: any) => {
      other.cadOfferLetterApprovedDoc = res.detail;
      other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
      other.spinner = false;
      other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
      other.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => other.toggleArray.push({toggled: false}));

    }, error => {
      console.log(error);
      other.spinner = false;
    });
  }

  ngOnInit() {
    PreviewCadComponent.loadData(this);


  }



}

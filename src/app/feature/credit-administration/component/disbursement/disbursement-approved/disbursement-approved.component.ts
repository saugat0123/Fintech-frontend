import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {NbDialogService} from '@nebular/theme';
import * as CryptoJS from 'crypto-js';
import {AdditionalExposureComponent} from '../additional-exposure/additional-exposure.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ToastService} from '../../../../../@core/utils';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-disbursement-approved',
  templateUrl: './disbursement-approved.component.html',
  styleUrls: ['./disbursement-approved.component.scss']
})
export class DisbursementApprovedComponent implements OnInit {

  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'DISBURSEMENT_APPROVED'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  isMaker: boolean = LocalStorageUtil.getStorage().roleType === 'MAKER';
  toggleArray: { toggled: boolean }[] = [];
  encryptUrlArray: { url: string }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];
  asc = false;
  selectedCadData: any;
  constructor(private service: CreditAdministrationService,
              private router: Router,
              private spinnerService: NgxSpinnerService,
              private nbModel: NgbModal,
              private nbDialogService: NbDialogService,
              public routeService: RouterUtilsService,
              private cadService: CreditAdministrationService,
              private toastService: ToastService,
              private routerService: RouterUtilsService,
              private modalService:  NgbModal) {
  }

  static loadData(other: DisbursementApprovedComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      other.loanList.forEach((l) => other.encryptUrlArray.push({url: other.encryptUrl(l.id)}));
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
      console.log(other.loanList);
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.spinner = false;

    }, error => {
      other.spinner = false;
      console.log(error);
    });
  }

  ngOnInit() {
    DisbursementApprovedComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    DisbursementApprovedComponent.loadData(this);
  }

  loadProfile(cadDocumentId) {
    this.router.navigate(['/home/credit/offer-letter-profile'],
        {
          queryParams: {
            cadDocumentId: cadDocumentId,
          }
        });
  }

  addExposure(data) {
    const modelRef = this.nbModel.open(AdditionalExposureComponent, {size: 'xl'});
    modelRef.componentInstance.cadData = data;
    modelRef.componentInstance.isHistory = true;
    modelRef.result.then(() => {
      console.log('When exposure closes');
    }, () => {
      DisbursementApprovedComponent.loadData(this);
    });
  }

  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'DISBURSEMENT_APPROVED'});
    DisbursementApprovedComponent.loadData(this);
  }


  loadSummary(model) {
    this.router.navigate(['/home/credit/cad-summary/', this.encryptUrl(model.id)],
        {state: {data: model}});

  }

  encryptUrl(id) {
    const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
    return i;
  }

  sortFilter(sortBy, dir) {
    this.searchObj = Object.assign(this.searchObj, {docStatus: 'DISBURSEMENT_APPROVED', sortBy: sortBy, sortOrder: dir});
    DisbursementApprovedComponent.loadData(this);
  }
  reDisburse(data: CustomerApprovedLoanCadDocumentation) {
    const cad = {
      toRole: data.cadCurrentStage.toRole,
      toUser: data.cadCurrentStage.toUser,
      cadId: data.id,
      docAction: 'RE_INITIATE',
      comment: 'Re Disbursement',
      documentStatus: CadDocStatus.OFFER_PENDING,
      isBackwardForMaker: true,
      discrepancy: false,
      partialDiscrepancy: false,
    };
    this.spinnerService.show();
    this.cadService.saveAction(cad).subscribe((response: any) => {
      this.spinnerService.hide();
      this.close();
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Moved File To Offer Pending'));
      this.routerService.routeOnConditionProfileOrSummary(data.id, data);
      this.spinner = false;
    }, error => {
      this.spinnerService.hide();
      this.close();
      this.toastService.show(new Alert(AlertType.ERROR, 'Opps!!! Something Went Wrong'));
      this.spinner = false;
    });
  }
  close() {
    this.modalService.dismissAll();
  }
  openModal(modal, model) {
    this.selectedCadData = model;
    this.modalService.open(modal, {size: 'xl', backdrop: true});
  }
}

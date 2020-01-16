import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {User} from '../../../admin/modal/user';
import {Security} from '../../../admin/modal/security';
import {LoanDataHolder} from '../../model/loanData';
import {UserService} from '../../../../@core/service/user.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {ActionModel} from '../../model/action';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {ApprovalLimitService} from '../../../admin/component/approvallimit/approval-limit.service';
import {LoanStage} from '../../model/loanStage';
import {environment} from '../../../../../environments/environment';
import {DateService} from '../../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReadmoreModelComponent} from '../readmore-model/readmore-model.component';
import {LoanType} from '../../model/loanType';
import {BusinessType} from '../../../admin/modal/businessType';
import {Financial} from '../../model/financial';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DocAction} from '../../model/docAction';
import {DocumentService} from '../../../admin/component/document/document.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit, OnDestroy {

  client: String;

  docMsg;
  rootDocLength;
  dmsLoanFile: DmsLoanFile = new DmsLoanFile();
  loanConfig: LoanConfig = new LoanConfig();
  loan: string;
  index = 0;
  currentIndex: number;
  user: User = new User();
  securities: any = [];
  Security: typeof Security = Security;
  documents: [] = [];
  documentUrls = [];
  documentUrl: string;
  documentNames = [];
  documentName: string;
  document: string;
  documentNamesSplit: string[] = [];
  id: number;
  customerInfo: any;
  loanDataHolder: LoanDataHolder = new LoanDataHolder();
  loanType = LoanType;
  allId;
  customerId;
  loanConfigId;
  actionsList: ActionModel = new ActionModel();
  catalogueStatus = false;
  RootUrl = ApiConfig.URL;
  signatureList = [];
  previousList: Array<LoanStage> = new Array<LoanStage>();
  currentDocAction = '';
  nepaliDate;
  loanCategory;
  @ViewChild('print', { static: false }) print;
  businessType = BusinessType;
  financialData: Financial = new Financial();
  shareSecurityData: ShareSecurity = new ShareSecurity();
  financialSummary = false;
  siteVisitSummary = false;
  shareSecuritySummary = false;
  navigationSubscription;
  securitySummary = false;
  securityData: Object;
  siteVisitData: Object;
  offerLetterDocuments: {
    name: string,
    url: string
  }[] = [];
  registeredOfferLetters: Array<String> = [];
  sortedList: Array<LoanStage>;
  constructor(
      private userService: UserService,
      private loanFormService: LoanFormService,
      private loanActionService: LoanActionService,
      private dmsLoanService: DmsLoanService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private loanConfigService: LoanConfigService,
      private approvalLimitService: ApprovalLimitService,
      private dateService: DateService,
      private modalService: NgbModal,
      private documentService: DocumentService
  ) {
    this.client = environment.client;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loadSummary();
      }
    });
  }

  ngOnInit() {
    this.loadSummary();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  loadSummary() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanConfigId: null,
            customerId: null,
            catalogue: null
          };
          this.allId = paramsValue;
          this.customerId = this.allId.customerId;
          this.loanConfigId = this.allId.loanConfigId;
          if (this.allId.catalogue) {
            this.catalogueStatus = true;
          }
        });
    this.id = this.activatedRoute.snapshot.params['id'];
    this.loanConfigService.detail(this.loanConfigId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
        }
    );
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
          this.actionsList.roleTypeMaker = this.user.role.roleType === 'MAKER';
        }
    );
    this.getLoanDataHolder();
  }

  getLoanDataHolder() {
    this.loanFormService.detail(this.customerId).subscribe(
        (response: any) => {

          this.loanDataHolder = response.detail;

          // Setting financial data---
          if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
            this.financialData = this.loanDataHolder.financial;
            this.financialSummary = true;
          }

          // Setting Security data--
          if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
            this.securityData = JSON.parse(this.loanDataHolder.security.data);
            this.securitySummary = true;
          }
          // Setting SiteVisit data--
          if (!ObjectUtil.isEmpty(this.loanDataHolder.siteVisit)) {
            this.siteVisitData = JSON.parse(this.loanDataHolder.siteVisit.data);
            this.siteVisitSummary = true;
          }

          // setting share-secuirty data--
          if (!ObjectUtil.isEmpty(this.loanDataHolder.shareSecurity)) {
            this.shareSecuritySummary = true;
            this.shareSecurityData = this.loanDataHolder.shareSecurity;
          }
          this.loanCategory = this.loanDataHolder.loanCategory;
          this.currentIndex = this.loanDataHolder.previousList.length;
          this.signatureList = this.loanDataHolder.distinctPreviousList;
          this.sortedList = new Array<LoanStage>();
          this.sortedList.push(...this.loanDataHolder.previousList, this.loanDataHolder.currentStage);
          let lastBackwardIndex = 0;
          this.sortedList.forEach((data, index) => {
            if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)) {
              lastBackwardIndex = index;
            }
          });
          if (lastBackwardIndex !== 0) {
            this.sortedList.splice(0, lastBackwardIndex);
            if (this.sortedList.length === 1) {
              this.sortedList.splice(0, 1);
            }
          }
          const toUserIds = new Set<Number>();
          this.sortedList.forEach(loanStage => toUserIds.add(loanStage.toUser.id));
          this.sortedList.filter(loanStage => toUserIds.has(loanStage.toUser.id));

          if (this.sortedList.length !== 0) {
            this.sortedList.splice(0, 1);
          }
          this.previousList = this.loanDataHolder.previousList;
          this.actionsList.approved = true;
          this.actionsList.sendForward = true;
          this.actionsList.edit = true;
          this.actionsList.sendBackward = true;
          this.actionsList.rejected = true;
          this.actionsList.closed = true;
          this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
          this.actionsList.offerLetter = this.loanDataHolder.documentStatus.toString() === 'APPROVED';
          if (this.loanDataHolder.createdBy.toString() === LocalStorageUtil.getStorage().userId) {
            this.actionsList.sendBackward = false;
            this.actionsList.edit = true;
            this.actionsList.approved = false;
            this.actionsList.closed = false;
          } else {
            this.actionsList.edit = false;
          }

          if (this.loanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
            this.actionsList.approved = false;
          } else {
            this.actionsList.closed = false;
          }

          this.loanActionService.getSendForwardList().subscribe((res: any) => {
            const forward = res.detail;
            if (forward.length === 0) {
              this.actionsList.sendForward = false;
            }
          });
          if (this.loanDataHolder.currentStage.docAction.toString() === 'APPROVED' ||
              this.loanDataHolder.currentStage.docAction.toString() === 'REJECT' ||
              this.loanDataHolder.currentStage.docAction.toString() === 'CLOSED') {
            this.actionsList.approved = false;
            this.actionsList.sendForward = false;
            this.actionsList.edit = false;
            this.actionsList.sendBackward = false;
            this.actionsList.rejected = false;
            this.actionsList.closed = false;
          }
          // commented code is for approval limit
            // tslint:disable-next-line:max-line-length
          this.approvalLimitService.getLimitByRoleAndLoan(this.loanDataHolder.loan.id, this.loanDataHolder.loanCategory).subscribe((res: any) => {
              if (res.detail === undefined) {
                  this.actionsList.approved = false;
              } else {
                  if (this.loanDataHolder.proposal !== null
                      && this.loanDataHolder.proposal.proposedLimit > res.detail.amount) {
                      this.actionsList.approved = false;
                  }
              }
          });
          this.id = this.loanDataHolder.id;
          this.dmsLoanFile = this.loanDataHolder.dmsLoanFile;
          if (this.dmsLoanFile !== undefined && this.dmsLoanFile !== null) {
            this.securities = this.dmsLoanFile.securities;
            this.documents = JSON.parse(this.dmsLoanFile.documentPath);
            if (this.documents !== null) {
              this.documentNames = [];
              this.documentUrls = [];
              for (this.document of this.documents) {
                this.documentNamesSplit = this.document.split(':');
                if (!this.documentNames.includes(this.documentNamesSplit[0])) {
                  this.documentNames.push(this.documentNamesSplit[0]);
                  this.documentUrls.push(this.documentNamesSplit[1]);
                }
              }

              if (LoanType[this.loanDataHolder.loanType] === LoanType.NEW_LOAN) {
                this.rootDocLength = this.loanDataHolder.loan.initial.length;
              }
              if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
                this.rootDocLength = this.loanDataHolder.loan.renew.length;
              }

              if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
                this.rootDocLength = this.loanDataHolder.loan.closure.length;
              }

              const filledDocLength = this.documentNames.length;
              this.docMsg = filledDocLength + ' out of ' + this.rootDocLength + ' document has been uploaded';
            }
          }
          this.dateService.getDateInNepali(this.loanDataHolder.createdAt.toString()).subscribe((nepDate: any) => {
            this.nepaliDate = nepDate.detail;
          });

          // Offer Letter Documents
          if (this.loanDataHolder.customerOfferLetter && this.loanDataHolder.customerOfferLetter.customerOfferLetterPath) {
            this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
              if (offerLetterPath.path && !this.registeredOfferLetters.includes(offerLetterPath.offerLetter.name)) {
                this.registeredOfferLetters.push(offerLetterPath.offerLetter.name);
                this.offerLetterDocuments.push({
                  name: offerLetterPath.offerLetter.name,
                  url: offerLetterPath.path
                });
              }
            });
          }
        }
    );
  }

  download(i) {
    this.documentUrl = this.documentUrls[i];
    this.documentName = this.documentNames[i];
    this.dmsLoanService.downloadDocument(this.documentUrl).subscribe(
        (response: any) => {
          const downloadUrl = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = downloadUrl;
          const toArray = this.documentUrl.split('.');
          const extension = toArray[toArray.length - 1];
          link.download = this.documentName + '.' + extension;
          link.click();
        },
        error1 => {
          console.log(error1);
          console.log('Error downloading the file');
        }
    );
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
          console.log('Error downloading the file!');
        }
    );
  }

    downloadAllDocument(path: string) {

        this.documentService.downloadAllDoc(path).subscribe((res: any) => {
            this.previewOfferLetterDocument(res.detail, res.detail);
        });


    }

    loanHandler(index: number, length: number) {
    if (index === 0) {
      return 'INITIATED BY:';
    } else if (index === length - 1) {
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        return 'APPROVED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
        return 'REJECTED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'CLOSED') {
        return 'CLOSED BY:';
      } else {
        return 'SUPPORTED BY:';
      }
    } else {
      return 'SUPPORTED BY:';
    }
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
    modalRef.componentInstance.comments = comments;
  }

  renewedOrCloseFrom(id) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: this.loanConfigId,
        customerId: id
      }
    });

    this.customerId = id;
    this.getLoanDataHolder();

  }

  previewOfferLetterDocument(url: string, name: string): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}`;
    link.download = name;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }
}


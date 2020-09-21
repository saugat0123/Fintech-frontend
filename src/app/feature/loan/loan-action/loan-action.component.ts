import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ActionModel} from '../model/action';
import {DocStatus} from '../model/docStatus';
import {RoleType} from '../../admin/modal/roleType';
import {DocAction} from '../model/docAction';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CustomerLoanFlag} from '../../../@core/model/customer-loan-flag';
import {NbDialogService} from '@nebular/theme';
import {LoanActionModalComponent} from './loan-action-modal/loan-action-modal.component';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {LoanActionCombinedModalComponent} from './loan-action-combined-modal/loan-action-combined-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-loan-action',
  templateUrl: './loan-action.component.html',
  styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit, OnChanges {

  @Input() loanConfigId: number;
  @Input() id: number;
  @Input() loanCategory: string;
  @Input() catalogueStatus = false;
  @Input() loanFlags: CustomerLoanFlag[];
  @Input() actionsList: ActionModel;
  @Input() combinedLoanId: number;
  public isMaker = false;
  public committeeRole = false;

  constructor(
      private alertService: AlertService,
      private toastService: ToastService,
      private nbDialogService: NbDialogService,
      private router: Router,
      private loanFormService: LoanFormService,
  ) {
  }

  ngOnInit() {
    const roleName: string = LocalStorageUtil.getStorage().roleName;
    const roleType: string = LocalStorageUtil.getStorage().roleType;
    if (roleName !== 'admin') {
      this.isMaker = roleType === RoleType.MAKER;
    }
    if (roleType === RoleType.MAKER) {
      this.isMaker = true;
    }
    this.committeeRole = roleType === RoleType.COMMITTEE;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loanFlags.currentValue) {
      this.loanFlags = this.loanFlags.filter((l) => (l.customerLoanId === this.id || ObjectUtil.isEmpty(l.customerLoanId)));
    }
  }

  public loanAction(action: 'forward' | 'backward' | 'backwardCommittee' | 'approve' | 'reject' | 'close'): void {
    let context;
    switch (action) {
      case 'backward':
        context = {
          popUpTitle: 'Send Backward',
          isForward: false,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: DocAction.value(DocAction.BACKWARD),
          documentStatus: DocStatus.PENDING
        };
        break;
      case 'backwardCommittee':
        context = {
          popUpTitle: 'Send Backward To ' + LocalStorageUtil.getStorage().roleName,
          isForward: false,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: DocAction[DocAction.BACKWARD_TO_COMMITTEE],
          documentStatus: DocStatus.PENDING,
          toRole: {id: Number(LocalStorageUtil.getStorage().roleId)}
        };
        break;
      case 'forward':
        if (this.loanFlags && this.loanFlags.length > 0) {
          this.loanFlags.sort((a, b) => a.order - b.order);
          this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));
          return;
        }
        context = {
          popUpTitle: 'Send Forward',
          isForward: true,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: DocAction.value(DocAction.FORWARD),
          documentStatus: DocStatus.PENDING
        };
        break;
      case 'approve':
        if (this.loanFlags && this.loanFlags.length > 0) {
          this.loanFlags.sort((a, b) => a.order - b.order);
          this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));
          return;
        }
        context = {
          popUpTitle: 'Approve',
          isForward: false,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: 'APPROVED',
          documentStatus: DocStatus.APPROVED
        };
        break;
      case 'reject':
        context = {
          popUpTitle: 'Reject',
          isForward: false,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: 'REJECT',
          documentStatus: DocStatus.REJECTED
        };
        break;
      case 'close':
        context = {
          popUpTitle: 'Close',
          isForward: false,
          loanConfigId: this.loanConfigId,
          customerLoanId: this.id,
          docAction: 'CLOSED',
          documentStatus: DocStatus.CLOSED
        };
        break;
    }
    if (ObjectUtil.isEmpty(this.combinedLoanId)) {
      this.nbDialogService.open(LoanActionModalComponent, {context});
    } else {
      context.combinedLoanId = this.combinedLoanId;
      this.nbDialogService.open(LoanActionCombinedModalComponent, {context});
    }

  }

  public onEdit() {
    this.router.navigate(['/home/loan/loanForm'], {
      queryParams: {
        loanId: this.loanConfigId,
        customerId: this.id,
        loanCategory: this.loanCategory
      }
    });
  }

  public deleteCustomerLoan() {
    this.loanFormService.deleteLoanCustomer(this.id).subscribe((res: any) => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully Deleted'));
          this.router.navigate(['/home/pending']);
        },
        error => {
          this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
  }

}

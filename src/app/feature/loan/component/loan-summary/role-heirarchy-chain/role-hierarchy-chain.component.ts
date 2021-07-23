import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApprovalRoleHierarchyService} from '../../../approval/approval-role-hierarchy.service';
import {LoanDataHolder} from '../../../model/loanData';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CustomerLoanFlag} from '../../../../../@core/model/customer-loan-flag';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {DocStatus} from '../../../model/docStatus';
import {DocAction} from '../../../model/docAction';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {SingleLoanTransferModelComponent} from '../../../../transfer-loan/components/single-loan-transfer-model/single-loan-transfer-model.component';
import {CombinedLoanTransferModelComponent} from '../../../../transfer-loan/components/combined-loan-transfer-model/combined-loan-transfer-model.component';

@Component({
  selector: 'app-role-heirarchy-chain',
  templateUrl: './role-hierarchy-chain.component.html',
  styleUrls: ['./role-hierarchy-chain.component.scss']
})
export class RoleHierarchyChainComponent implements OnInit, OnChanges {

  @Input() refId: number;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() loanFlags: CustomerLoanFlag[];
  @Input() branchId: number;
  @Input() combinedLoanId: number;
  approvalType: string;
  length = false;
  defaultRoleHierarchies = [];
  approvalRoleHierarchies = [];
  private dialogRef: NbDialogRef<any>;
  isOpen = false;
  isMaker: string;
  currentRole: string;
  loanConfigId: number;
  customerLoanId: number;
  popUpTitle: string;
  currentRoleOrder: number;
  currentRoleType: string;
  arrow = ' >> ';
  isFileUnderCurrentToUser: any;

  constructor(
      private route: ActivatedRoute,
      private service: ApprovalRoleHierarchyService,
      private nbDialogService: NbDialogService,
      private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
    this.currentRoleType = LocalStorageUtil.getStorage().roleType;
    this.service.findAll(this.approvalType, this.refId).subscribe((response: any) => {
      this.defaultRoleHierarchies = response.detail;
      this.length = this.defaultRoleHierarchies.length > 0;
      this.approvalRoleHierarchies = this.defaultRoleHierarchies.reverse();
      const currentRoleId = this.loanDataHolder.currentStage.toUser.role.id;
      this.isMaker = this.loanDataHolder.currentStage.toUser.role.roleType;
      this.defaultRoleHierarchies.filter((f) => {
        const roleId = f.role.id;
        f.isCurrentRole = false;
        if (currentRoleId === roleId) {
          f.isCurrentRole = true;
          this.currentRole = f.role.roleName;
          this.currentRoleOrder = f.role.roleOrder;
          this.isFileUnderCurrentToUser = this.loanDataHolder.currentStage.toUser;
        }
          this.popUpTitle = 'Transfer';
      });
    });
    this.route.queryParamMap.subscribe((param) => {
      this.loanConfigId = +param.get('loanConfigId');
      this.customerLoanId = +param.get('customerId');
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loanFlags.currentValue) {
      this.loanFlags = this.loanFlags.filter((l) =>
          (l.customerLoanId === this.customerLoanId || ObjectUtil.isEmpty(l.customerLoanId)));
    }
  }

  public close() {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
  }

  public openRoleHierarchyModel(): void {
    this.close();
    let context;
    if (this.loanFlags && this.loanFlags.length > 0) {
      this.loanFlags.sort((a, b) => a.order - b.order);
      this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));
      return;
    }
    context = {
      approvalType: this.approvalType,
      refId: this.refId,
      isMaker: this.isMaker,
      currentRole: this.currentRole,
      loanConfigId: this.loanConfigId,
      customerLoanId: this.customerLoanId,
      branchId: this.branchId,
      customerLoanHolder: this.loanDataHolder,
      popUpTitle: this.popUpTitle,
      isTransfer: true,
      currentRoleOrder: this.currentRoleOrder,
      docAction: DocAction.value(DocAction.TRANSFER),
      documentStatus: DocStatus.PENDING,
      toRole: {id: Number(LocalStorageUtil.getStorage().roleId)},
      isFileUnderCurrentToUser: this.isFileUnderCurrentToUser,
    };
    if (ObjectUtil.isEmpty(this.combinedLoanId)) {
      this.dialogRef = this.nbDialogService.open(SingleLoanTransferModelComponent, {
        context,
        closeOnBackdropClick: false,
        hasBackdrop: false,
        hasScroll: true
      });
    } else {
      context.combinedLoanId = this.combinedLoanId;
      context.isMaker = this.isMaker;
      context.branchId =  this.branchId;
      this.dialogRef = this.nbDialogService.open(CombinedLoanTransferModelComponent, {
        context,
        closeOnBackdropClick: false,
        hasBackdrop: false,
        hasScroll: true
      });
    }
    this.isOpen = true;
  }
}

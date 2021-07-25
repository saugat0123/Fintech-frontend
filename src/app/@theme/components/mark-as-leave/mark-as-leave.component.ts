import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../model/Alert';

@Component({
  selector: 'app-mark-as-leave',
  templateUrl: './mark-as-leave.component.html',
  styleUrls: ['./mark-as-leave.component.scss']
})
export class MarkAsLeaveComponent implements OnInit {
  activeLoanCount: number;
  loanStatus: string;
  userId: string;
  isTransferEnable: boolean;
  noActiveLoan = false;
  SUCCESS = 'You can now take leave!!';
  ERROR = 'Fail to transfer files';

  constructor(private modelService: NgbModal,
              private loanService: LoanFormService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.userId = LocalStorageUtil.getStorage().userId;
    this.getActiveLoan();
    this.loanService.getCustomerAllPendingLoans().subscribe((response: any) => {
      console.log(response.detail);
    });
  }

  private getActiveLoan(): void {
    this.loanService.getStatus().subscribe((response: any) => {
      console.log(response.detail);
      this.activeLoanCount = response.detail.pending;
      this.loanStatus = response.detail.status;
      if (this.activeLoanCount === 0 ) {
        this.noActiveLoan = true;
      }
    });
  }
  public onClose(): void {
    this.modelService.dismissAll();
  }

  public enableDisable($event) {
    this.isTransferEnable = $event;
  }

  public goOnLeave(): void {
    this.toastService.show(new Alert(AlertType.SUCCESS, this.SUCCESS));
    this.modelService.dismissAll();
  }
}

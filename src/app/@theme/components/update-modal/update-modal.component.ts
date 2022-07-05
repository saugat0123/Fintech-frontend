import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonPageService} from '../../../@core/service/baseservice/common-pagination-service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../model/Alert';
import {Status} from '../../../@core/Status';
import {ListRoleComponent} from '../../../feature/admin/component/role-permission/list-role/list-role.component';
import {Customer} from '../../../feature/admin/modal/customer';
import {RoleHierarchyComponent} from '../../../feature/admin/component/role-hierarchy/role-hierarchy.component';
import {LoanDataHolder} from '../../../feature/loan/model/loanData';

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent {

    @Input()
    data: any = {};

    @Input()
    service: any;

    globalMsg: any;
    spinner = false;
    @Input() isEdit;

    constructor(
        private router: Router,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private activeModalService: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    updateStatus() {
      this.spinner = true;
        if (this.data.valuatingField !== undefined && this.data.status === Status.INACTIVE) {
            this.activeModalService.dismiss('openInactiveComment');
            return;
        }
       if (this.isEdit === true) {
           this.service.update(this.data).subscribe(() => {
                   this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
                   this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED STATUS'));
                   this.activeModalService.close();
               }, error => {
                   this.activeModalService.dismiss();
                   this.globalMsg = error.error.message;
               }
           );
       } else {
           this.service.save(this.data).subscribe(() => {
                   this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
                   this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED STATUS'));
                   this.activeModalService.close();
               }, error => {
                   this.activeModalService.dismiss();
                   this.globalMsg = error.error.message;
               }
           );
       }
    }

    closeModal() {
        this.activeModalService.dismiss();
    }
}

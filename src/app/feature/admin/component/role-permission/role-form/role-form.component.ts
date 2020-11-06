import {Component, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {RoleService} from '../role.service';
import {RoleType} from '../../../modal/roleType';
import {RoleAccess} from '../../../modal/role-access';


@Component({
    selector: 'app-add-role',
    templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {

    role: Role = new Role();
    roleTypeList = RoleType;
    roleAccessList = RoleAccess;
    hideRoleType = false;
    hideBranchAccess = false;

    constructor(
        private service: RoleService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {


        // this.service.checkRoleContainMaker().subscribe((res: any) => {
        //     this.hideRoleType = res.detail;
        // });
    }

    onSubmit() {
        this.service.save(this.role).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Role!'));

                this.role = new Role();

                this.activeModal.close(ModalResponse.SUCCESS);
            },
            (error) => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Role!:' + error.error.message));
                this.activeModal.dismiss(error);
            });
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    checkRole() {
        if (this.role.roleType === RoleType.MAKER || this.role.roleType === RoleType.COMMITTEE) {
            this.hideBranchAccess = true;
            this.role.roleAccess = RoleAccess.OWN;
            if (this.role.roleType === RoleType.COMMITTEE) {
                this.role.roleAccess = RoleAccess.ALL;
            }
        } else {
            this.hideBranchAccess = false;
            this.role.roleAccess = RoleAccess.OWN;
        }
    }

}

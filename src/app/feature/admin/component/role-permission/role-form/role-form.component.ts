import {Component, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {RoleService} from '../role.service';
import {RoleType} from '../../../modal/roleType';
import {RoleAccess} from '../../../modal/role-access';
import {AppConfigService} from '../../../../../@core/service/appConfig/app-config.service';


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
    authorityRequired = true;
    showAuthority = true;
    appConfigRoleType = [];
    showCheck = false;
    checkedStatus = false;

    constructor(
        private service: RoleService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastService: ToastService,
        private appConfigService: AppConfigService
    ) {
    }

    ngOnInit() {
        this.appConfigService.getRoleType().subscribe((res: any) => {
            this.appConfigRoleType = res.detail;
        });

        // this.service.checkRoleContainMaker().subscribe((res: any) => {
        //     this.hideRoleType = res.detail;
        // });
    }

    onSubmit() {
        this.role.signApprovalSheet = this.checkedStatus;
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
        if (this.role.roleType === RoleType.MAKER || this.role.roleType === RoleType.COMMITTEE || this.role.roleType === RoleType.ADMIN
            || this.role.roleType === RoleType.CAD_SUPERVISOR) {
            this.hideBranchAccess = true;
            this.authorityRequired = true;
            this.showAuthority = true;
            this.role.roleAccess = RoleAccess.OWN;
            if (this.role.roleType === RoleType.COMMITTEE) {
                this.role.roleAccess = RoleAccess.ALL;
            }
            if (this.role.roleType === RoleType.CAD_SUPERVISOR) {
                this.role.roleAccess = RoleAccess.SPECIFIC;
            }
            if (this.role.roleType === RoleType.ADMIN) {
                this.role.roleAccess = RoleAccess.ALL;
                this.authorityRequired = false;
                this.showAuthority = false;
            }

        } else {
            this.hideBranchAccess = false;
            this.authorityRequired = true;
            this.showAuthority = true;
            this.role.roleAccess = RoleAccess.OWN;
        }

        if (this.role.roleType === RoleType.CAD_SUPERVISOR || this.role.roleType === RoleType.CAD_ADMIN || this.role.roleType === RoleType.CAD_LEGAL) {
            this.showAuthority = false;
        }
        if (this.role.roleType === RoleType.APPROVAL || this.role.roleType === RoleType.COMMITTEE) {
            this.showCheck = true;

        } else {
            this.showCheck = false;

        }
    }

    checked(data) {
        this.checkedStatus = data.target.checked;
    }

}

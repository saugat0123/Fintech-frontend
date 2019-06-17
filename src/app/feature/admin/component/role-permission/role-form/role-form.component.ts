import {Component, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {RoleService} from '../role.service';
import {RoleType} from '../../../modal/roleType';


@Component({
    selector: 'app-add-role',
    templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {

    role: Role = new Role();
    roleTypeList;
    hideRoleType = false;

    constructor(
        private service: RoleService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.roleTypeList = RoleType;
        this.service.checkRoleContainMaker().subscribe((res: any) => {
            this.hideRoleType = res.detail;
        });
    }

    onSubmit() {
        this.service.save(this.role).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Role!'));

                this.role = new Role();

                this.activeModal.close(ModalResponse.SUCCESS);
            },
            (error) => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Role!'));
                this.activeModal.dismiss(error);
            });
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}

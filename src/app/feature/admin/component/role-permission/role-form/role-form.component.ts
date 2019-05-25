import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-add-role',
    templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {
    role: Role = new Role();
    currentApi: string;
    globalMsg: string;

    constructor(
        private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    onSubmit() {
        this.currentApi = 'v1/role';
        this.commonService.saveOrEdit(this.role, this.currentApi).subscribe(() => {

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

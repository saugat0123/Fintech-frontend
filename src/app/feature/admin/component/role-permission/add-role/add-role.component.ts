import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
    role: Role = new Role();
    currentApi: string;
    globalMsg: string;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private router: Router,
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
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/role']));

            },
            (error) => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Role!'));
            });
    }

    onClose() {
        this.activeModal.dismiss(AddRoleComponent);
    }

}

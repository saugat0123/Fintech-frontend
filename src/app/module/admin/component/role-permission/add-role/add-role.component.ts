import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Role} from '../../../modal/role';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


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
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
    }


    onSubmit() {
        this.currentApi = 'v1/role';
        this.commonService.saveOrEdit(this.role, this.currentApi).subscribe(result => {
            this.modalService.dismissAll(AddRoleComponent);
            this.globalMsg = 'SUCCESSFULLY ADDED ROLE';


            this.dataService.getGlobalMsg(this.globalMsg);
            this.dataService.getAlertMsg('true');
            this.role = new Role();
            this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                this.router.navigate(['home/role']));

        });
    }
    onClose() {
        this.activeModal.dismiss(AddRoleComponent);
    }

}

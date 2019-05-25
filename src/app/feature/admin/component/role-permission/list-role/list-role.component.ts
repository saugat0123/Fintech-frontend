import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Role} from '../../../modal/role';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../../@theme/components';


@Component({
    selector: 'app-list-role',
    templateUrl: './list-role.component.html',
    styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {
    title = 'Role';
    activeCount: any;
    inactiveCount: any;
    roleCount: any;
    currentApi: any;
    roleList: any;
    globalMsg: any;


    constructor(
        private commonService: CommonService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/role';
        this.commonService.getByAll(this.currentApi + '/get/statusCount').subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.roles;

        });

        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.roleList = response.detail;
            console.log(response);
        });
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.modalService.open(UpdateModalComponent);

    }


}

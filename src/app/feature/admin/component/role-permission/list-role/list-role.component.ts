import {Component, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {RoleService} from '../role.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {RoleEditComponent} from './role-edit/role-edit.component';


@Component({
    selector: 'app-list-role',
    templateUrl: './list-role.component.html',
    styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {
    title = 'Role';
    role: Role = new Role();
    activeCount: any;
    inactiveCount: any;
    roleCount: any;
    roleList: Array<Role>;

    constructor(
        private service: RoleService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    static loadData(other: ListRoleComponent) {

        other.breadcrumbService.notify(other.title);

        other.service.getStatus().subscribe((response: any) => {
            other.activeCount = response.detail.active;
            other.inactiveCount = response.detail.inactive;
            other.roleCount = response.detail.roles;

        });

        other.service.getAll().subscribe((response: any) => {
            other.roleList = response.detail;
        });
    }

    ngOnInit() {
        ListRoleComponent.loadData(this);
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.modalService.open(UpdateModalComponent);
    }

    openEditRole(role: Role) {
        const modalRef = this.modalService.open(RoleEditComponent, {backdrop: 'static'});
        modalRef.componentInstance.model = role;
        ModalUtils.resolve(modalRef.result, ListRoleComponent.loadData, this);
    }
}

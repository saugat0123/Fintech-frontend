import {Component, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {RoleService} from '../role.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {RoleEditComponent} from './role-edit/role-edit.component';
import {UserService} from '../../user/user.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Status} from '../../../../../@core/Status';


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
        private breadcrumbService: BreadcrumbService,
        private userService: UserService,
        private toastService: ToastService
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

    onStatusChange(data) {
        console.log('data.status:::{}', data);
        if (data.status === Status.ACTIVE) {
            this.updateStatus(data);
            return;
        }
        const roleId = data.id;
        this.userService.getActiveUserListByRoleId(roleId).subscribe((response: any) => {
            if (response.detail.length > 0) {
                const activeUserCount = response.detail.length;
                this.toastService.show(new Alert(AlertType.ERROR,
                    'Can not change status, ' + activeUserCount + ' user(s) active in ' +
                    data.roleName + ' role.'));
                ListRoleComponent.loadData(this);
            } else {
                this.updateStatus(data);
            }
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            ListRoleComponent.loadData(this);
            }
        );
    }

    private updateStatus (data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        const modalRef = this.modalService.open(UpdateModalComponent);
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                ListRoleComponent.loadData(this);
            }, dismiss => {
                ListRoleComponent.loadData(this);
            }
        );
    }

    openEditRole(role: Role) {
        const modalRef = this.modalService.open(RoleEditComponent, {backdrop: 'static'});
        modalRef.componentInstance.model = role;
        ModalUtils.resolve(modalRef.result, ListRoleComponent.loadData, this);
    }
}

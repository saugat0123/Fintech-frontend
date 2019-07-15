import {Component, OnInit, TemplateRef} from '@angular/core';
import {Role} from '../../../modal/role';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {RoleService} from '../role.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';


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

    private modalRef: NgbModalRef;

    constructor(
        private service: RoleService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
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

    openEditRole(role: Role, template: TemplateRef<any>) {
        this.role = new Role();
        this.role = role;
        this.modalRef = this.modalService.open(template);
        console.log(this.role);
    }

    onSubmit() {
        this.service.update(this.role).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Role name!'));
                this.modalService.dismissAll('Close modal');
                ListRoleComponent.loadData(this);
            },
            (error) => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Role name!'));
                this.modalService.dismissAll('Close modal');
            });
    }
}

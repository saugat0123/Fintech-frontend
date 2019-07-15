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

    ngOnInit() {
        this.breadcrumbService.notify(this.title);

        this.service.getStatus().subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.roles;

        });

        this.service.getAll().subscribe((response: any) => {
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

    openEditRole(role: Role, template: TemplateRef<any>) {
        this.role = new Role();
        this.role = role;
        this.modalRef = this.modalService.open(template);
        console.log(this.role);
    }

    onSubmit() {
        this.service.save(this.role).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Role name!'));

                this.modalService.dismissAll('Close modal');
            },
            (error) => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Update Role name!'));
                this.modalService.dismissAll('Close modal');
            });
    }
}

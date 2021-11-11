import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Company} from '../../modal/company';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CompanyFormComponent} from './company-form/company-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {CompanyService} from './company.service';
import {PermissionService} from '../../../../@core/service/permission.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit {

    page = 1;

    title = 'Company';
    breadcrumb = 'Company > List';
    dataList: Array<Company>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    companies: number;
    permissions = [];
    viewCompany = false;
    addViewCompany = false;
    statusCompany = false;

    constructor(
        private service: CompanyService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

    static loadData(other: CompanyComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {
            if (error.status === 403) {
                other.router.navigate(['/home/error']);
            } else {
                console.log(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Company Data'));
            }
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        CompanyComponent.loadData(this);
        this.service.getStatus().subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.companies = response.detail.companys;

        });
        this.permissionService.getPermissionOf('COMPANY').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD COMPANY') {
                    this.addViewCompany = true;
                }
                if (this.permissions[i].type === 'VIEW COMPANY') {
                    CompanyComponent.loadData(this);
                    this.viewCompany = true;
                }
                if (this.permissions[i].type === 'VIEW STATUS') {
                    this.statusCompany = true;
                }
            }
        });
    }

    changePage(page: number) {
        this.page = page;

        CompanyComponent.loadData(this);
    }

    onSearch() {
        CompanyComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        CompanyComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(CompanyFormComponent);
        modalRef.componentInstance.company = new Company();

        ModalUtils.resolve(modalRef.result, CompanyComponent.loadData, this);
    }

    edit(company: Company) {

        const modalRef = this.modalService.open(CompanyFormComponent);
        modalRef.componentInstance.company = company;

        ModalUtils.resolve(modalRef.result, CompanyComponent.loadData, this);
    }

}

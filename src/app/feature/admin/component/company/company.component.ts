import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Company} from '../../modal/company';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CompanyFormComponent} from './company-form/company-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit, DoCheck {

    title = 'Company';
    breadcrumb = 'Company > List';
    dataList: Array<Company>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    companys: number;
    permissions = [];
    viewCompany = false;
    addViewCompany = false;
    statusCompany = false;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private breadcrumbSerivce: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.dataService.setDataList(other.dataList);
                other.commonPageService.setCurrentApi(other.currentApi);
                other.pageable = other.commonPageService.setPageable(response.detail);
                other.spinner = false;

            }, error => {

                console.log(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Company Data'));
            }
        );

    }

    ngOnInit() {
        this.breadcrumbSerivce.notify(this.title);
        this.currentApi = 'v1/company/get';

        CompanyComponent.loadData(this);

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.companys = response.detail.companys;

        });

        this.commonService.getByPost('v1/permission/chkPerm', 'COMPANY').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'Add Company') {
                    this.addViewCompany = true;
                }
                if (this.permissions[i].type === 'View Company') {
                    CompanyComponent.loadData(this);
                    this.viewCompany = true;
                }
                if (this.permissions[i].type === 'View Status') {
                    this.statusCompany = true;
                }
            }
        });
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    onSearch() {
        this.dataService.setData(this.search);
        CompanyComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        CompanyComponent.loadData(this);
    }

    addCompany() {
        this.dataService.setCompany(new Company());

        ModalUtils.resolve(this.modalService.open(CompanyFormComponent).result, CompanyComponent.loadData, this);
    }

    openEdit(company: Company) {
        this.dataService.setCompany(company);
        ModalUtils.resolve(this.modalService.open(CompanyFormComponent).result, CompanyComponent.loadData, this);
    }

}

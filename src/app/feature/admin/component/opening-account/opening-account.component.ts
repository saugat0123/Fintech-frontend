import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Branch} from '../../modal/branch';
import {OpeningForm} from '../../modal/openingForm';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../@core/utils';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {OpeningAccountService} from './opening-account.service';

@Component({
    selector: 'app-opening-account',
    templateUrl: './opening-account.component.html',
    styleUrls: ['./opening-account.component.css']
})
export class OpeningAccountComponent implements OnInit {
    title = 'Opening Account';
    page = 1;
    search: any = {};
    openingForms: Array<OpeningForm> = new Array<OpeningForm>();
    currentApi: string;
    pageable: Pageable = new Pageable();
    branch: Branch = new Branch();
    spinner = false;
    globalMsg: string;
    total: number;
    pending: number;
    approval: number;
    rejected: number;

    constructor(
        private service: OpeningAccountService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

    static loadData(other: OpeningAccountComponent) {
        other.spinner = true;
        other.service.getA(other.branch, other.page, 10, 'NEW_REQUEST').subscribe((response: any) => {
                other.openingForms = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {
                console.log(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.service.getStatus().subscribe((response: any) => {
            this.total = response.detail.total;
            this.pending = response.detail.newed;
            this.approval = response.detail.approval;
            this.rejected = response.detail.rejected;
        });
        this.branch.id = 1;
        OpeningAccountComponent.loadData(this);
    }

    onEdit(openingForm: OpeningForm) {
        this.router.navigate(['home/admin/openOpeningAccount'], {queryParams: {openingFormId: openingForm.id}});
    }

    updateStatus(id, status) {
        this.service.update(id, status).subscribe((response: any) => {
                OpeningAccountComponent.loadData(this);
            }, error => {
                console.log(error);
            }
        );
    }
}

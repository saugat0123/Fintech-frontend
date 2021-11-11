import {Component, OnInit} from '@angular/core';
import {BaseInterestService} from '../../service/base-interest.service';
import {BaseInterest} from './BaseInterest';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseInterestFormComponent} from './base-interest-form/base-interest-form.component';
import {Action} from '../../../../@core/Action';
import {error} from 'protractor';
import {Router} from '@angular/router';



@Component({
    selector: 'app-base-interest',
    templateUrl: './base-interest.component.html',
    styleUrls: ['./base-interest.component.scss'],
})
export class BaseInterestComponent implements OnInit {
    search: any = {};
    page = 1;
    pageable: Pageable = new Pageable();
    listing: Array<BaseInterest>;
    spinner = false;

    constructor(private baseInterestService: BaseInterestService,
                private toastService: ToastService,
                private modalService: NgbModal,
                private router: Router) {
    }

    static loadData(other: BaseInterestComponent) {
        other.spinner = true;
        other.baseInterestService.getPaginationWithSearchObject(other.search , other.page, 5).subscribe((response: any) => {
            other.listing = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, (err) => {
            if (err.status === 403) {
                other.router.navigate(['/home/error']);
            } else {
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
            }

            other.spinner = false;
        });
    }

    ngOnInit() {
        BaseInterestComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        BaseInterestComponent.loadData(this);
    }

    addInterest() {
        const modalRef = this.modalService.open(BaseInterestFormComponent);
        modalRef.componentInstance.model = new BaseInterest();
        modalRef.componentInstance.action = Action.ADD;
        ModalUtils.resolve(modalRef.result, BaseInterestComponent.loadData, this);
    }

}


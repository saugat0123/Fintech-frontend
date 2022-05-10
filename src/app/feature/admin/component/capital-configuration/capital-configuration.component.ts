import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CoreCapital} from './coreCapital';
import {Action} from '../../../../@core/Action';
import {CapitalConfigurationFormComponent} from './capital-configuration-form/capital-configuration-form.component';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CoreCapitalService} from '../../service/core-capital.service';
import {Router} from '@angular/router';
import {ModalUtils, ToastService} from '../../../../@core/utils';

@Component({
    selector: 'app-capital-configuration',
    templateUrl: './capital-configuration.component.html',
    styleUrls: ['./capital-configuration.component.scss']
})
export class CapitalConfigurationComponent implements OnInit {
    search: any = {};
    page = 1;
    pageable: Pageable = new Pageable();
    listing: Array<CoreCapital>;
    spinner = false;

    constructor(private modalService: NgbModal,
                private service: CoreCapitalService,
                private router: Router,
                private toastService: ToastService,) {
    }

    static loadData(other: CapitalConfigurationComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search , other.page, 5).subscribe((response: any) => {
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
        CapitalConfigurationComponent.loadData(this);
    }


    changePage(page: number) {
        this.page = page;
        CapitalConfigurationComponent.loadData(this);

    }

    addCapital() {
        const modalRef = this.modalService.open(CapitalConfigurationFormComponent);
        modalRef.componentInstance.model = new CoreCapital();
        modalRef.componentInstance.action = Action.ADD;
        ModalUtils.resolve(modalRef.result, CapitalConfigurationComponent.loadData, this);
    }
}

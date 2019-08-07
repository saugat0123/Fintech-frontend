import {Component, OnInit} from '@angular/core';
import {Applicant} from '../../../modal/applicant';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NewRequestService} from '../new-requests/new-request.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Status} from '../../../modal/eligibility';
import {SubmissionDocument} from '../../../modal/submission-document';
import {EligibilityDocumentViewComponent} from '../eligibility-document-view/eligibility-document-view.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-eligible-requests',
    templateUrl: './eligible-requests.component.html',
    styleUrls: ['./eligible-requests.component.css']
})
export class EligibleRequestsComponent implements OnInit {

    spinner = false;
    applicantList: Array<Applicant> = new Array<Applicant>();

    page = 1;
    search: any = {};
    pageable: Pageable = new Pageable();
    searchString: string = NewRequestService.resolveSearchString(Status.ELIGIBLE, null, null);

    constructor(private newRequestService: NewRequestService,
                private toastService: ToastService,
                private modalService: NgbModal) {
    }

    static loadData(other: EligibleRequestsComponent) {

        other.spinner = true;
        other.applicantList = [];
        other.newRequestService.getAllWithSearchObject(other.page, 10, other.searchString).subscribe((response: any) => {
                other.applicantList = response.detail.content;
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
        EligibleRequestsComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        EligibleRequestsComponent.loadData(this);
    }

    viewDocument(document: SubmissionDocument) {

        const modalRef = this.modalService.open(EligibilityDocumentViewComponent, {size: 'lg'});
        modalRef.componentInstance.model = document;
        ModalUtils.resolve(modalRef.result, EligibleRequestsComponent.loadData, this);
    }

}

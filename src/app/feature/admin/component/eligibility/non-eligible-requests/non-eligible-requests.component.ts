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
import {Router} from '@angular/router';

@Component({
  selector: 'app-non-eligible-requests',
  templateUrl: './non-eligible-requests.component.html',
  styleUrls: ['./non-eligible-requests.component.css']
})
export class NonEligibleRequestsComponent implements OnInit {

  spinner = false;
  applicantList: Array<Applicant> = new Array<Applicant>();

  page = 1;
  search: any = {
    branchIds: undefined,
    loanConfigId: undefined,
    eligibilityStatus: Status.REJECTED
  };
  pageable: Pageable = new Pageable();

  constructor(private newRequestService: NewRequestService,
              private toastService: ToastService,
              private modalService: NgbModal,
              private router: Router) {
  }

  static loadData(other: NonEligibleRequestsComponent) {

    other.spinner = true;
    other.newRequestService.getAllWithSearchObject(other.page, 10, other.search).subscribe((response: any) => {
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
    NonEligibleRequestsComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;

    NonEligibleRequestsComponent.loadData(this);
  }

  viewDocument(document: SubmissionDocument) {

    const modalRef = this.modalService.open(EligibilityDocumentViewComponent, {size: 'lg'});
    modalRef.componentInstance.model = document;
    ModalUtils.resolve(modalRef.result, NonEligibleRequestsComponent.loadData, this);
  }

  onApplicantClick(applicantId) {
    this.spinner = true;
    this.router.navigate(['/home/admin/eligibility/eligibility-summary'], {queryParams: {applicantId: applicantId}});
  }
}

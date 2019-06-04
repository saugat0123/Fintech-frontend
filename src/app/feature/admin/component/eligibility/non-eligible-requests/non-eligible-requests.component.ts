import { Component, OnInit } from '@angular/core';
import {Applicant} from '../../../modal/applicant';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NewRequestService} from '../new-requests/new-request.service';
import {ToastService} from '../../../../../@core/utils';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-non-eligible-requests',
  templateUrl: './non-eligible-requests.component.html',
  styleUrls: ['./non-eligible-requests.component.css']
})
export class NonEligibleRequestsComponent implements OnInit {

  spinner = false;
  applicantList: Array<Applicant> = new Array<Applicant>();

  page = 1;
  search: any = {};
  pageable: Pageable = new Pageable();

  constructor(private newRequestService: NewRequestService,
              private toastService: ToastService) { }

  static loadData(other: NonEligibleRequestsComponent) {

    other.spinner = true;
    other.newRequestService.getAllWithoutSearchObject(other.page, 10).subscribe((response: any) => {
          other.applicantList = response.detail.content;
          other.applicantList.forEach((applicant, index) => {
            if (applicant.eligibilityStatus === 'ELIGIBLE') {
              other.applicantList.splice(index, 1);
            }
          });
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
}

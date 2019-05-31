import { Component, OnInit } from '@angular/core';
import {Applicant} from '../../../modal/applicant';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NewRequestService} from '../new-requests/new-request.service';
import {ToastService} from '../../../../../@core/utils';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

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

  constructor(private newRequestService: NewRequestService,
              private toastService: ToastService) { }

  static loadData(other: EligibleRequestsComponent) {

    other.spinner = true;
    other.newRequestService.getAllWithoutSearchObject(other.page, 10).subscribe((response: any) => {
          other.applicantList = response.detail.content;
      other.applicantList.forEach((applicant, index) => {
        if (applicant.eligibilityStatus === 'NOT_ELIGIBLE') {
          other.applicantList.splice(index, 1);
        }
      });
          console.log(other.applicantList);
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
    console.log(this.applicantList);
  }

  changePage(page: number) {
    this.page = page;

    EligibleRequestsComponent.loadData(this);
  }

}

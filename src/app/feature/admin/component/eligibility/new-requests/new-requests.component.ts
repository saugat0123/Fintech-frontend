import { Component, OnInit } from '@angular/core';
import {NewRequestService} from './new-request.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Applicant} from '../../../modal/applicant';
import {ToastService} from '../../../../../@core/utils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.component.html',
  styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent implements OnInit {
  spinner = false;
  applicantList: Array<Applicant> = new Array<Applicant>();

  page = 1;
  search: any = {};
  pageable: Pageable = new Pageable();

  constructor(private newRequestService: NewRequestService,
              private toastService: ToastService) { }

  static loadData(other: NewRequestsComponent) {

    other.spinner = true;
    other.newRequestService.getAllWithoutSearchObject(other.page, 10).subscribe((response: any) => {
          other.applicantList = response.detail.content;
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
    NewRequestsComponent.loadData(this);
    console.log(this.applicantList);
  }

  changePage(page: number) {
    this.page = page;

    NewRequestsComponent.loadData(this);
  }

}

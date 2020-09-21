import {Component, Input, OnInit} from '@angular/core';
import {CustomerActivityService} from '../../../customer-activity/customer-activity.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {UpdateViewComponent} from '../../../customer-activity/component/update-view/update-view.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {
  @Input() customerInfoId: number;


  page = 1;

  size = 20;
  spinner = false;
  dataList = [];
  pageable: Pageable = new Pageable();

  constructor(private activityService: CustomerActivityService,
              private modalService: NgbModal, ) {
  }

  static loadData(other: ActivityListComponent) {
    const search = {profileId: other.customerInfoId};
    other.spinner = true;
    other.activityService.getPaginationWithSearchObject(search, other.page, other.size).subscribe((response: any) => {
          other.dataList = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner = false;
        }, error => {


          other.spinner = true;
        }
    );
  }

  ngOnInit() {
    ActivityListComponent.loadData(this);
  }

  viewUpdate(data, activity, profile) {
    const modalRef = this.modalService.open(UpdateViewComponent, {size: 'lg'});
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.activity = activity;
    modalRef.componentInstance.profile = profile;
  }

  onScrollDown() {
    if (this.pageable.totalElements > this.size) {
      this.size = this.size + 20;
      ActivityListComponent.loadData(this);
    }

    this.spinner = false;
  }
}

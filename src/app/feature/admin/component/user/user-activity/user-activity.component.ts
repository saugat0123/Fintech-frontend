import { Component, OnInit } from '@angular/core';
import {UserActivityService} from '../user-activity.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {UserActivity} from '../../../modal/userActivity';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {

  constructor(private userActivityService: UserActivityService,
              private toastService: ToastService) { }
  activityCount: number;
  userActivity: UserActivity[];
  search = {
    name: undefined,
    createdAt: undefined
  };
  page = 1;
  pageable: Pageable = new Pageable();

  static loaData(other: UserActivityComponent) {
    other.userActivityService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe({
      next: (value: any) => {
        other.userActivity = value.detail.content;
        other.pageable = PaginationUtils.getPageable(value.detail);
      }, error: () => {},
      complete: () => {}
    });
  }

  ngOnInit() {
    UserActivityComponent.loaData(this);
  }

}

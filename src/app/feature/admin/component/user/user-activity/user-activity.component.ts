import {Component, OnInit} from '@angular/core';
import {UserActivityService} from '../user-activity.service';
import {ToastService} from '../../../../../@core/utils';
import {UserActivity} from '../../../modal/userActivity';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../modal/roleType';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {

  constructor(private userActivityService: UserActivityService,
              private toastService: ToastService) {
  }

  activityCount: number;
  userActivity: UserActivity[];
  search = {
    name: undefined,
    createdBy: undefined
  };
  page = 1;
  pageable: Pageable = new Pageable();
  spinner = false;

  static loaData(other: UserActivityComponent) {
    other.spinner = true;
    if (LocalStorageUtil.getStorage().roleType !== RoleType.ADMIN) {
      other.search.createdBy = LocalStorageUtil.getStorage().userId;
    }
    other.userActivityService.getPaginationWithSearchObject(other.search, other.page, 20).subscribe({
      next: (value: any) => {
        other.userActivity = value.detail.content;
        other.pageable = PaginationUtils.getPageable(value.detail);
      }, error: () => {
        other.spinner = false;
      },
      complete: () => {
        other.spinner = false;
      }
    });
  }

  ngOnInit() {
    UserActivityComponent.loaData(this);
  }

  changePage(page: number) {
    this.page = page;
    UserActivityComponent.loaData(this);
  }

}

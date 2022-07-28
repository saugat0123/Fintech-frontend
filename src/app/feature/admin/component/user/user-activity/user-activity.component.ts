import {Component, OnInit} from '@angular/core';
import {UserActivityService} from '../user-activity.service';
import {ToastService} from '../../../../../@core/utils';
import {UserActivity} from '../../../modal/userActivity';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../modal/roleType';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {User} from '../../../modal/user';
import {UserService} from '../../../../../@core/service/user.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {

  constructor(private userActivityService: UserActivityService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private datePipe: DatePipe) {
  }
  filterForm: FormGroup;
  userActivity: UserActivity[];
  search = {
    createdBy: undefined,
    currentStageDate: undefined
  };
  page = 1;
  pageable: Pageable = new Pageable();
  spinner = false;
  isFilterCollapsed = true;
  userList: User[];
  roleId: number;
  isAdmin = true;

  static loaData(other: UserActivityComponent) {
    other.spinner = true;
    if (LocalStorageUtil.getStorage().roleType !== RoleType.ADMIN) {
      other.isAdmin = false;
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
    this.roleId = Number(LocalStorageUtil.getStorage().roleId);
    this.buildForm();
    this.getUserList();
    UserActivityComponent.loaData(this);
  }

  changePage(page: number) {
    this.page = page;
    UserActivityComponent.loaData(this);
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      createdBy: undefined,
      startDate: undefined,
      endDate: undefined
    });
  }

  onSearch() {
    this.search.createdBy = ObjectUtil.isEmpty(this.filterForm.get('createdBy').value) ?
        undefined : this.filterForm.get('createdBy').value;
    const startDate = ObjectUtil.isEmpty(this.filterForm.get('startDate').value) ?
        undefined : this.filterForm.get('startDate').value;
    const endDate = ObjectUtil.isEmpty(this.filterForm.get('endDate').value) ?
        undefined : this.filterForm.get('endDate').value;
    if (!ObjectUtil.isEmpty(startDate) && !ObjectUtil.isEmpty(endDate)) {
      this.search.currentStageDate = JSON.stringify({
        'startDate': this.datePipe.transform(startDate, 'MM/dd/yyyy'),
        'endDate': this.datePipe.transform(endDate, 'MM/dd/yyyy'),
      });
    }
    UserActivityComponent.loaData(this);
  }

  clearSearch() {
    this.buildForm();
    this.search = {
      createdBy: undefined,
      currentStageDate: undefined
    };
    this.isFilterCollapsed = true;
  }

  private getUserList() {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.userList = res.detail.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
      }, error: (err: any) => {
        this.toastService.show(new Alert(AlertType.DANGER, 'Unable to get user list'));
      },
      complete: () => {}
    });
  }
}

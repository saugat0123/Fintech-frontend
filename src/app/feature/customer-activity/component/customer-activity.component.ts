import {Component, OnInit} from '@angular/core';
import {CustomerActivityService} from '../customer-activity.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../@core/utils';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {RoleType} from '../../admin/modal/roleType';
import {RoleAccess} from '../../admin/modal/role-access';
import {District} from '../../admin/modal/district';
import {Branch} from '../../admin/modal/branch';
import {BranchService} from '../../admin/component/branch/branch.service';
import {UpdateViewComponent} from './update-view/update-view.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss']
})
export class CustomerActivityComponent implements OnInit {

  dataList = [];
  pageable: Pageable = new Pageable();
  page = 1;
  isFilterCollapsed = true;
  filterForm: FormGroup;

  allDistrict: Array<District> = Array<District>();
  branchList: Array<Branch> = new Array<Branch>();
  roleAccess: string;
  isMaker = false;

  accessSpecific: boolean;
  accessAll: boolean;
  showBranch = true;
  holdBranch = [];
  activityList = [];

  constructor(private activityService: CustomerActivityService,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private branchService: BranchService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal, ) {
  }

  static loadData(other: CustomerActivityComponent) {
    other.spinner.show();
    other.activityService.getPaginationWithSearchObject(other.filterForm.value, other.page, 10).subscribe((response: any) => {
          other.dataList = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner.hide();
        }, error => {
          other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));

          other.spinner.hide();
        }
    );
  }

  ngOnInit() {
    this.buildFilterForm();
    this.getBranch();
    this.getActivityList();
    CustomerActivityComponent.loadData(this);
  }


  changePage(page: number) {
    this.page = page;
    CustomerActivityComponent.loadData(this);
  }

  download() {
  }

  getActivityList() {
    this.activityService.getActivity().subscribe((res: any) => {
      this.activityList = res.detail;
    });
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
      activity: [undefined],
      customerType: [undefined],
      branchIds: [undefined]
    });
  }

  clear() {
    this.buildFilterForm();
    CustomerActivityComponent.loadData(this);

  }

  onSearch() {
    this.page = 1;
    CustomerActivityComponent.loadData(this);
  }

  getBranch() {
    this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
    if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
      this.isMaker = true;
    }
    if (this.roleAccess === RoleAccess.SPECIFIC) {
      this.accessSpecific = true;
    } else if (this.roleAccess === RoleAccess.ALL) {
      this.accessAll = true;
    }
    if (this.roleAccess === RoleAccess.OWN) {
      this.showBranch = false;
    }

    if (this.accessSpecific || this.accessAll) {
      this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
        this.branchList = response.detail;
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
      });
    }

  }

  viewUpdate(data, activity, profile, modifiedOn, modifiedBy) {
    const modalRef = this.modalService.open(UpdateViewComponent, {size: 'lg'});
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.activity = activity;
    modalRef.componentInstance.profile = profile;
    modalRef.componentInstance.modifiedOn = modifiedOn;
    modalRef.componentInstance.modifiedBy = modifiedBy;
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Branch} from '../../../admin/modal/branch';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ToastService} from '../../../../@core/utils';
import {CadDocStatus} from '../../model/CadDocStatus';
import {UserService} from '../../../../@core/service/user.service';
import {RoleType} from '../../../admin/modal/roleType';
import {User} from '../../../admin/modal/user';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isFilterCollapsed = true;
  filterForm: FormGroup;
  branchList: Array<Branch> = new Array<Branch>();
  cadDocStatus = CadDocStatus.key();
  role = RoleType;
  possessionUnderUserList: Array<User>;
  showPossessionUnder = false;
  @Output() eventEmitter = new EventEmitter();
  @Input() fromCadDashboard;
  constructor(private branchService: BranchService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {

    this.buildFilterForm();
    this.userService.getLoggedInUser().subscribe(res => {
      if (res.detail.role.roleType === RoleType.CAD_ADMIN || res.detail.role.roleType === RoleType.CAD_SUPERVISOR){
        this.showPossessionUnder = true;
        this.getUserList();
      }
      if (res.detail.role.roleType === RoleType.CAD_SUPERVISOR){
        const idList = [];
        res.detail.provinces.forEach( value => {
          idList.push(value);
        });
        this.branchService.getBranchByProvinceList(idList).subscribe((branchLists: any) => {
          this.branchList = branchLists.detail;
        });
      } else {
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
          this.branchList = response.detail;
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
      }
    });


  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
      customerType: [undefined],
      branchIds: [undefined],
      toUser: undefined ,
      docStatus: undefined
    });
  }

  onSearch() {
    this.eventEmitter.emit(this.filterForm.value);
  }

  clear() {
    this.filterForm.reset();
    this.eventEmitter.emit(this.filterForm.value);

  }

  getUserList() {
    this.userService.getAllUserByCurrentRoleBranchAccess().subscribe((value: any) => {
      this.possessionUnderUserList = value.detail;
    });

  }

}

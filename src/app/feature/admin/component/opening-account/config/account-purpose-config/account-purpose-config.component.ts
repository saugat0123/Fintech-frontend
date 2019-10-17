import {Component, OnInit} from '@angular/core';
import {AccountPurpose} from '../../../../modal/accountPurpose';
import {Pageable} from '../../../../../../@core/service/baseservice/common-pageable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AccountPurposeService} from '../../service/account-purpose.service';
import {ModalUtils, ToastService} from '../../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationUtils} from '../../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {AccountPurposeFormComponent} from './account-purpose-form/account-purpose-form.component';
import {Action} from '../../../../../../@core/Action';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-account-purpose-config',
  templateUrl: './account-purpose-config.component.html',
  styleUrls: ['./account-purpose-config.component.scss']
})
export class AccountPurposeConfigComponent implements OnInit {

  totalAccountPurposes = 0;
  isFilterCollapsed = true;
  accountPurposeList: Array<AccountPurpose> = new Array<AccountPurpose>();
  editPermission = false;
  spinner = false;
  pageable: Pageable = new Pageable();
  page = 1;
  filterForm: FormGroup;
  search: any = {
    name: undefined
  };

  constructor(
      private formBuilder: FormBuilder,
      private accountPurposeService: AccountPurposeService,
      private toastService: ToastService,
      private modalService: NgbModal
  ) {
  }

  static loadData(other: AccountPurposeConfigComponent) {
    other.spinner = true;
    other.accountPurposeService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
      other.accountPurposeList = response.detail.content;
      other.totalAccountPurposes = response.detail.totalElements;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Account Purposes'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    this.editPermission = localStorage.getItem('roleName') === 'admin';
    this.buildFilterForm();
    AccountPurposeConfigComponent.loadData(this);
  }

  add() {
    const modalRef = this.modalService.open(AccountPurposeFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = new AccountPurpose();
    modalRef.componentInstance.action = Action.ADD;
    ModalUtils.resolve(modalRef.result, AccountPurposeConfigComponent.loadData, this);
  }

  edit(accountType: AccountPurpose) {
    const modalRef = this.modalService.open(AccountPurposeFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = accountType;
    modalRef.componentInstance.action = Action.UPDATE;
    ModalUtils.resolve(modalRef.result, AccountPurposeConfigComponent.loadData, this);
  }

  changePage(page: number) {
    this.page = page;
    AccountPurposeConfigComponent.loadData(this);
  }

  onSearch() {
    this.search.name = ObjectUtil.isEmpty(this.filterForm.get('name').value) ? undefined : this.filterForm.get('name').value;
    AccountPurposeConfigComponent.loadData(this);
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      name: undefined
    });
  }

  clear() {
    this.buildFilterForm();
    this.isFilterCollapsed = true;
  }

}

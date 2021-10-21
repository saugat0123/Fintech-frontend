import {Component, OnInit} from '@angular/core';
import {AccountType} from '../../../../modal/accountType';
import {Pageable} from '../../../../../../@core/service/baseservice/common-pageable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AccountTypeService} from '../../service/account-type.service';
import {PaginationUtils} from '../../../../../../@core/utils/PaginationUtils';
import {ModalUtils, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountTypeFormComponent} from './account-type-form/account-type-form.component';
import {Action} from '../../../../../../@core/Action';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';

@Component({
  selector: 'app-account-type-config',
  templateUrl: './account-type-config.component.html',
  styleUrls: ['./account-type-config.component.scss']
})
export class AccountTypeConfigComponent implements OnInit {
  totalAccountTypes = 0;
  isFilterCollapsed = true;
  accountTypeList: Array<AccountType> = new Array<AccountType>();
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
      private accountTypeService: AccountTypeService,
      private toastService: ToastService,
      private modalService: NgbModal
  ) {
  }

  static loadData(other: AccountTypeConfigComponent) {
    other.spinner = true;
    other.accountTypeService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
      other.accountTypeList = response.detail.content;
      other.totalAccountTypes = response.detail.totalElements;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Account Types'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    this.editPermission = LocalStorageUtil.getStorage().roleType === 'ADMIN';
    this.buildFilterForm();
    AccountTypeConfigComponent.loadData(this);
  }

  add() {
    const modalRef = this.modalService.open(AccountTypeFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = new AccountType();
    modalRef.componentInstance.action = Action.ADD;
    ModalUtils.resolve(modalRef.result, AccountTypeConfigComponent.loadData, this);
  }

  edit(accountType: AccountType) {
    const modalRef = this.modalService.open(AccountTypeFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = accountType;
    modalRef.componentInstance.action = Action.UPDATE;
    ModalUtils.resolve(modalRef.result, AccountTypeConfigComponent.loadData, this);
  }

  changePage(page: number) {
    this.page = page;
    AccountTypeConfigComponent.loadData(this);
  }

  onSearch() {
    this.search.name = ObjectUtil.isEmpty(this.filterForm.get('name').value) ? undefined : this.filterForm.get('name').value;
    AccountTypeConfigComponent.loadData(this);
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

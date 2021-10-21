import {Component, OnInit} from '@angular/core';
import {AccountCategory} from '../../../../modal/accountCategory';
import {Pageable} from '../../../../../../@core/service/baseservice/common-pageable';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AccountCategoryService} from '../../service/account-category.service';
import {ModalUtils, ToastService} from '../../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationUtils} from '../../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {AccountCategoryFormComponent} from './account-category-form/account-category-form.component';
import {Action} from '../../../../../../@core/Action';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {AccountDocumentFormComponent} from './account-document-form/account-document-form.component';

@Component({
  selector: 'app-account-purpose-config',
  templateUrl: './account-category-config.component.html',
  styleUrls: ['./account-category-config.component.scss']
})
export class AccountCategoryConfigComponent implements OnInit {

  totalAccountCategories = 0;
  isFilterCollapsed = true;
  accountCategoryList: Array<AccountCategory> = new Array<AccountCategory>();
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
      private accountPurposeService: AccountCategoryService,
      private toastService: ToastService,
      private modalService: NgbModal
  ) {
  }

  static loadData(other: AccountCategoryConfigComponent) {
    other.spinner = true;
    other.accountPurposeService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
      other.accountCategoryList = response.detail.content;
      other.totalAccountCategories = response.detail.totalElements;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Account Categories'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    this.editPermission = LocalStorageUtil.getStorage().roleType === 'ADMIN';
    this.buildFilterForm();
    AccountCategoryConfigComponent.loadData(this);
  }

  add() {
    const modalRef = this.modalService.open(AccountCategoryFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = new AccountCategory();
    modalRef.componentInstance.action = Action.ADD;
    ModalUtils.resolve(modalRef.result, AccountCategoryConfigComponent.loadData, this);
  }

  edit(accountCategory: AccountCategory) {
    const modalRef = this.modalService.open(AccountCategoryFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = accountCategory;
    modalRef.componentInstance.action = Action.UPDATE;
    ModalUtils.resolve(modalRef.result, AccountCategoryConfigComponent.loadData, this);
  }

  document(accountCategory: AccountCategory) {
    const modalRef = this.modalService.open(AccountDocumentFormComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.model = accountCategory;
    ModalUtils.resolve(modalRef.result, AccountCategoryConfigComponent.loadData, this);
  }

  changePage(page: number) {
    this.page = page;
    AccountCategoryConfigComponent.loadData(this);
  }

  onSearch() {
    this.search.name = ObjectUtil.isEmpty(this.filterForm.get('name').value) ? undefined : this.filterForm.get('name').value;
    AccountCategoryConfigComponent.loadData(this);
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

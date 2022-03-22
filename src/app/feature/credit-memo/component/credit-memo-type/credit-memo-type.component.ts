import { Component, OnInit } from '@angular/core';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {MemoType} from '../../../memo/model/memoType';
import {Action} from '../../../../@core/Action';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditMemoTypeService} from '../../service/credit-memo-type';
import {CreditMemoType} from '../../model/credit-memo-type';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CreditMemoTypeDeleteModalComponent} from './credit-memo-type-delete-modal/credit-memo-type-delete-modal.component';
import {CreditMemoTypeFormComponent} from './credit-memo-type-form/credit-memo-type-form.component';

@Component({
  selector: 'app-credit-memo-type',
  templateUrl: './credit-memo-type.component.html'
})
export class CreditMemoTypeComponent implements OnInit {
  page = 1;

  types: Array<CreditMemoType>;

  search: any = {};

  spinner = false;
  pageable: Pageable = new Pageable();
  memoType: CreditMemoType;

  constructor(
      private memoTypeService: CreditMemoTypeService,
      private modalService: NgbModal,
      private router: Router,
      private formBuilder: FormBuilder,
      private toastService: ToastService
  ) {
  }

  static loadData(other: CreditMemoTypeComponent) {
    other.spinner = true;
    other.memoTypeService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
          other.types = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner = false;
        }, error => {
          console.error(error);
          other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Credit Memo Types'));
          other.spinner = false;
        }
    );
  }

  ngOnInit() {
    CreditMemoTypeComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    CreditMemoTypeComponent.loadData(this);
  }

  add() {
    const modalRef = this.modalService.open(CreditMemoTypeFormComponent, {backdrop: 'static'});

    modalRef.componentInstance.model = new MemoType();
    modalRef.componentInstance.action = Action.ADD;

    ModalUtils.resolve(modalRef.result, CreditMemoTypeComponent.loadData, this);
  }

  update(memoType: MemoType, memoId: number) {

    const modalRef = this.modalService.open(CreditMemoTypeFormComponent, {backdrop: 'static'});

    modalRef.componentInstance.model = memoType;
    modalRef.componentInstance.action = Action.UPDATE;
    modalRef.componentInstance.memoId = memoId;
    ModalUtils.resolve(modalRef.result, CreditMemoTypeComponent.loadData, this);
  }

  delete(memoType: MemoType) {
    this.memoType = memoType;

    const modalRef = this.modalService.open(CreditMemoTypeDeleteModalComponent);

    modalRef.componentInstance.model = memoType;
    modalRef.componentInstance.action = Action.DELETE;

    ModalUtils.resolve(modalRef.result, CreditMemoTypeComponent.loadData, this);
  }


  onSearch() {
    CreditMemoTypeComponent.loadData(this);
  }

  onSearchChange(searchValue: string) {
    this.search = {
      'name': searchValue
    };
    CreditMemoTypeComponent.loadData(this);
  }
}

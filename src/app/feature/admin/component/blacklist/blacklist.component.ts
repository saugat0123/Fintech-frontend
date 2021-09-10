import { Component, OnInit } from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {BlackList} from '../../modal/BlackList';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Action} from '../../../../@core/Action';
import {BlacklistFormComponent} from './blacklist-form/blacklist-form.component';
import {BlacklistService} from './blacklist.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {DocType} from '../../modal/docType';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.scss']
})
export class BlacklistComponent implements OnInit {

  page = 1;
  pageable: Pageable = new Pageable();
  blackList: Array<BlackList>;
  spinner = false;
  toBlacklist: BlackList;
  removeBlackListed = false;
  search: any = {};

  constructor(
      private modalService: NgbModal,
      private blackListService: BlacklistService,
      private toastService: ToastService
  ) { }

  static loadData(other: BlacklistComponent) {
    other.spinner = true;
    other.blackListService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
          other.blackList = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner = false;

        }, error => {

          other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
          other.spinner = false;
        }
    );
  }

  getDocType(blackListDocType: string) {
    return DocType[blackListDocType];
  }

  ngOnInit() {
    BlacklistComponent.loadData(this);
  }

  onSearch() {
    BlacklistComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    BlacklistComponent.loadData(this);
  }

  addExcelFile() {
    const modalRef = this.modalService.open(BlacklistFormComponent);
    modalRef.componentInstance.model = new BlackList();
    modalRef.componentInstance.action = Action.ADD;
    ModalUtils.resolve(modalRef.result, BlacklistComponent.loadData, this);

    BlacklistComponent.loadData(this);
  }

  remove(toBlackList, confirmation) {
    this.modalService.open(confirmation);
    this.toBlacklist = toBlackList;
  }

  removeBlackList(isTrue) {
    this.removeBlackListed = isTrue;

    if (this.removeBlackListed) {
      this.blackListService.removeById(this.toBlacklist.id).subscribe(() => {
        this.ngOnInit();
        this.spinner = false;
      }, () => {
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Delete Data!'));
        this.spinner = false;
      });
    }
    this.modalService.dismissAll();
  }

  clearSearch() {
    this.search.name = '';
  }
}

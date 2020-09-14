import { Component, OnInit } from '@angular/core';
import {Action} from '../../../../@core/Action';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RiskGroupFormComponent} from '../risk-group-form-component/risk-group-form.component';
import {CrgGroup} from '../../model/CrgGroup';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CrgGroupService} from '../../service/crg-group.service';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {RiskGroupDeleteComponent} from '../risk-group-delete/risk-group-delete.component';
import {Status} from '../../../../@core/Status';

@Component({
  selector: 'app-risk-group',
  templateUrl: './risk-group.component.html'
})
export class RiskGroupComponent implements OnInit {
  page = 1;

  types: Array<CrgGroup>;

  search: string;
  spinner = false;
  pageable: Pageable = new Pageable();
  crgGroup: CrgGroup;

  public statusEnum = Status;

  constructor(
      private crgGroupService: CrgGroupService,
      private modalService: NgbModal,
      private router: Router,
      private formBuilder: FormBuilder,
      private toastService: ToastService
  ) {
  }

  static loadData(other: RiskGroupComponent) {
    other.spinner = true;
    other.crgGroupService.getPaginationWithSearch(other.search, other.page, 10).subscribe((response: any) => {
          other.types = response.content;
          other.pageable = PaginationUtils.getPageable(response);
          other.spinner = false;
        }, error => {
          console.error(error);
          other.toastService.show(new Alert(AlertType.ERROR, 'Failed to Load Risk Group'));
          other.spinner = false;
        }
    );
  }

  ngOnInit() {
    RiskGroupComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;

    RiskGroupComponent.loadData(this);
  }

  onSearch() {
    RiskGroupComponent.loadData(this);
  }

  onSearchChange(searchValue: string) {
    this.search = searchValue;

    RiskGroupComponent.loadData(this);
  }

  add() {
    const modalRef = this.modalService.open(RiskGroupFormComponent, {backdrop: 'static'});

    modalRef.componentInstance.model = new CrgGroup();
    modalRef.componentInstance.action = Action.ADD;

    ModalUtils.resolve(modalRef.result, RiskGroupComponent.loadData, this);
  }

  update(crgType: CrgGroup) {

    const modalRef = this.modalService.open(RiskGroupFormComponent, {backdrop: 'static'});

    modalRef.componentInstance.model = crgType;
    modalRef.componentInstance.action = Action.UPDATE;
    ModalUtils.resolve(modalRef.result, RiskGroupComponent.loadData, this);
  }

  public updateStatus(id: number, $event: boolean): void {
    const group = new CrgGroup();
    group.id = id;
    group.status = $event ? Status.ACTIVE : Status.INACTIVE;
    this.crgGroupService.updateStatus(group).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated!!!'));
      RiskGroupComponent.loadData(this);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update!!!'));
    });
  }

  delete(crgType: CrgGroup) {
    this.crgGroup = crgType;

    const modalRef = this.modalService.open(RiskGroupDeleteComponent);

    modalRef.componentInstance.model = crgType;
    modalRef.componentInstance.action = Action.DELETE;

    ModalUtils.resolve(modalRef.result, RiskGroupComponent.loadData, this);
  }
}

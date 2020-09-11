import { Component, OnInit } from '@angular/core';
import {MemoTypeFormComponent} from '../../../memo/component/memo-type/memo-type-form/memo-type-form.component';
import {MemoType} from '../../../memo/model/memoType';
import {Action} from '../../../../@core/Action';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RiskGroupFormComponentComponent} from '../risk-group-form-component/risk-group-form-component.component';
import {RiskGroupType} from '../../model/RiskGroupType';

@Component({
  selector: 'app-risk-group',
  templateUrl: './risk-group.component.html',
  styleUrls: ['./risk-group.component.scss']
})
export class RiskGroupComponent implements OnInit {
  search = {
    name: undefined
  };
  spinner = false;
  pageable: any;

  constructor(
      private modalService: NgbModal,
      private router: Router,
      private formBuilder: FormBuilder,
      private toastService: ToastService
  ) { }

  static loadData(other: RiskGroupComponent) {

  }

  ngOnInit() {
  }

  add() {
    const modalRef = this.modalService.open(RiskGroupFormComponentComponent, {backdrop: 'static'});

    modalRef.componentInstance.model = new RiskGroupType();
    modalRef.componentInstance.action = Action.ADD;

      ModalUtils.resolve(modalRef.result, RiskGroupComponent.loadData, this);
  }

  onSearch() {

  }

  onSearchChange(value: any) {

  }

  changePage($event: number) {

  }
}

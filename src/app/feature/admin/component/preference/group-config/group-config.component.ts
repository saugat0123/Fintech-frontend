import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerGroupService} from '../services/customer-group.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerGroup} from '../../../modal/customer-group';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {CustomValidator} from '../../../../../@core/validator/custom-validator';

@Component({
  selector: 'app-group-config',
  templateUrl: './group-config.component.html',
  styleUrls: ['./group-config.component.scss']
})
export class GroupConfigComponent implements OnInit {
  customerGroups: Array<CustomerGroup>;
  spinner = false;
  groupForm: FormGroup;
  page = 1;
  pageable: Pageable = new Pageable();
  action = 'Create';

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private customerGroupService: CustomerGroupService,
              private toastService: ToastService) {
  }

  static loadData(other: GroupConfigComponent) {
    other.customerGroupService.getPaginationWithSearchObject({}, 1 , 10).subscribe(response => {
      other.customerGroups = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, res => {
      other.toastService.show(new Alert(AlertType.SUCCESS, 'failed to load groups'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    this.buildForm();
    GroupConfigComponent.loadData(this);
  }

   onSubmit() {
    this.spinner = true;
    this.customerGroupService.save(this.groupForm.value).subscribe(value => {
      GroupConfigComponent.loadData(this);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved !!'));
       this.spinner = false;
    }, res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, res.error.message));
       this.spinner = false;
    });
    this.modalService.dismissAll();
  }

  buildForm() {
    this.groupForm = this.formBuilder.group({
      groupCode: [undefined, [Validators.required, Validators.minLength(6) , CustomValidator.notEmpty]],
      groupLimit: [undefined, [Validators.required , CustomValidator.notEmpty]],
      id: [undefined],
      version: [undefined]
    });
  }

  async openGroupModal(group) {
    this.action = 'Create';
   await this.buildForm();
    this.modalService.open(group);
  }

  dismissModal() {
    this.modalService.dismissAll();
  }

  changePage(page: number) {
    this.page = page;

    GroupConfigComponent.loadData(this);
  }

  async editItem(modal , data) {
    this.action = 'Edit';
    await this.groupForm.patchValue(data);
    this.modalService.open(modal);
  }
}


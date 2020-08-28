import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerGroup} from '../../../../admin/modal/customer-group';
import {CustomerGroupService} from '../../../../admin/component/preference/services/customer-group.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {TemplateName} from '../../../model/templateName';

@Component({
  selector: 'app-group-tagging',
  templateUrl: './group-tagging.component.html',
  styleUrls: ['./group-tagging.component.scss']
})
export class GroupTaggingComponent implements OnInit {

  // @ts-ignore
  @Input() customerData: any;
  customerGroupForm: FormGroup;
  customerGroups: CustomerGroup[] = [];
  searchObj = {
    groupCode: undefined
  };
  spinner = true;
  page = 1;
  size = 10;
  totalPages = 0;
  pageNo = 1;
  edited = false;
  showSaveButton = false;

  constructor(private customerGroupService: CustomerGroupService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private customerInfoService: CustomerInfoService) {
  }

  static loadData(other: GroupTaggingComponent) {
    other.spinner = true;
    other.customerGroupService.getPaginationWithSearchObject(other.searchObj, other.page, other.size).subscribe(response => {
      other.customerGroups = response.detail.content;
      other.totalPages = response.detail.totalPages;
      other.pageNo = response.detail.pageable.pageNumber + 2;
    });
    other.spinner = false;
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.customerData.customerGroup)) {
      this.setValue(this.customerData.customerGroup);
    }
    GroupTaggingComponent.loadData(this);
  }

  onScrollDown() {
    GroupTaggingComponent.loadData(this);
  }

  buildForm() {
    this.customerGroupForm = this.formBuilder.group({
      groupCode: [undefined, [Validators.required, Validators.minLength(6)]],
      id: [undefined],
      version: [undefined]
    });
  }

  searchCustomerGroup(groupCode) {
    this.searchObj.groupCode = groupCode;
    GroupTaggingComponent.loadData(this);
  }

  clickEdit() {
    this.edited = !this.edited;
  }

  setValue(customerGroup) {
    this.customerGroupForm.patchValue(customerGroup);
  }

  onSubmit() {
    this.spinner = true;
    this.customerData.customerGroup = this.customerGroupForm.value;
    this.customerInfoService.saveLoanInfo(this.customerGroupForm.value, this.customerData.id,
      TemplateName.CUSTOMER_GROUP).subscribe(response => {
      this.customerData = response.detail;
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
    }, res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, res.error.message));
    });
  }
}

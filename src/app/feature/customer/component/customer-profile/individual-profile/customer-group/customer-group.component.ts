import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Editor} from '../../../../../../@core/utils/constants/editor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MGroupService} from '../../../../service/mgroup.service';
import {MGroup} from '../../../../model/mGroup';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.scss']
})
export class CustomerGroupComponent implements OnInit {

  @Input() customerInfo: CustomerInfoData;
  @Output() responseData: EventEmitter<MGroup> = new EventEmitter();

  form: FormGroup;

  submitted = false;

  ckeConfig = Editor.CK_CONFIG;
  mGroupInfo: MGroup = new MGroup();
   spinner = false;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private mGroupService: MGroupService) {
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit() {
    this.buildForm();
    console.log(this.customerInfo);
    console.log(this.customerInfo.mgroupInfo);
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
      this.mGroupInfo = this.customerInfo.mgroupInfo;
      console.log(this.mGroupInfo);
      this.form.patchValue(this.mGroupInfo);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      groupCode: [undefined, Validators.required],
      detailInformation: [undefined, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner = true;
    this.mGroupInfo = this.setMGroupValue();
    this.mGroupService.save(this.mGroupInfo).subscribe((response) => {
      this.responseData.emit(response.detail);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Group'));
      this.spinner = false;
    }, error => {
      console.log(error);

      this.toastService.show(new Alert(AlertType.ERROR, 'Error while saving: ' + error));
      this.spinner = false;
    });
  }

  setMGroupValue() {
    let mGroup = new MGroup();
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)){
      mGroup = this.customerInfo.mgroupInfo;
    }
    mGroup.customerInfoId = this.customerInfo.id;
    mGroup.groupCode = this.formControls.groupCode.value;
    mGroup.detailInformation = this.formControls.detailInformation.value;
    return mGroup;
  }

}

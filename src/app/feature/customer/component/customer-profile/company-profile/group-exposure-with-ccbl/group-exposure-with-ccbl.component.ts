import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';
import {MGroup} from '../../../../model/mGroup';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';
import {ToastService} from '../../../../../../@core/utils';
import {MGroupService} from '../../../../service/mgroup.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {CcblTable} from './ccbl-table';

@Component({
  selector: 'app-group-exposure-with-ccbl',
  templateUrl: './group-exposure-with-ccbl.component.html',
  styleUrls: ['./group-exposure-with-ccbl.component.scss']
})
export class GroupExposureWithCcblComponent implements OnInit {
  @Input() customerInfo: CustomerInfoData;
  @Output() responseData: EventEmitter<MGroup> = new EventEmitter();
  calendarType: CalendarType;

  form: FormGroup;

  submitted = false;

  ckeConfig = Editor.CK_CONFIG;
  mGroupInfo: MGroup = new MGroup();
  spinner = false;
  default_table: any;
  outstandingOverdueTable: any;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private mGroupService: MGroupService) {
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit() {

    this.buildForm();
    this.patchInitialTable();
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
      this.mGroupInfo = this.customerInfo.mgroupInfo;
      this.form.patchValue(this.mGroupInfo);
      if (ObjectUtil.isEmpty(this.mGroupInfo.detailInformation)) {
        this.form.get('detailInformation').patchValue(CcblTable.default_table());
      }
      if (ObjectUtil.isEmpty(this.mGroupInfo.outstandingOverdue)){
        this.form.get('outstandingOverdue').patchValue(CcblTable.outstandingOverdueTable());
      }

      if (ObjectUtil.isEmpty(this.mGroupInfo.groupPosition)){
        this.form.get('groupPosition').patchValue(CcblTable.groupPosition());
      }
    }

  }

  patchInitialTable(): void {
    this.form.patchValue({
      detailInformation: CcblTable.default_table(),
      outstandingOverdue: CcblTable.outstandingOverdueTable(),
      groupPosition: CcblTable.groupPosition()
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      groupExposureDateType: [undefined],
      groupExposureDate: [undefined],
      detailInformation: [this.default_table],
      groupName: [undefined],
      groupCode: [undefined],
      outstandingOverdue: [undefined],
      groupPosition: [undefined]
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Group Exposure'));
      this.spinner = false;
    }, error => {
      console.log(error);

      this.toastService.show(new Alert(AlertType.ERROR, 'Error while saving: ' + error));
      this.spinner = false;
    });
  }

  setMGroupValue() {
    let mGroup = new MGroup();
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
      mGroup = this.customerInfo.mgroupInfo;
    }
    mGroup.customerInfoId = this.customerInfo.id;
    mGroup.groupExposureDateType = this.formControls.groupExposureDateType.value;
    mGroup.detailInformation = this.formControls.detailInformation.value;
    mGroup.groupExposureDate = this.formControls.groupExposureDate.value;
    mGroup.groupName = this.formControls.groupName.value;
    mGroup.groupCode = this.formControls.groupCode.value;
    mGroup.outstandingOverdue = this.formControls.outstandingOverdue.value;
    mGroup.groupPosition = this.formControls.groupPosition.value;
    return mGroup;
  }

}

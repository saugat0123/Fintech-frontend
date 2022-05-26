import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';
import {MGroup} from '../../../../model/mGroup';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
      if (ObjectUtil.isEmpty(this.mGroupInfo.detailInformation)) {
        this.form.get('detailInformation').patchValue(CcblTable.default_table());
      }
      if (ObjectUtil.isEmpty(this.mGroupInfo.outstandingOverdue)) {
        this.form.get('outstandingOverdue').patchValue(CcblTable.outstandingOverdueTable());
      }
      this.setGroupPosition(JSON.parse(this.mGroupInfo.groupPosition));
      this.form.patchValue(this.mGroupInfo);

      // if (ObjectUtil.isEmpty(this.mGroupInfo.groupPosition)){
      //   this.form.get('groupPosition').patchValue(CcblTable.groupPosition());
      // }
    } else {
      this.addGroupPosition();
    }

  }

  patchInitialTable(): void {
    this.form.patchValue({
      detailInformation: CcblTable.default_table(),
      outstandingOverdue: CcblTable.outstandingOverdueTable(),
      // groupPosition: CcblTable.groupPosition()
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
      // groupPosition: [undefined],
      groupLimit: this.formBuilder.array([]),
      totalExFunded: [0],
      totalExNonFunded: [0],
      totalExTotal: [0],
      totalProFunded: [0],
      totalProNonFunded: [0],
      totalProTotal: [0],
      totalChanges: [0],
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
    const totalAmount = {
      totalExFunded: this.form.get('totalExFunded').value,
      totalExNonFunded: this.form.get('totalExNonFunded').value,
      totalExTotal: this.form.get('totalExTotal').value,
      totalProFunded: this.form.get('totalProFunded').value,
      totalProNonFunded: this.form.get('totalProNonFunded').value,
      totalProTotal: this.form.get('totalProTotal').value,
      totalChanges: this.form.get('totalChanges').value,
    };
    console.log('totalAmount', totalAmount);
    console.log('stringify totalAmount', JSON.stringify(totalAmount));
    const groupLimit = this.form.get('groupLimit') as FormArray;
    mGroup.customerInfoId = this.customerInfo.id;
    mGroup.groupExposureDateType = this.formControls.groupExposureDateType.value;
    mGroup.detailInformation = this.formControls.detailInformation.value;
    mGroup.groupExposureDate = this.formControls.groupExposureDate.value;
    mGroup.groupName = this.formControls.groupName.value;
    mGroup.groupCode = this.formControls.groupCode.value;
    mGroup.outstandingOverdue = this.formControls.outstandingOverdue.value;
    mGroup.groupPosition = JSON.stringify(groupLimit.value);
    mGroup.totalAmount = JSON.stringify(totalAmount);
    return mGroup;
  }

  addGroupPosition() {
    (this.form.get('groupLimit') as FormArray).push(
        this.formBuilder.group({
          concernName: [undefined],
          exFunded: [0],
          exNonFunded: [0],
          exTotal: [0],
          proFunded: [0],
          proNonFunded: [0],
          proTotal: [0],
          changeAmount: [0]
        })
    );
  }

  calculateTotalAmount() {
    let exTotal = 0;
    let proTotal = 0;
    let exFunded = 0;
    let exNonFunded = 0;
    let proFunded = 0;
    let proNonFunded = 0;
    let changeAmount = 0;
    const array = this.form.get('groupLimit') as FormArray;
    array.value.forEach((arr, i) => {
      exFunded += Number(arr.exFunded);
      exNonFunded += Number(arr.exNonFunded);
      exTotal += Number(arr.exTotal);
      proFunded += Number(arr.proFunded);
      proNonFunded += Number(arr.proNonFunded);
      proTotal += Number(arr.proTotal);
      changeAmount += Number(arr.changeAmount);
    });
    this.form.get('totalExFunded').patchValue(exFunded.toFixed(2));
    this.form.get('totalExNonFunded').patchValue(exNonFunded.toFixed(2));
    this.form.get('totalExTotal').patchValue(exTotal.toFixed(2));
    this.form.get('totalProFunded').patchValue(proFunded.toFixed(2));
    this.form.get('totalProNonFunded').patchValue(proNonFunded.toFixed(2));
    this.form.get('totalProTotal').patchValue(proTotal.toFixed(2));
    this.form.get('totalChanges').patchValue(changeAmount.toFixed(2));
  }

  removeData(i: number) {
    (this.form.get('groupLimit') as FormArray).removeAt(i);
  }

  calculateTotal(index: number) {
    let existingTotal = 0;
    let proposedTotal = 0;
    let totalChange = 0;
    existingTotal = this.form.get(['groupLimit', index, 'exNonFunded']).value +
        this.form.get(['groupLimit', index, 'exFunded']).value;
    this.form.get(['groupLimit', index, 'exTotal']).patchValue(Number(existingTotal).toFixed(2));
    proposedTotal = this.form.get(['groupLimit', index, 'proFunded']).value +
        this.form.get(['groupLimit', index, 'proNonFunded']).value;
    this.form.get(['groupLimit', index, 'proTotal']).patchValue(Number(proposedTotal).toFixed(2));
    totalChange = proposedTotal - existingTotal;
    this.form.get(['groupLimit', index, 'changeAmount']).patchValue(Number(totalChange).toFixed(2));
    this.calculateTotalAmount();
  }

  setGroupPosition(data) {
    const groupData = this.form.get('groupLimit') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach((d) => {
        groupData.push(
            this.formBuilder.group({
              concernName: [d.concernName],
              exFunded: [d.exFunded],
              exNonFunded: [d.exNonFunded],
              exTotal: [d.exTotal],
              proFunded: [d.proFunded],
              proNonFunded: [d.proNonFunded],
              proTotal: [d.proTotal],
              changeAmount: [d.changeAmount],
            })
        );
      });
    }
  }
}

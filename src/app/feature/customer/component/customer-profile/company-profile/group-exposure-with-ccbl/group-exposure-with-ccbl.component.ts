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
  @Output() triggerCustomerRefresh = new EventEmitter<boolean>();
  calendarType: CalendarType;

  form: FormGroup;

  submitted = false;

  ckeConfig = Editor.CK_CONFIG;
  mGroupInfo: MGroup = new MGroup();
  spinner = false;
  default_table: any;
  outstandingOverdueTable: any;
  isAboveTen = false;
  isBelowTen = false;
  isWholeSale = false;
  isSana = false;

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
    this.checkCustomerCategory(this.customerInfo.customerCategory);
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
      this.mGroupInfo = this.customerInfo.mgroupInfo;
      if (ObjectUtil.isEmpty(this.mGroupInfo.detailInformation)) {
        this.form.get('detailInformation').patchValue(CcblTable.default_table());
      }
      if (ObjectUtil.isEmpty(this.mGroupInfo.outstandingOverdue)) {
        this.form.get('outstandingOverdue').patchValue(CcblTable.outstandingOverdueTable());
      }
      const totalAmount = JSON.parse(this.mGroupInfo.totalAmount);
      if (!ObjectUtil.isEmpty(totalAmount)) {
        this.form.patchValue(totalAmount);
      }
      this.setGroupPosition(JSON.parse(this.mGroupInfo.groupPosition));
      this.setCompanyName(JSON.parse(this.mGroupInfo.companyGroup));
      this.form.get('groupName').patchValue(this.mGroupInfo.groupName);
      this.form.get('groupCode').patchValue(this.mGroupInfo.groupCode);
      this.form.get('groupExposureDateType').patchValue(this.mGroupInfo.groupExposureDateType);
      this.form.get('groupExposureDate').patchValue(this.mGroupInfo.groupExposureDate ?
          new Date(this.mGroupInfo.groupExposureDate) : undefined);
      this.form.get('detailInformation').patchValue(this.mGroupInfo.detailInformation);
      this.form.get('outstandingOverdue').patchValue(this.mGroupInfo.outstandingOverdue);
    } else {
      this.addGroupPosition();
      this.addCompany();
    }

  }

  patchInitialTable(): void {
    this.form.patchValue({
      detailInformation: CcblTable.default_table(),
      outstandingOverdue: CcblTable.outstandingOverdueTable(),
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
      groupLimit: this.formBuilder.array([]),
      totalExFunded: [0],
      totalExNonFunded: [0],
      totalExTotal: [0],
      totalProFunded: [0],
      totalProNonFunded: [0],
      totalProTotal: [0],
      totalChanges: [0],
      companyGroup: this.formBuilder.array([])
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
      this.triggerCustomerRefresh.emit(true);
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
    const groupLimit = this.form.get('groupLimit') as FormArray;
    const companyGroup = this.form.get('companyGroup') as FormArray;
    mGroup.customerInfoId = this.customerInfo.id;
    mGroup.groupExposureDateType = this.formControls.groupExposureDateType.value;
    mGroup.detailInformation = this.formControls.detailInformation.value;
    mGroup.groupExposureDate = this.formControls.groupExposureDate.value;
    mGroup.groupName = this.formControls.groupName.value;
    mGroup.groupCode = this.formControls.groupCode.value;
    mGroup.outstandingOverdue = this.formControls.outstandingOverdue.value;
    mGroup.groupPosition = JSON.stringify(groupLimit.value);
    mGroup.companyGroup = JSON.stringify(companyGroup.value);
    // mGroup.companyGroup = companyGroup.value;
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
          changeAmount: [0],
          pricing: [undefined],
          maturity: [undefined],
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

  removeData(i: number, formArrayName) {
    (this.form.get(formArrayName) as FormArray).removeAt(i);
    this.calculateTotalAmount();
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
              pricing: [d.pricing],
              maturity: [d.maturity],
            })
        );
      });
    }
  }

  addCompany() {
    (this.form.get('companyGroup') as FormArray).push(
        this.formBuilder.group({
          name: [undefined]
        })
    );
  }

  setCompanyName(data) {
    const cName = this.form.get('companyGroup') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(d => {
        cName.push(
            this.formBuilder.group({
              name: [d.name]
            })
        );
      });
    }
  }

  checkCustomerCategory(value) {
    if (value === 'SME_ABOVE_TEN_MILLION' || value === 'AGRICULTURE_ABOVE_TEN_MILLION') {
      this.isAboveTen = true;
    } else if (value === 'SME_UPTO_TEN_MILLION' ||
        value === 'AGRICULTURE_UPTO_TWO_MILLION' ||
        value === 'AGRICULTURE_TWO_TO_TEN_MILLION') {
      this.isBelowTen = true;
    } else if (value === 'SANA_BYABASAYI') {
      this.isSana = true;
    } else {
      this.isWholeSale = true;
    }
  }
}

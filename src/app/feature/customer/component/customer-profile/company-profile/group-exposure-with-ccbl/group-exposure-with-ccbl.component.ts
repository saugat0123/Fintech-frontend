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

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private mGroupService: MGroupService) {
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit() {
    this.default_table = '<table border="1" cellpadding="1" cellspacing="1" style="width:100%">\n' +
        '<tbody>\n' +
        '<tr>\n' +
        '<td colspan="2" rowspan="2" style="text-align:center">Group concerns/facilities</td>\n' +
        '<td colspan="3" rowspan="1" style="text-align:center">Existing</td>\n' +
        '<td style="text-align:center">O/S</td>\n' +
        '<td colspan="2" rowspan="1" style="text-align:center">Overdue</td>\n' +
        '<td colspan="2" rowspan="1" style="text-align:center">R/E Collateral</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="text-align:center">FB Limit</td>\n' +
        '<td style="text-align:center">NFB Limit</td>\n' +
        '<td style="text-align:center">Total</td>\n' +
        '<td style="text-align:center">Principal</td>\n' +
        '<td style="text-align:center">Principal</td>\n' +
        '<td style="text-align:center">Interest</td>\n' +
        '<td style="text-align:center">FMV</td>\n' +
        '<td style="text-align:center">DV</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">1.</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td colspan="1" rowspan="5">&nbsp;</td>\n' +
        '<td colspan="1" rowspan="5">&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td></td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '</tbody>\n' +
        '</table>\n' +
        '\n' +
        '<p>&nbsp;</p>';
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
      this.mGroupInfo = this.customerInfo.mgroupInfo;
      this.form.patchValue(this.mGroupInfo);
      if (ObjectUtil.isEmpty(this.mGroupInfo.detailInformation)) {
        this.form.get('detailInformation').patchValue(this.default_table);
      }
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      groupExposureDateType: [undefined],
      groupExposureDate: [undefined],
      detailInformation: [this.default_table],
      groupName: [undefined],
      groupCode: [undefined],
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
    return mGroup;
  }

}

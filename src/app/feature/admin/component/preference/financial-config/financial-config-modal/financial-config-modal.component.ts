import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import {Status} from '../../../../../../@core/Status';
import {FiscalYearService} from '../../../../service/fiscal-year.service';
import {FiscalYear} from '../../../../modal/FiscalYear';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-financial-config-modal',
  templateUrl: './financial-config-modal.component.html',
  styleUrls: ['./financial-config-modal.component.scss']
})
export class FinancialConfigModalComponent implements OnInit {
  calendarType = CalendarType.AD;

  quarterForm: FormGroup;
  fiscalYear: FiscalYear;
  spinner = false;

  constructor(private formBuilder: FormBuilder,
              protected dialogRef: NbDialogRef<FinancialConfigModalComponent>,
              private fiscalYearService: FiscalYearService,
              private toastService: ToastService) {
  }

  get form() {
    return this.quarterForm.controls;
  }

  ngOnInit() {
    this.buildQuarterForm();
  }

  buildQuarterForm() {
    this.quarterForm = this.formBuilder.group({
      year: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.year, Validators.required],
      isCurrentYear: [ObjectUtil.isEmpty(this.fiscalYear) ? false : this.fiscalYear.isCurrentYear, Validators.required],
      status: [ObjectUtil.isEmpty(this.fiscalYear) ? Status.ACTIVE : this.fiscalYear.status],
      qOneStartDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qOneStartDate, Validators.required],
      qOneEndDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qOneEndDate, Validators.required],
      qTwoStartDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qThreeStartDate, Validators.required],
      qTwoEndDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qTwoEndDate, Validators.required],
      qThreeStartDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qThreeStartDate, Validators.required],
      qThreeEndDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qTwoEndDate, Validators.required],
      qFourStartDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qFourStartDate, Validators.required],
      qFourEndDate: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.qFourEndDate, Validators.required],
      id: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.id],
      version: [ObjectUtil.isEmpty(this.fiscalYear) ? undefined : this.fiscalYear.version],
    });
  }

  onSubmit() {
    this.fiscalYear = this.quarterForm.value;
    this.spinner = true;
    this.fiscalYearService.save(this.fiscalYear).subscribe(() => {
      if (this.fiscalYear.id == null) {
        this.onClose();
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Fiscal year'));
      } else {
        this.onClose();
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Fiscal year'));
      }
    }, res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, res.error.message));
      this.onClose();
      this.spinner = false;
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}

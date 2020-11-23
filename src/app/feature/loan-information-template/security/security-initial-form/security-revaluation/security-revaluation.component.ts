import {Component, Input, OnInit} from '@angular/core';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-revaluation',
  templateUrl: './security-revaluation.component.html',
  styleUrls: ['./security-revaluation.component.scss']
})
export class SecurityRevaluationComponent implements OnInit {
  @Input() calendarType: CalendarType;
  @Input() revaluationId: string;
  @Input() data;
  @Input() valuators;
  formGroup: FormGroup;
  submitValue;

  constructor( private valuatorService: ValuatorService,
               private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      isReValuated: [false],
      reValuationDate: [undefined , Validators.required],
      reValuatedFmv: [undefined , Validators.required],
      reValuatedDv: [undefined , Validators.required],
      reValuatedConsideredValue: [undefined , Validators.required],
      newValuator: [undefined , Validators.required],
    });
    if (!ObjectUtil.isEmpty(this.data)) {
      this.formGroup.patchValue(this.data);
      this.formGroup.get('reValuationDate').setValue(new Date(this.data.reValuationDate));
    }
  }

  get formControls() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitValue = this.formGroup.value;
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CalendarType} from '../../@core/model/calendar-type';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-crg',
  templateUrl: './crg-individual.component.html',
  styleUrls: ['./crg-individual.component.scss']
})
export class CrgIndividualComponent implements OnInit {
  @Output() crgChecklistEmitter = new EventEmitter();
  @Input() fromProfile;
  @Input() formData;
  @Input() calendarType: CalendarType;
  crgChecklistFormGroup: FormGroup;
  crgChecklist;
  dataForEdit;
  optionList = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.crgChecklist = this.formData;
      this.dataForEdit = JSON.parse(this.formData);
      this.crgChecklistFormGroup.patchValue(this.dataForEdit);
      this.crgChecklistFormGroup.patchValue({
        dateCheckList: new Date(this.dataForEdit.dateCheckList)
      });
    }
  }

  private buildForm() {
    this.crgChecklistFormGroup = this.formBuilder.group({
      dateCheckList: undefined,
      networth: undefined,
      qualityofAssets: undefined,
      levelOfIncome: undefined,
      relationship: undefined,
    });
  }

  save() {
    this.overlay.show();
    this.crgChecklist = JSON.stringify(this.crgChecklistFormGroup.value);
    this.crgChecklistEmitter.emit(this.crgChecklist);
  }
}

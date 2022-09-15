import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-crg-long',
  templateUrl: './crg-institution.component.html',
  styleUrls: ['./crg-institution.component.scss']
})
export class CrgInstitutionComponent implements OnInit {
  @Output() crgLongChecklistEmitter = new EventEmitter();
  @Input() fromProfile;
  @Input() formData;
  @Input() calendarType: CalendarType;
  crgLongChecklistFormGroup: FormGroup;
  crgLongChecklist;
  dataForEdit;
  optionList = ['1', '2', '3', '4', '5', '6', '7', '8'];
  totalCRG: number;
  checkCRG = [];

  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.crgLongChecklist = this.formData;
      this.dataForEdit = JSON.parse(this.formData);
      this.crgLongChecklistFormGroup.patchValue(this.dataForEdit);
      this.crgLongChecklistFormGroup.patchValue({
        dateCheckList: new Date(this.dataForEdit.dateCheckList)
      });
    }
    this.checks();
  }

  private buildForm() {
    this.crgLongChecklistFormGroup = this.formBuilder.group({
      dateCheckList: undefined,
      industryMarket: undefined,
      marketPosition: undefined,
      supplierRelationship: undefined,
      margins: undefined,
      liquidity: undefined,
      financialSupport: undefined,
      financialStructure: undefined,
      planning: undefined,
      relationshipWith: undefined,
      managementCapability: undefined,
      envThreats: undefined
    });
  }

  save() {
    this.overlay.show();
    this.crgLongChecklist = JSON.stringify(this.crgLongChecklistFormGroup.value);
    this.crgLongChecklistEmitter.emit(this.crgLongChecklist);
  }

  checks() {
    const data = this.crgLongChecklistFormGroup.value;
    const keys = Object.keys(data);
    let total = 0;
    let index = 0;
    keys.forEach(k => {
      if (k !== 'dateCheckList') {
        if (!ObjectUtil.isEmpty(data[k])) {
          index++;
        }
        total += Number(data[k]);
      }
    });
    this.totalCRG = total / index;
  }
}

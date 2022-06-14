import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-other-security',
  templateUrl: './other-security.component.html',
  styleUrls: ['./other-security.component.scss']
})
export class OtherSecurityComponent implements OnInit {
  otherSecurityForm: FormGroup;
  ckeConfig;
  @Input() security: Security;
  @Input() isEdit = false;
  @Input() calendarType: CalendarType;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.configEditor();
    if (this.isEdit) {
      this.setOtherSecurity();
    } else {
      this.addOtherSecurity();
    }
  }

  setOtherSecurity() {
    const formData = JSON.parse(this.security.data);
    const otherSecurityData = this.otherSecurityForm.get('otherSecurity') as FormArray;
    otherSecurityData.push(
        this.formBuilder.group({
          otherDetail: [formData.otherDetail],
          considerValue: [formData.considerValue],
          distressValue: [formData.distressValue],
          fairMarketValue: [formData.fairMarketValue],
          otherSecurityFirstValuationDate: [formData.otherSecurityFirstValuationDate ? new Date(formData.otherSecurityFirstValuationDate) : '']
        })
    );
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.otherSecurityForm = this.formBuilder.group({
      otherSecurity: this.formBuilder.array([]),
    });
  }

  private otherSecurityDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          otherDetail: [undefined],
          considerValue: 0,
          distressValue: [undefined],
          fairMarketValue: [undefined],
          otherSecurityFirstValuationDate: [undefined]
        }
    );
  }

  public addOtherSecurity(): void {
    (this.otherSecurityForm.get('otherSecurity') as FormArray).push(this.otherSecurityDetailsFormGroup());
  }

  public removeOtherSecurity(idx: number): void {
    (this.otherSecurityForm.get('otherSecurity') as FormArray).removeAt(idx);
  }

}

import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-other-security',
  templateUrl: './other-security.component.html',
  styleUrls: ['./other-security.component.scss']
})
export class OtherSecurityComponent implements OnInit {
  otherSecurityForm: FormGroup;
  ckeConfig;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.configEditor();
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.otherSecurityForm = this.formBuilder.group({
      otherSecurity: this.formBuilder.array([this.otherSecurityDetailsFormGroup()]),
    });
  }

  private otherSecurityDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          otherDetail: [undefined],
          considerValue: 0,
          distressValue: [undefined],
          fairMarketValue: [undefined]
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

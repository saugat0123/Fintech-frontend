import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-other-security',
  templateUrl: './other-security.component.html',
  styleUrls: ['./other-security.component.scss']
})
export class OtherSecurityComponent implements OnInit {
  otherSecurity: FormGroup;
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
    return this.otherSecurity = this.formBuilder.group({
      otherSecurity: this.formBuilder.array([]),
    });
  }

  private otherSecurityDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
        otherDetail: [undefined],
        }
    );
  }

  public addOtherSecurity(): void {
    (this.otherSecurity.get('otherSecurity') as FormArray).push(this.otherSecurityDetailsFormGroup());
  }

  public removeOtherSecurity(idx: number): void {
    (this.otherSecurity.get('otherSecurity') as FormArray).removeAt(idx);
  }

}

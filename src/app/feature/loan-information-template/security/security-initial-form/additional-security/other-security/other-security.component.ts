import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-other-security',
  templateUrl: './other-security.component.html',
  styleUrls: ['./other-security.component.scss']
})
export class OtherSecurityComponent implements OnInit {
  otherSecurityForm: FormGroup;
  ckeConfig = Editor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.otherSecurityForm = this.formBuilder.group({
      otherSecurity: this.formBuilder.array([this.buildOtherSecurityFormGroup()]),
    });
  }

  private buildOtherSecurityFormGroup(): FormGroup {
    return this.formBuilder.group({
      otherDetail: [undefined],
    });
  }
}

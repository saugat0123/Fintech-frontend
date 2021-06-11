import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-personal-guarantee-security',
  templateUrl: './personal-guarantee-security.component.html',
  styleUrls: ['./personal-guarantee-security.component.scss']
})
export class PersonalGuaranteeSecurityComponent implements OnInit {
  personalGuaranteeForm: FormGroup;
  ckeConfig = Editor.CK_CONFIG;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.personalGuaranteeForm = this.formBuilder.group({
      personalGuarantee: this.formBuilder.array([this.personalDetailsFormGroup()])
    });
  }
  private personalDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          name: [undefined, Validators.required],
          address: [undefined],
          email: [undefined],
          phoneNumber: [undefined],
          owner: [undefined],
          otherDetail: [undefined],
        }
    );
  }

  public removePersonalGuaranteeForm(index: number): void {
    (<FormArray>this.personalGuaranteeForm.get('personalGuarantee')).removeAt(index);
  }

  public addPersonalGuaranteeForm(): void {
    (this.personalGuaranteeForm.get('personalGuarantee') as FormArray).push(this.personalDetailsFormGroup());
  }
}

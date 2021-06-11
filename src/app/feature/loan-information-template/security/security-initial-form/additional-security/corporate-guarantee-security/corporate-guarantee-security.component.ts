import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-corporate-guarantee-security',
  templateUrl: './corporate-guarantee-security.component.html',
  styleUrls: ['./corporate-guarantee-security.component.scss']
})
export class CorporateGuaranteeSecurityComponent implements OnInit {
  corporateGuaranteeForm: FormGroup;
  ckeConfig = Editor.CK_CONFIG;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.corporateGuaranteeForm = this.formBuilder.group({
      corporateGuarantee: this.formBuilder.array([this.corporateDetailsFormGroup()])
    });
  }

  private corporateDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          name: [undefined, Validators.required],
          address: [undefined],
          keyPerson: [undefined],
          email: [undefined],
          phoneNumber: [undefined],
          otherDetail: [undefined],
        }
    );
  }

  public removeCorporate(index: number): void {
    (<FormArray>this.corporateGuaranteeForm.get('corporateGuarantee')).removeAt(index);

  }

  public addCorporateGuarantee(): void {
    (this.corporateGuaranteeForm.get('corporateGuarantee') as FormArray).push(this.corporateDetailsFormGroup());
  }
}

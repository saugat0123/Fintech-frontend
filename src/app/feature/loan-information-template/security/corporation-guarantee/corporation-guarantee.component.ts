import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-corporation-guarantee',
  templateUrl: './corporation-guarantee.component.html',
  styleUrls: ['./corporation-guarantee.component.scss']
})
export class CorporationGuaranteeComponent implements OnInit {
  corporateForm: FormGroup;
  submitted = false;
  ckeConfig;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configEditor();
    this.buildForm();
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.corporateForm = this.formBuilder.group({
      corporateGuarantee: this.formBuilder.array([this.corporateDetailsFormGroup()])
    });
  }

  public addCorporateGuarantee(): void {
    (this.corporateForm.get('corporateGuarantee') as FormArray).push(this.corporateDetailsFormGroup());
  }

  public removeCorporate(index: number): void {
    (<FormArray>this.corporateForm.get('corporateGuarantee')).removeAt(index);
  }

  public corporateDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          name: [undefined, Validators.required],
          address: [undefined],
          keyPerson: [undefined],
          email: [undefined],
          phoneNumber: [undefined],
          considerValue: 0,
          fairMarketValue: [undefined],
          distressValue: [undefined],
          otherDetail: [undefined],
        }
    );
  }

}

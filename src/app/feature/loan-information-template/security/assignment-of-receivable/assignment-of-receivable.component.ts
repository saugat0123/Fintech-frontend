import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-assignment-of-receivable',
  templateUrl: './assignment-of-receivable.component.html',
  styleUrls: ['./assignment-of-receivable.component.scss']
})
export class AssignmentOfReceivableComponent implements OnInit {
  assignmentForm: FormGroup;
  submitted = false;
  ckeConfig;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('assignment receivable');
    this.configEditor();
    this.buildForm();
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.assignmentForm = this.formBuilder.group({
      assignmentOfReceivables: this.formBuilder.array([this.assignmentDetailsFormGroup()])
    });

  }

  public addAssignment(): void {
    (this.assignmentForm.get('assignmentOfReceivables') as FormArray).push(this.assignmentDetailsFormGroup());
  }

  public removeAssignment(index: number): void {
    (<FormArray>this.assignmentForm.get('assignmentOfReceivables')).removeAt(index);
  }

  public assignmentDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          amount: [undefined, Validators.required],
          considerValue: 0,
          distressValue: [undefined],
          fairMarketValue: [undefined],
          otherDetail: [undefined]
        }
    );
  }

}

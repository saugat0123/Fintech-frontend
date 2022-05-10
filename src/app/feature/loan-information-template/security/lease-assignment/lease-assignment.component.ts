import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-lease-assignment',
  templateUrl: './lease-assignment.component.html',
  styleUrls: ['./lease-assignment.component.scss']
})
export class LeaseAssignmentComponent implements OnInit {
  leaseAssignmentForm: FormGroup;
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
    return this.leaseAssignmentForm = this.formBuilder.group({
      leaseAssignment: this.formBuilder.array([this.assignmentsDetailsFormGroup()]),
    });
  }

  private assignmentsDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          otherDetail: [undefined],
          considerValue: 0,
          distressValue: [undefined],
          fairMarketValue: [undefined]
        }
    );
  }

  public addAssignments(): void {
    (this.leaseAssignmentForm.get('leaseAssignment') as FormArray).push(this.assignmentsDetailsFormGroup());
  }

  public removeAssignments(idx: number): void {
    (this.leaseAssignmentForm.get('leaseAssignment') as FormArray).removeAt(idx);
  }

}

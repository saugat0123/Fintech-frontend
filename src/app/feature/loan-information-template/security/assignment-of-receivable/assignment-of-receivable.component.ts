import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';

@Component({
  selector: 'app-assignment-of-receivable',
  templateUrl: './assignment-of-receivable.component.html',
  styleUrls: ['./assignment-of-receivable.component.scss']
})
export class AssignmentOfReceivableComponent implements OnInit {
  assignmentForm: FormGroup;
  submitted = false;
  ckeConfig;
  @Input() security: Security;
  @Input() isEdit = false;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configEditor();
    this.buildForm();
    if (this.isEdit) {
      this.setAssignment();
    } else {
      this.addAssignment();
    }
  }

  private setAssignment() {
    const formData = JSON.parse(this.security.data);
    const assignementOfReceivableData = this.assignmentForm.get('assignmentOfReceivables') as FormArray;
    assignementOfReceivableData.push(
        this.formBuilder.group({
          amount: [formData.amount],
          considerValue: [formData.considerValue],
          distressValue: [formData.distressValue],
          fairMarketValue: [formData.fairMarketValue],
          otherDetail: [formData.otherDetail]
        })
    );
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.assignmentForm = this.formBuilder.group({
      assignmentOfReceivables: this.formBuilder.array([])
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

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-lease-assignment',
  templateUrl: './lease-assignment.component.html',
  styleUrls: ['./lease-assignment.component.scss']
})
export class LeaseAssignmentComponent implements OnInit {
  leaseAssignmentForm: FormGroup;
  ckeConfig;
  @Input() security: Security;
  @Input() isEdit = false;
  @Input() calendarType: CalendarType;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.configEditor();
    if (this.isEdit) {
      this.setAssignment();
    } else {
      this.addAssignments();
    }
  }

  private setAssignment() {
    const formData = JSON.parse(this.security.data);
    const leaseAssignmentData = this.leaseAssignmentForm.get('leaseAssignment') as FormArray;
    leaseAssignmentData.push(
        this.formBuilder.group({
          otherDetail: [formData.otherDetail],
          considerValue: [formData.considerValue],
          distressValue: [formData.distressValue],
          fairMarketValue: [formData.fairMarketValue],
          leaseAssignmentFirstValuationDate: [formData.leaseAssignmentFirstValuationDate ? new Date(formData.leaseAssignmentFirstValuationDate) : '']
        })
    );
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  private buildForm(): FormGroup {
    return this.leaseAssignmentForm = this.formBuilder.group({
      leaseAssignment: this.formBuilder.array([]),
    });
  }

  private assignmentsDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          otherDetail: [undefined],
          considerValue: 0,
          distressValue: [undefined],
          fairMarketValue: [undefined],
          leaseAssignmentFirstValuationDate: [undefined]
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
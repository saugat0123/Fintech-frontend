import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-lease-assignment-security',
  templateUrl: './lease-assignment-security.component.html',
  styleUrls: ['./lease-assignment-security.component.scss']
})
export class LeaseAssignmentSecurityComponent implements OnInit {
  leaseAssignmentForm: FormGroup;
  ckeConfig = Editor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.leaseAssignmentForm = this.formBuilder.group({
      leaseAssignment: this.formBuilder.array([this.buildLeaseAssignmentFormGroup()]),
    });
  }

  private buildLeaseAssignmentFormGroup(): FormGroup {
    return this.formBuilder.group({
      otherDetail: [undefined],
    });
  }

}

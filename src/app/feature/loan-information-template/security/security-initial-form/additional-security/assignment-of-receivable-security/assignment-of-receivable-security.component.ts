import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-assignment-of-receivable-security',
  templateUrl: './assignment-of-receivable-security.component.html',
  styleUrls: ['./assignment-of-receivable-security.component.scss']
})
export class AssignmentOfReceivableSecurityComponent implements OnInit {
  assignmentOfReceivableForm: FormGroup;
  ckeConfig = Editor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.assignmentOfReceivableForm = this.formBuilder.group({
      assignmentOfReceivables: this.formBuilder.array([this.buildAssignmentOfReceivableForm()])
    });
  }

  private buildAssignmentOfReceivableForm(): FormGroup {
    return this.formBuilder.group({
      amount: [undefined],
      otherDetail: [undefined],
    });
  }

}

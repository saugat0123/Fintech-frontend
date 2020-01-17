import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fiscal-year-modal',
  templateUrl: './fiscal-year-modal.component.html',
  styleUrls: ['./fiscal-year-modal.component.scss']
})
export class FiscalYearModalComponent implements OnInit {
  financialStatementList = ['Projected', 'Provisional', 'Audited'];
  financialStatementForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private activeModalService: NgbActiveModal) { }

  ngOnInit() {
    this.financialStatementForm = this.formBuilder.group({
      financialStatement: [undefined, Validators.required],
      fiscalYear: [undefined, Validators.required],
      auditorDetails: [undefined]
    });
  }

  buildForm() {
    this.financialStatementForm = this.formBuilder.group({
      financialStatement: [undefined, Validators.required],
      fiscalYear: [undefined, Validators.required],
      auditorDetails: [undefined]
    });
  }

  get financialStatementFormControl() {
    return this.financialStatementForm.controls;
  }

  onClose() {
    this.activeModalService.dismiss();
  }
}

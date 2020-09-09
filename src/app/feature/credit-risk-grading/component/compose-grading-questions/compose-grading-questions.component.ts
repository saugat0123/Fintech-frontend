import { Component, OnInit } from '@angular/core';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-compose-grading-questions',
  templateUrl: './compose-grading-questions.component.html',
  styleUrls: ['./compose-grading-questions.component.scss']
})
export class ComposeGradingQuestionsComponent implements OnInit {

  schemeList: Array<LoanConfig> = new Array<LoanConfig>();
  loanConfigId: number;

  questionAnswerForm: FormGroup;

  newQuestionList: boolean;

  constructor(private loanConfigService: LoanConfigService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildSetupForm();
    this.getSchemeList();
    this.newQuestionList = false;
  }

  getSchemeList() {
    this.loanConfigService.getAll().subscribe((response: any) => {
      this.schemeList = response.detail;
    });
  }

  buildSetupForm() {
    this.questionAnswerForm = this.formBuilder.group({
      loanConfigId: [undefined, Validators.required],
      questionForm: this.formBuilder.array([])
    });
  }

  addQuestionField() {
    const control = this.questionAnswerForm.controls.questionForm as FormArray;
    control.push(
        this.formBuilder.group({
          status: ['ACTIVE'],
          answers: this.formBuilder.array([]),
          description: [undefined, Validators.required],
          appearanceOrder: [undefined, Validators.required],
          loanConfig: this.formBuilder.group({
            id: [this.loanConfigId]
          })
        })
    );
  }

  deleteQuestionField(index) {
    const control = this.questionAnswerForm.controls.questionForm as FormArray;
    control.removeAt(index);
  }

  addAnswerField(control) {
    control.push(
        this.formBuilder.group({
          description: [undefined, Validators.required],
          points: [undefined, Validators.required],
          status: ['ACTIVE']
        })
    );
  }

  deleteAnswerField(control, index) {
    control.removeAt(index);
  }

  onChangeLoan(event) {
    this.loanConfigId = event;
    // TODO: change these boolean variables after preparing API
    this.newQuestionList = true;
  }

  onSave() {
  }
}

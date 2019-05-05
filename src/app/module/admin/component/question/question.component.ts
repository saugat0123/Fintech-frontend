import { Component, OnInit } from '@angular/core';
import { Questions } from '../../modal/question';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questionList: Array<Questions>;
  questions: Questions = new Questions();
  questionAnswerForm: FormGroup;

  constructor( private formBuilder: FormBuilder) {
    this.questionAnswerForm = this.formBuilder.group({
      questionForm: this.formBuilder.array([ ])
    });
  }

  ngOnInit() {
  }

  addQuestionField() {
    let control = <FormArray>this.questionAnswerForm.controls.questionForm;
    control.push(
        this.formBuilder.group({
        qsnDescription: [ undefined, Validators.required ],
        answerForm: this.formBuilder.array([ ])
      })
    );
  }

  deleteQuestionField(index) {
    let control = <FormArray>this.questionAnswerForm.controls.questionForm;
    control.removeAt(index);
  }

  addAnswerField(control) {
   control.push(
       this.formBuilder.group({
       ansDescription: [ undefined, Validators.required ],
       points: [ undefined, Validators.required ]
    })
   );
  }

  deleteAnswerField(control, index) {
    control.removeAt(index);
  }

  onSubmit() {

  }

}

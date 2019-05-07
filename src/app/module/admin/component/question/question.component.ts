import { Component, OnInit } from '@angular/core';
import { Questions } from '../../modal/question';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../shared-service/baseservice/common-baseservice';
import { CommonDataService } from '../../../../shared-service/baseservice/common-dataService';
import { Scheme } from '../../modal/scheme';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  schemeApi: string;
  questionApi: string;
  schemeID: number;
  questionList: Array<Questions> = new Array<Questions>();
  schemeList: Array<Scheme> = new Array<Scheme>();
  questions: Questions = new Questions();
  questionAnswerForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
               private commonService: CommonService,
               private dataService: CommonDataService) {

    this.questionAnswerForm = this.formBuilder.group({
      scheme: this.formBuilder.group({
        id: [ undefined, Validators.required ]
      }),
      // id: [ undefined, Validators.required ],
      questionForm: this.formBuilder.array([ ])
    });

  }

  ngOnInit() {
    this.schemeApi = 'v1/companies/3/schemes';
    this.getSchemeList();
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

  getSchemeList() {
    this.commonService.getByGetAllPageable(this.schemeApi, 1, 10).subscribe((response: any) => {
      this.schemeList = response.detail.content;
      console.log(this.schemeList);
    });
  }

  setQuestions() {
    let control = <FormArray>this.questionAnswerForm.controls.questionForm;
    this.questionList.forEach(qsn => {
      control.push(this.formBuilder.group({
        qsnDescription: qsn.description,
        answerForm: this.setAnswers(qsn) })
      );
    });
  }

  setAnswers(qsn) {
    let arr = new FormArray([]);
    qsn.answers.forEach(ans => {
      arr.push(this.formBuilder.group({
        ansDescription: ans.description,
        points: ans.points
      }));
    });
    return arr;
  }

  onChangeSchemeOption() {
    this.clearFormArray();
    this.schemeID = this.questionAnswerForm.controls.scheme.get('id').value;
    this.questionApi = 'v1/companies/0/schemes/' + this.schemeID + '/questions';

    this.commonService.getByGetAllPageable(this.questionApi, 1, 10).subscribe((response: any) => {
      this.questionList = response.detail;
      this.setQuestions();
    });
    console.log(this.questionAnswerForm.value);

  }

  clearFormArray() {
    let control = <FormArray>this.questionAnswerForm.controls.questionForm;
    control.controls = [];
  }

  onSubmit() {

  }

}

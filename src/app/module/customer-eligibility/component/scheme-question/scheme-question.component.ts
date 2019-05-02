import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-scheme-question',
  templateUrl: './scheme-question.component.html',
  styleUrls: ['./scheme-question.component.css']
})
export class SchemeQuestionComponent implements OnInit {
  questions: Array<Question>;
  questionList: Question = new Question();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

}

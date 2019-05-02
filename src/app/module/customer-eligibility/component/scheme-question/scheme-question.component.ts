import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Question } from '../../modal/question';

@Component({
  selector: 'app-scheme-question',
  templateUrl: './scheme-question.component.html',
  styleUrls: ['./scheme-question.component.css']
})
export class SchemeQuestionComponent implements OnInit {
  question: Array<Question>;
  questionList: Question = new Question();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

}

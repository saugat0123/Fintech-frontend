import { Component, OnInit } from '@angular/core';
import {Questions} from '../../../../admin/modal/question';
import {ActivatedRoute, Params} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {QuestionService} from '../../../../admin/component/eligibility/question/question.service';

@Component({
  selector: 'app-credit-grading',
  templateUrl: './credit-grading.component.html',
  styleUrls: ['./credit-grading.component.scss']
})
export class CreditGradingComponent implements OnInit {

  loanConfigId: number;
  totalObtainablePoints: number;
  questionList: Array<Questions> = new Array<Questions>();
  questionAnswerForm: FormGroup;
  allId;
  totalPointMapper: Map<string, number> = new Map<string, number>();
  totalPoints = 0;
  grading: string;
  constructor(
      private questionService: QuestionService,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( (paramsValue: Params) => {
      this.allId = {
        loanId: null,
        customerId: null,
        loanCategory: null
      };
      this.allId = paramsValue;
      this.loanConfigId = this.allId.loanId;
    });
    this.onChangeSchemeOption();
    this.questionAnswerForm = this.formBuilder.group({
      questionForm: this.formBuilder.array([])
    });
  }

  onChangeSchemeOption() {
    this.totalObtainablePoints = 0;

    this.questionService.getAllQuestions(this.loanConfigId).subscribe((response: any) => {
      this.questionList = response.detail;

      this.questionList.forEach(qsn => {
        this.totalObtainablePoints = this.totalObtainablePoints + qsn.maximumPoints;
      });

      this.setQuestions();
    });
  }

  setQuestions() {
    const control = this.questionAnswerForm.controls.questionForm as FormArray;
    this.questionList.forEach(qsn => {
      control.push(this.formBuilder.group({
        id: qsn.id,
        description: qsn.description,
        answers: this.setAnswers(qsn),
        selectedAnswer: undefined
      }));
    });
  }

  setAnswers(qsn) {
    const arr = new FormArray([]);
    qsn.answers.forEach(ans => {
      arr.push(this.formBuilder.group({
        selectAnswer: qsn.id,
        description: ans.description,
        points: ans.points
      }));
    });
    return arr;
  }

  onChangeOption(qsnFormGroup: FormGroup, qsnId, points: number) {
    qsnFormGroup.controls['selectedAnswer'].setValue(points);
    this.totalPointMapper.set(qsnId, points);
    console.log(qsnId);
    if (this.totalPointMapper.size === this.questionList.length) {
      let sum = 0;
      this.totalPointMapper.forEach((value: number) => {
        sum = sum + Number(value);
        console.log(sum);
      });
      this.totalPoints = sum;

      if (this.totalPoints === 100) {
        this.grading = 'Superior';
      } else if (this.totalPoints >= 85) {
        this.grading = 'Good';
      } else if (this.totalPoints >= 75 && this.totalPoints < 85) {
        this.grading = 'Acceptable';
      } else if (this.totalPoints >= 65 && this.totalPoints < 75) {
        this.grading = 'Marginal/Watchlist';
      } else if (this.totalPoints >= 55 && this.totalPoints < 65) {
        this.grading = 'Special Mention';
      } else if (this.totalPoints >= 45 && this.totalPoints < 55) {
        this.grading = 'Substandard';
      } else if (this.totalPoints >= 35 && this.totalPoints < 45) {
        this.grading = 'Doubtful';
      } else if (this.totalPoints <= 35) {
        this.grading = 'Bad & Loss';
      }
    }
  }


}

import {Component, OnInit} from '@angular/core';
import {Questions} from '../../modal/question';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-scheme-question',
    templateUrl: './scheme-question.component.html',
    styleUrls: ['./scheme-question.component.css']
})
export class SchemeQuestionComponent implements OnInit {

    checkedAnswerMap: Map<number, number> = new Map<number, number>();
    pointsMap: Map<number, number> = new Map<number, number>();
    questionList: Array<Questions> = new Array<Questions>();
    currentApi: string;
    index: number;
    answerID: number;
    answerPoints: number;
    questionID: number;
    schemeID: number;
    formValid: boolean;


    constructor( private commonService: CommonService,
                 private dataService: CommonDataService,
                 private router: Router ) {
    }

    ngOnInit() {
        this.schemeID = this.dataService.getSchemeID();
        this.currentApi = 'v1/companies/0/schemes/' + this.schemeID + '/questions';
        this.index = 0;
        this.getQuestionList();
        console.log(this.pointsMap.size);
        this.formValid = false;
    }

    getQuestionList() {
        this.commonService.getByGetAllPageable(this.currentApi, 1, 1).subscribe((response: any) => {
            this.questionList = response.detail;
            console.log(this.questionList);

            for (let qsn of this.questionList) {
                for (let ans of qsn.answers) {
                    this.pointsMap.set(ans.id, ans.points);
                    console.log(ans.points, ans.id);
                    console.log(this.pointsMap.size);
                    console.log(this.pointsMap.values());
                }
            }
        });
    }

    onNext() {
        this.index++;
        if (this.index >= this.questionList.length) {
            this.index = 0;
        }
    }

    onPrevious() {
        this.index--;
        if (this.index < 0) {
            this.index = this.questionList.length - 1;
        }
    }

    onSelectionChange(answerID, answerPoints, questionID) {
        this.answerID = answerID;
        this.answerPoints = answerPoints;
        this.questionID = questionID;
        console.log(this.answerID, this.answerPoints, this.questionID);
        this.checkedAnswerMap.set(questionID, answerID);
        console.log(this.checkedAnswerMap.size);
        console.log(this.questionList.length);
        if (this.checkedAnswerMap.size === this.questionList.length) {
            this.formValid = true;
        }
    }

    onSubmit() {
        this.router.navigate(['customer/schemeresult']);
    }

    onBackToForm() {
        this.router.navigate(['customer/schemeselect']);
    }

}

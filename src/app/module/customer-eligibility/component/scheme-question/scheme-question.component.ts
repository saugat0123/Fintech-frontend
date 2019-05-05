import {Component, OnInit} from '@angular/core';
import {Questions} from '../../modal/question';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';

@Component({
    selector: 'app-scheme-question',
    templateUrl: './scheme-question.component.html',
    styleUrls: ['./scheme-question.component.css']
})
export class SchemeQuestionComponent implements OnInit {

    pointsMap: Map<number, number> = new Map<number, number>();
    questionList: Array<Questions> = new Array<Questions>();
    currentApi: string;
    index: number;
    answerID: number;
    answerPoints: number;
    questionID: number;
    proceedButton: boolean;


    constructor( private commonService: CommonService,
                 private router: Router ) {
    }

    ngOnInit() {
        this.currentApi = 'v1/companies/0/schemes/13/questions';
        this.index = 0;
        this.getQuestionList();
        this.proceedButton = false;
    }

    getQuestionList() {
        this.commonService.getByGetAllPageable(this.currentApi, 1, 1).subscribe((response: any) => {
            this.questionList = response.detail;
            console.log(this.questionList);
        });
    }

    onNext() {
        this.index++;
        if (this.index >= this.questionList.length) {
            this.index = 0;
            this.proceedButton = true;
        }
    }

    onPrevious() {
        this.index--;
        if (this.index < 0) {
            this.index = this.questionList.length - 1;
        }
        if (this.index >= this.questionList.length) {
            this.proceedButton = true;
        }
    }

    onSelectionChange(answerID, answerPoints, questionID) {
        this.answerID = answerID;
        this.answerPoints = answerPoints;
        this.questionID = questionID;
        console.log(this.answerID, this.answerPoints, this.questionID);
        this.pointsMap.set(questionID, answerID);
    }

    onSubmit() {
        this.router.navigate(['customer/schemeresult']);
    }

}

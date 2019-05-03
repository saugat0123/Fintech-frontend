import {Component, OnInit} from '@angular/core';
import {Questions} from '../../modal/question';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';

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


    constructor(private commonService: CommonService) {
    }

    ngOnInit() {
        this.currentApi = 'v1/companies/0/schemes/13/questions';
        this.index = 0;
        this.getQuestionList();
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
        }

    }

    onSelectionChange(answerID, answerPoints, questionID) {
        this.answerID = answerID;
        this.answerPoints = answerPoints;
        this.questionID = questionID;
        console.log(this.answerID, this.answerPoints, this.questionID);
        this.pointsMap.set(questionID, answerID);

        /*for (let value of this.pointsMap.values()) {
            console.log(value);
        }*/

    }




}

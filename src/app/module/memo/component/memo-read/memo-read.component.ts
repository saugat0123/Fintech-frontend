import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit {

    title = 'Memo - Read';

    constructor(
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
    }

}

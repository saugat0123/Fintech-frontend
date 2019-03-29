import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-memo-inbox',
    templateUrl: './memo-inbox.component.html',
    styleUrls: ['./memo-inbox.component.css']
})
export class MemoInboxComponent implements OnInit {

    title = 'Memo - Inbox';

    constructor(
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
    }

}

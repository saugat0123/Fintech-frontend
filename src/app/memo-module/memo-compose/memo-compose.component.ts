import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-memo-compose',
    templateUrl: './memo-compose.component.html',
    styleUrls: ['./memo-compose.component.css']
})
export class MemoComposeComponent implements OnInit {

    title = 'Memo - Compose';

    constructor(
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
    }

}

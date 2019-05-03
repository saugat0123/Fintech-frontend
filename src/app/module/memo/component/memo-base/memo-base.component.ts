import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Router} from '@angular/router';

@Component({
    selector: 'app-memo-base',
    templateUrl: './memo-base.component.html',
    styleUrls: ['./memo-base.component.css']
})
export class MemoBaseComponent implements OnInit {

    title: 'Memo';

    constructor(
        private dataService: CommonDataService,
        public router: Router
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
    }

}

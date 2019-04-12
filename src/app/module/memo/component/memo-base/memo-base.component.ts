import {Component, OnInit} from '@angular/core';
import {CommonDataService} from "../../../../shared-service/baseservice/common-dataService";
import {Router} from "@angular/router";

@Component({
    selector: 'app-memo-base',
    templateUrl: './memo-base.component.html',
    styleUrls: ['./memo-base.component.css']
})
export class MemoBaseComponent implements OnInit {

    title: String;

    constructor(
        private dataService: CommonDataService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataService.currentTitle.subscribe(message => this.title = message)
    }

}

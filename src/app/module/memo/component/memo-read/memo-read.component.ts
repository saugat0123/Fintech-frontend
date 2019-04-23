import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Memo} from "../../model/memo";
import {Router} from "@angular/router";

@Component({
    selector: 'app-memo-read',
    templateUrl: './memo-read.component.html',
    styleUrls: ['./memo-read.component.css']
})
export class MemoReadComponent implements OnInit {

    title = 'Memo - Read';
    memo: Memo;

    constructor(
        private dataService: CommonDataService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);

        if (this.dataService.getMemo().id == undefined) {
           this.router.navigateByUrl('home/dashboard', { skipLocationChange: true }).then(()=>
              this.router.navigate(['home/memo/underReview']));
        } else {
            this.memo = this.dataService.getMemo();
        }
    }

}

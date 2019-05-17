import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-memo-base',
    templateUrl: './memo-base.component.html',
    styleUrls: ['./memo-base.component.css']
})
export class MemoBaseComponent implements OnInit {

    title: 'Memo';

    constructor(
        private breadcrumbService: BreadcrumbService,
        public router: Router
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
    }

}

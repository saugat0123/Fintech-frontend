import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
    title: String;

    constructor(private service: BreadcrumbService) {
    }

    ngOnInit() {
        this.service.alert.subscribe(alert => this.title = alert);
    }
}

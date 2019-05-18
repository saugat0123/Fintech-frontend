import {Component, OnInit} from '@angular/core';
import {AlertService} from './alert.service';
import {debounceTime} from 'rxjs/operators';
import {Alert} from '../../model/Alert';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
    alert: Alert;

    constructor(private service: AlertService) {
    }

    ngOnInit() {
        this.service.alert.subscribe(alert => this.alert = alert);
        this.service.alert.pipe(
            debounceTime(10000)
        ).subscribe(() => this.alert = undefined);
    }

    close() {
        this.alert = undefined;
    }
}

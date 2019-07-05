import {EventEmitter, Injectable, Output} from '@angular/core';
import {Alert} from '../../model/Alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    @Output() alert: EventEmitter<Alert> = new EventEmitter();

    constructor() {
    }


    public notify(alert: Alert) {
        this.alert.emit(alert);
    }
}

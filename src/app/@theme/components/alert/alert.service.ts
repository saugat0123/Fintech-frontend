import { EventEmitter, Injectable, Output, Directive } from '@angular/core';
import {Alert} from '../../model/Alert';

@Directive()
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

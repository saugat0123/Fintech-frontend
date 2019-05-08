import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {

    @Output() alert: EventEmitter<String> = new EventEmitter();

    constructor() {
    }


    public notify(title: String) {
        this.alert.emit(title);
    }
}

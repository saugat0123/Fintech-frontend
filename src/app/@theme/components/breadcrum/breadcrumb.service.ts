import { EventEmitter, Injectable, Output, Directive } from '@angular/core';

@Directive()
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

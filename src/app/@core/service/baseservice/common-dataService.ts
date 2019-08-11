import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: any;

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');

    currentAlertFlag = this.alertFlag.asObservable();

    constructor() {
    }

    getGlobalMsg(message: string) {
        this.message.next(message);
    }

    setDataList(datalist: Object) {
        this.data = datalist;
    }


    getData() {
        return this.dataObj;
    }

}

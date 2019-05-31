import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Branch} from '../../../feature/admin/modal/branch';
import {ApprovalLimit} from '../../../feature/admin/modal/approval-limit';
import {User} from '../../../feature/admin/modal/user';
import {Valuator} from '../../../feature/admin/modal/valuator';
import {Sector} from '../../../feature/admin/modal/sector';
import {SubSector} from '../../../feature/admin/modal/sub-sector';
import {Segment} from '../../../feature/admin/modal/segment';
import {SubSegment} from '../../../feature/admin/modal/subSegment';
import {District} from '../../../feature/admin/modal/district';
import {MunicipalityVdc} from '../../../feature/admin/modal/municipality_VDC';
import {Province} from '../../../feature/admin/modal/province';
import {Nepse} from '../../../feature/admin/modal/nepse';
import {Company} from '../../../feature/admin/modal/company';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';
import {Document} from '../../../feature/admin/modal/document';

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: any;
    alertmessage: String;

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');

    currentAlertFlag = this.alertFlag.asObservable();

    // private customer = new BehaviorSubject<Customer>(new Customer);

    constructor() {
    }

    changeTitle(message: string) {
        this.breadcrumTitle.next(message);
    }

    getGlobalMsg(message: string) {
        this.message.next(message);
    }

    getAlertMsg(flag: string) {

        this.alertFlag.next(flag);
    }


    setDataList(datalist: Object) {
        this.data = datalist;
    }


    getData() {
        return this.dataObj;
    }


}

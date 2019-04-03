import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Branch} from '../../modal/branch';
import {ApprovalLimit} from '../../modal/approval-limit';
import {User} from '../../modal/user';

declare var $;

@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: any;

    branch: Branch = new Branch();
    document: Document = new Document();
    approvalLimit: ApprovalLimit = new ApprovalLimit();
    user: User = new User();

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');
    currentAlertFlag = this.alertFlag.asObservable();

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

    getDataList() {
        return this.data;
    }

    setData(dataObj: any) {
        this.dataObj = dataObj;
    }

    getData() {
        return this.dataObj;
    }

    setBranch(branch: Branch) {
        console.log(branch);
        this.branch = branch;
    }

    getBranch() {
        return this.branch;
    }

    setApprovalLimit(approvalLimit: ApprovalLimit) {
        console.log(approvalLimit);
        this.approvalLimit = approvalLimit;
    }

    getApprovalLimit() {
        return this.approvalLimit;
    }

    setUser(user: User) {
        console.log(user);
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    alertmsg() {
        $('.alert-custom').slideDown();
        setTimeout(() => {
            $('.alert-custom').slideUp();
        }, 2000);
    }
}

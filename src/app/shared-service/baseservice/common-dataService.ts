import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Pageable } from './common-pageable';
import { Branch } from '../../modal/branch';
import { ApprovalLimit } from '../../modal/approval-limit';
import { User } from '../../modal/user';
import {Memotype} from "../../memo-module/model/memotype";


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
    memoType: Memotype = new Memotype();

    private breadcrumTitle = new BehaviorSubject('default message');
    currentTitle = this.breadcrumTitle.asObservable();

    private message = new BehaviorSubject('default message');
    currentMsg = this.message.asObservable();

    private alertFlag = new BehaviorSubject('default');
    currentAlertFlag = this.alertFlag.asObservable();

    constructor() {
    }

    changeTitle(message: string) {
        this.breadcrumTitle.next(message)
    }

    getGlobalMsg(message: string) {
        this.message.next(message)
    }

    getAlertMsg(flag: string) {

        this.alertFlag.next(flag)
    }



    setDataList(datalist: object) {
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
        console.log(branch)
        this.branch = branch;
    }

    getBranch() {
        return this.branch;
    }

    setApprovalLimit(approvalLimit: ApprovalLimit){
        console.log(approvalLimit)
        this.approvalLimit = approvalLimit;
    }
    getApprovalLimit(){
        return this.approvalLimit;
    }
    setUser(user: User){
        console.log(user)
        this.user = user;
    }
    getUser(){
        return this.user;
    }
    setMemoType(memoType: Memotype) {
        console.log(memoType);
        this.memoType = memoType;
    }
    getMemoType() {
        return this.memoType;
    }

}

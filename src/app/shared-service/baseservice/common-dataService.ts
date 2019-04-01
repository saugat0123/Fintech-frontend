import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Pageable } from './common-pageable';
import { Branch } from '../../modal/branch';
import { ApprovalLimit } from '../../modal/approval-limit';
import {User} from "../../modal/user";
import {Segment} from '../../modal/segment';
import {District} from '../../modal/district';
import {MunicipalityVDC} from '../../modal/municipality_VDC';
import {Province} from '../../modal/province';
import {Nepse} from '../../modal/nepse';
import {SubSegment} from '../../modal/subSegment';



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
    segment: Segment = new Segment();
    subSegment: SubSegment = new SubSegment();
    district: District = new District();
    municipality: MunicipalityVDC = new MunicipalityVDC();
    province: Province = new Province();
    nepse: Nepse = new Nepse();

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
    setSegment(segment: Segment){
        console.log(segment)
        this.segment = segment;
    }
    getSegment(){
        return this.segment;
    }
    setSubSegment(subSegment: SubSegment){
        this.subSegment = subSegment;
    }
    getSubSegment(){
        return this.subSegment;
    }
    setDistrict(district: District){
        console.log(district)
        this.district = district;
    }
    setMunicipality(municipality: MunicipalityVDC){
        this.municipality = municipality;
    }
    setProvince(province: Province){
        this.province = province;
    }
    getProvince(){
        return this.province;
    }
    setNepse(nepse: Nepse){
        this.nepse = nepse;
    }
    getNepse(){
        return this.nepse;
    }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Branch} from '../../pages/admin/modal/branch';
import {ApprovalLimit} from '../../pages/admin/modal/approval-limit';
import {User} from '../../pages/admin/modal/user';
import {Customer} from '../../pages/admin/modal/customer';
import {Valuator} from '../../pages/admin/modal/valuator';
import {Sector} from '../../pages/admin/modal/sector';
import {SubSector} from '../../pages/admin/modal/sub-sector';
import {Segment} from '../../pages/admin/modal/segment';
import {District} from '../../pages/admin/modal/district';
import {SubSegment} from '../../pages/admin/modal/subSegment';
import {MunicipalityVdc} from '../../pages/admin/modal/municipality_VDC';
import {Province} from '../../pages/admin/modal/province';
import {Nepse} from '../../pages/admin/modal/nepse';
import {Company} from '../../pages/admin/modal/company';
import {Document} from '../../pages/admin/modal/document';


@Injectable({
    providedIn: 'root'
})
export class CommonDataService {
    title: string;
    data: any;
    dataObj: any;
    alertmessage: String;

    branch: Branch = new Branch();
    document: Document = new Document();
    approvalLimit: ApprovalLimit = new ApprovalLimit();
    user: User = new User();
    customer: Customer = new Customer();
    valuator: Valuator = new Valuator();
    sector: Sector = new Sector();
    subSector: SubSector = new SubSector();
    segment: Segment = new Segment();
    subSegment: SubSegment = new SubSegment();
    district: District = new District();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    province: Province = new Province();
    nepse: Nepse = new Nepse();
    company: Company = new Company();

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

    setCustomer(customer: Customer) {
        return this.customer = customer;
    }

    getCustomer() {
        return this.customer;
    }

    setValuator(valuator: Valuator) {
        return this.valuator = valuator;
    }

    getValuator() {
        return this.valuator;
    }

    setSector(sector: Sector) {
        return this.sector = sector;
    }

    getSector() {
        return this.sector;
    }

    setSubSector(subSector: SubSector) {
        return this.subSector = subSector;
    }

    getSubSector() {
        return this.subSector;
    }

    setSegment(segment: Segment) {
        console.log(segment);
        this.segment = segment;
    }

    getSegment() {
        return this.segment;
    }

    setSubSegment(subSegment: SubSegment) {
        this.subSegment = subSegment;
    }

    getSubSegment() {
        return this.subSegment;
    }

    setDistrict(district: District) {
        console.log(district);
        this.district = district;
    }

    setMunicipality(municipality: MunicipalityVdc) {
        this.municipality = municipality;
    }

    setProvince(province: Province) {
        this.province = province;
    }

    getProvince() {
        return this.province;
    }

    setNepse(nepse: Nepse) {
        this.nepse = nepse;
    }

    getNepse() {
        return this.nepse;
    }

    setDocument(document: Document) {
        this.document = document;
    }

    getDocument() {
        return this.document;
    }

    setCompany(company: Company) {
        this.company = company;
    }

    getCompany() {
        return this.company;
    }

    clearData() {
        this.dataObj = new Object();
    }

}

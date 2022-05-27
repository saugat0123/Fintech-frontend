import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerService} from '../../service/customer.service';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-net-worth',
    templateUrl: './net-worth.component.html',
    styleUrls: ['./net-worth.component.scss']
})
export class NetWorthComponent implements OnInit {

    form: FormGroup = new FormGroup({});

    constructor(private formBuilder: FormBuilder,
                private activeModal: NgbActiveModal,
                private overlay: NgxSpinnerService, private customerService: CustomerService,
                private activatedRoute: ActivatedRoute) {
    }

    totalNetWorth = 0;
    @Output() dataEmiter: EventEmitter<any> = new EventEmitter<any>();
    @Input() data: any;
    @Input() customerName: any;
    @Input() customerInfoId: any;
    jointInfo: Array<any> = new Array<any>();
    @Input() isJointCustomer: boolean =false;

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.data)) {
            this.form.patchValue(JSON.parse(this.data));
        }

        this.getJointCustomerData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            customerForm: this.formBuilder.array([])
        });
    }

    addForm() {
        const form = this.form.get('customerForm') as FormArray;
        form.push(this.formBuilder.group({
            cashDepositInOtherBank: undefined,
            realEstateProperties: undefined,
            investmentInShares: undefined,
            vehicle: undefined,
            jewelleries: undefined,
            totalAssets: undefined,
            loanFromCCBL: undefined,
            creditCardsLimit: undefined,
            otherLiabilities: undefined,
            totalLiabilities: undefined,
            totalNetWorth: undefined
        }));
    }

    submit() {
        if(ObjectUtil.isEmpty(this.isJointCustomer)){
           this.dataEmiter.emit(this.form.get(['customerForm', 0]).value);
           return;
        }
        this.dataEmiter.emit(this.form.get('customerForm').value);
        this.activeModal.close();
    }

    calculateTotalAssets(i: any) {
        const total = Number(this.form.get(['customerForm', i, 'cashDepositInOtherBank']).value) +
            Number(this.form.get(['customerForm', i, 'realEstateProperties']).value)
            + Number(this.form.get(['customerForm', i, 'investmentInShares']).value) +
            Number(this.form.get(['customerForm', i, 'vehicle']).value) + Number(this.form.get(['customerForm', i, 'jewelleries']).value);
        this.form.get(['customerForm', i, 'totalAssets']).patchValue(total);
        this.calculateNetWorth(i);
    }

    calculateTotalLiabilities(i: any) {
        const total = Number(this.form.get(['customerForm', i, 'loanFromCCBL']).value) +
            Number(this.form.get(['customerForm', i, 'creditCardsLimit']).value)
            + Number(this.form.get(['customerForm', i, 'otherLiabilities']).value);
        this.form.get(['customerForm', i, 'totalLiabilities']).patchValue(total);
        this.calculateNetWorth(i);
    }

    calculateNetWorth(i: any) {
        if (!ObjectUtil.isEmpty(this.form.get(['customerForm', i, 'totalLiabilities']))) {
            const totalNetWorth = (Number(this.form.get(['customerForm', i, 'totalAssets']).value)
                - Number(this.form.get(['customerForm', i, 'totalLiabilities']).value));
            this.form.get(['customerForm', i, 'totalNetWorth']).patchValue(totalNetWorth);
        }
    }

    getJointCustomerData() {
        const id = this.activatedRoute.snapshot.params.id;
        if (!ObjectUtil.isEmpty(id)) {
            this.overlay.show()
            this.customerService.detail(Number(id)).subscribe(rs => {
                console.log(JSON.parse(rs.detail.jointInfo), 'JOINT');
                if (!ObjectUtil.isEmpty(rs.detail.jointInfo) && this.isJointCustomer) {
                    this.jointInfo = JSON.parse(rs.detail.jointInfo).jointCustomerInfo;
                    if(this.isJointCustomer && !ObjectUtil.isEmpty(this.data)){
                        this.patchJointCustomerValue();
                    } else {
                        for (let i = 0; i < this.jointInfo.length; i++) {
                            this.addForm();
                        }
                    }


                } else {
                    const data = JSON.parse(this.data);
                    const form = this.form.get('customerForm') as FormArray;
                    if(!ObjectUtil.isEmpty(data)) {
                        form.push(this.formBuilder.group({
                            cashDepositInOtherBank: data.cashDepositInOtherBank ? data.cashDepositInOtherBank : undefined,
                            realEstateProperties: data.realEstateProperties ? data.realEstateProperties : undefined,
                            investmentInShares: data.investmentInShares ? data.investmentInShares : undefined,
                            vehicle: data.vehicle ? data.vehicle : undefined,
                            jewelleries: data.jewelleries ? data.jewelleries : undefined,
                            totalAssets: data.totalAssets ? data.totalAssets : undefined,
                            loanFromCCBL: data.loanFromCCBL ? data.loanFromCCBL : undefined,
                            creditCardsLimit: data.creditCardsLimit ? data.creditCardsLimit : undefined,
                            otherLiabilities: data.otherLiabilities ? data.otherLiabilities : undefined,
                            totalLiabilities: data.totalLiabilities ? data.totalLiabilities : undefined,
                            totalNetWorth: data.totalNetWorth ? data.totalNetWorth : undefined,
                        }));
                    } else {
                        this.addForm();
                    }
                }
                this.overlay.hide();
            }, error => {
                this.overlay.hide()
            });
        }
    }

    patchJointCustomerValue(){
        if(this.isJointCustomer){
            this.overlay.show()
            const  data = JSON.parse(this.data);
            if(!ObjectUtil.isEmpty(data)){
                const form = this.form.get('customerForm') as FormArray;
                data.forEach(d => {
                    form.push(this.formBuilder.group({
                        cashDepositInOtherBank: d.cashDepositInOtherBank ? d.cashDepositInOtherBank : undefined,
                        realEstateProperties: d.realEstateProperties ? d.realEstateProperties : undefined,
                        investmentInShares: d.investmentInShares ? d.investmentInShares : undefined,
                        vehicle: d.vehicle ? d.vehicle : undefined,
                        jewelleries: d.jewelleries ? d.jewelleries : undefined,
                        totalAssets: d.totalAssets ? d.totalAssets : undefined,
                        loanFromCCBL: d.loanFromCCBL ? d.loanFromCCBL : undefined,
                        creditCardsLimit: d.creditCardsLimit ? d.creditCardsLimit : undefined,
                        otherLiabilities: d.otherLiabilities ? d.otherLiabilities : undefined,
                        totalLiabilities: d.totalLiabilities ? d.totalLiabilities : undefined,
                        totalNetWorth: d.totalNetWorth ? d.totalNetWorth : undefined,
                    }));
                    this.overlay.hide();
                });
            }
        }
    }

}

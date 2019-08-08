import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {Security} from '../../../../admin/modal/security';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {DmsLoanService} from './dms-loan-service';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanDataService} from '../../../service/loan-data.service';


@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})

export class DmsLoanFileComponent implements OnInit {
    public static FILE_SIZE = 500000;
    @Input()
    loanFile: DmsLoanFile;
    loanForm: FormGroup;
    submitted = false;

    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = true;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    dropdownList = [];
    loanName: string;
    loanConfig: LoanConfig = new LoanConfig();
    customerId: number;
    errorMessage: string;
    dropdownPriorities = [];
    documentMaps = [];
    documentMap: string;
    allId;
    securities: string[];
    securityEnum: Security[] = [];
    imagePaths: string[] = [];
    imageUrl = [];
    action: string;
    loanConfigId: number;
    hasPreviousLoan = false;
    previousLoans: Array<LoanDataHolder>;
    spinner = false;
    personal = true;

    constructor(private formBuilder: FormBuilder,
                private loanDataService: LoanDataService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dmsLoanService: DmsLoanService,
                private loanFormService: LoanFormService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService) {
    }

    get form() {
        return this.loanForm.controls;
    }


    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null,
                    loanCategory: null
                };
                this.allId = paramsValue;
                this.customerId = this.allId.customerId;
                this.loanConfigId = this.allId.loanId;
                if (this.allId.loanCategory !== 'PERSONAL_TYPE') {
                    this.personal = false;
                }

            });


        if (this.loanFile.id !== undefined) {
            this.action = 'EDIT';
            this.imagePaths = JSON.parse(this.loanFile.documentPath);
        }
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                this.loanName = this.loanConfig.name;
                this.initialDocuments = this.loanConfig.initial;
                this.renewDocuments = this.loanConfig.renew;
            }
        );

        this.dropdownList = [
            {id: 'LAND_SECURITY', name: 'Land Security'},
            {id: 'BUILDING_SECURITY', name: 'Building Security'},
            {id: 'VEHICLE_SECURITY', name: 'Vehicle Security'},
            {id: 'PROPERTY_AND_MACHINERY_SECURITY', name: 'Property and Machinery Security'},
            {id: 'FIXED_DEPOSIT_RECEIPT', name: 'Fixed Deposit Receipt'},
            {id: 'SHARE_STOCK', name: 'Share/Stock'},
            {id: 'EDUCATION_CERTIFICATE', name: 'Education Certificate'}

        ];

        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];
        this.loanForm = this.formBuilder.group({
            customerName: [this.loanFile.customerName === undefined ? '' : this.loanFile.customerName, Validators.required],
            companyName: [this.loanFile.companyName === undefined ? '' : this.loanFile.companyName],
            registrationNumber: [this.loanFile.registrationNumber === undefined ? '' : this.loanFile.registrationNumber],
            citizenshipNumber: [this.loanFile.citizenshipNumber === undefined ? '' : this.loanFile.citizenshipNumber],
            contactNumber: [this.loanFile.contactNumber === undefined ? '' : this.loanFile.contactNumber, Validators.required],
            interestRate: [this.loanFile.interestRate === undefined ? '' : this.loanFile.interestRate,
                [Validators.required, Validators.min(0)]],
            proposedAmount: [this.loanFile.proposedAmount === undefined ? '' : this.loanFile.proposedAmount,
                [Validators.required, Validators.min(0)]],
            security: [this.loanFile.security === undefined ? '' : this.showSecurity(this.loanFile.security), Validators.required],
            serviceChargeType: [this.loanFile.serviceChargeType === undefined ? 'Percentage' : this.loanFile.serviceChargeType,
                Validators.required],
            serviceChargeAmount: [this.loanFile.serviceChargeAmount === undefined ? '' : this.loanFile.serviceChargeAmount,
                [Validators.required, Validators.min(0)]],
            tenureDuration: [this.loanFile.tenureDuration === undefined ? '' : this.loanFile.tenureDuration,
                [Validators.required, Validators.min(0)]],
            priority: [this.loanFile.priority === undefined ? '' : this.loanFile.priority,
                [Validators.required, Validators.min(0)]],
            recommendation: [this.loanFile.recommendationConclusion === undefined ? '' : this.loanFile.recommendationConclusion,
                Validators.required],
            waiver: [this.loanFile.waiver === undefined ? '' : this.loanFile.waiver, Validators.required],
            fmvTotal: [this.loanFile.fmvTotal === undefined ? '' : this.loanFile.fmvTotal, Validators.min(0)],
            totalLoanLimit: [this.loanFile.totalLoanLimit === undefined ? '' : this.loanFile.totalLoanLimit,
                [Validators.required, Validators.min(0)]],
            groupExpo: [this.loanFile.groupExpo === undefined ? '' : this.loanFile.groupExpo],
            fmvFundingPercent: [this.loanFile.fmvFundingPercent === undefined ? '' : this.loanFile.fmvFundingPercent, Validators.min(0)],
            file: ['']
        });
        this.reqPersonalOrBusiness();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }

    }


    showSecurity(security: string) {
        this.securities = security.split(',');
        this.securities.forEach((securityLoop => {
            this.securityEnum.push(this.dropdownList[Number(securityLoop)].id);
        }));
        return this.securityEnum;
    }

    onSubmit() {
        this.loanFile.customerName = this.loanForm.get('customerName').value;
        this.loanFile.companyName = this.loanForm.get('companyName').value;
        this.loanFile.registrationNumber = this.loanForm.get('registrationNumber').value;
        this.loanFile.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value as string;
        this.loanFile.tenureDuration = this.loanForm.get('tenureDuration').value;
        this.loanFile.serviceChargeType = this.loanForm.get('serviceChargeType').value;
        this.loanFile.serviceChargeAmount = this.loanForm.get('serviceChargeAmount').value;
        this.loanFile.priority = this.loanForm.get('priority').value;
        this.loanFile.waiver = this.loanForm.get('waiver').value;
        this.loanFile.recommendationConclusion = this.loanForm.get('recommendation').value;
        this.loanFile.fmvTotal = this.loanForm.get('fmvTotal').value;
        this.loanFile.fmvFundingPercent = this.loanForm.get('fmvFundingPercent').value;
        this.loanFile.groupExpo = this.loanForm.get('groupExpo').value;
        this.loanFile.totalLoanLimit = this.loanForm.get('totalLoanLimit').value;

    }


    documentUploader(event, documentName: string) {
        const file = event.target.files[0];
        if (file.size > DmsLoanFileComponent.FILE_SIZE) {
            this.errorMessage = 'Maximum File Size Exceeds';
        }
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', this.loanName);
        formdata.append('citizenNumber', String(this.loanForm.get('citizenshipNumber').value));
        formdata.append('customerName', this.loanForm.get('customerName').value);
        formdata.append('documentName', documentName);
        this.dmsLoanService.uploadFile(formdata).subscribe(
            (result: any) => {
                this.errorMessage = undefined;
                this.document.name = documentName;
                this.loanFile.documents.push(this.document);
                this.documentMap = documentName + ':' + result.detail;
                if (!this.documentMaps.includes(this.documentMap)) {
                    this.documentMaps.push(this.documentMap);
                }
                this.loanFile.documentMap = this.documentMaps;
                this.document = new LoanDocument();
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while uploading the document'));
            }
        );
    }

    searchByCitizenship() {
        const citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFormService.getLoansByCitizenship(citizenshipNumber).subscribe((response: any) => {
            this.previousLoans = response.detail;
            this.hasPreviousLoan = this.previousLoans.length > 0;
        }, error => console.error(error));
    }

    openLoan(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId
            }
        });
    }

    hidePreviousLoans() {
        this.hasPreviousLoan = false;
    }

    searchByRegNO() {
        const regNO = this.loanForm.get('registrationNumber').value;
        this.loanFormService.getLoansByRegistrationNumber(regNO).subscribe((response: any) => {
            this.previousLoans = response.detail;
            this.hasPreviousLoan = this.previousLoans.length > 0;
        }, error => console.error(error));
    }

    reqPersonalOrBusiness() {
        const citizenControl = this.loanForm.get('citizenshipNumber');
        const companyControl = this.loanForm.get('companyName');
        const regdControl = this.loanForm.get('registrationNumber');
        if (this.personal) {
            citizenControl.setValidators([Validators.required]);
            companyControl.setValidators(null);
            regdControl.setValidators(null);
        } else {
            citizenControl.setValidators([Validators.required]);
            companyControl.setValidators([Validators.required]);
            regdControl.setValidators([Validators.required]);
        }
    }
}

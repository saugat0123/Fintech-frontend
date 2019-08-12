import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {Security} from '../../../../admin/modal/security';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {DmsLoanService} from './dms-loan-service';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanDataService} from '../../../service/loan-data.service';
import {Occupation} from '../../../../admin/modal/occupation';
import {IncomeSource} from '../../../../admin/modal/incomeSource';
import {CustomerService} from '../../../../admin/service/customer.service';
import {Customer} from '../../../../admin/modal/customer';
import {EntityInfo} from '../../../../admin/modal/entity-info';


@Component({
    selector: 'app-dms-loan',
    templateUrl: './dms-loan-file.component.html',
    styleUrls: ['./dms-loan-file.component.css']
})

export class DmsLoanFileComponent implements OnInit {
    public static FILE_SIZE = 500000;
    @Input()
    loanDataHolder: LoanDataHolder;
    loanForm: FormGroup;
    // customerInfo: Customer = new Customer();
    // entityInfo: EntityInfo = new EntityInfo();
    submitted = false;

    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    document: LoanDocument = new LoanDocument();
    renew = true;
    loan: LoanConfig = new LoanConfig();
    permissions = [];
    loanName: string;
    loanConfig: LoanConfig = new LoanConfig();
    customerId: number;
    errorMessage: string;
    dropdownPriorities = [];
    documentMaps = [];
    documentMap: string;
    allId;
    imagePaths: string[] = [];
    imageUrl = [];
    action: string;
    loanConfigId: number;
    hasPreviousLoan = false;
    previousLoans: Array<LoanDataHolder>;
    spinner = false;
    personal = true;
    occupations = Occupation.enumObject();
    incomeSources = IncomeSource.enumObject();
    security = Security.enumObject();
    customerSearch = {
        citizenshipNumber: undefined
    };
    customerFormField = {
        showFormField: false,
        isOldCustomer: false
    };

    constructor(private formBuilder: FormBuilder,
                private loanDataService: LoanDataService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private dmsLoanService: DmsLoanService,
                private loanFormService: LoanFormService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private customerService: CustomerService) {
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


        if (this.loanDataHolder.dmsLoanFile.id !== undefined) {
            this.action = 'EDIT';
            this.imagePaths = JSON.parse(this.loanDataHolder.dmsLoanFile.documentPath);
        }
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                this.loanName = this.loanConfig.name;
                this.initialDocuments = this.loanConfig.initial;
                this.renewDocuments = this.loanConfig.renew;
            }
        );

        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];
        this.loanForm = this.formBuilder.group({
            customerEntityId:
                [(this.loanDataHolder.customerInfo === undefined
                    || this.loanDataHolder.customerInfo.id === undefined) ? '' :
                    this.loanDataHolder.customerInfo.id],
            customerVersion:
                [(this.loanDataHolder.customerInfo === undefined
                    || this.loanDataHolder.customerInfo.version === undefined) ? '' :
                    this.loanDataHolder.customerInfo.version],
            customerName:
                [(this.loanDataHolder.customerInfo === undefined
                    || this.loanDataHolder.customerInfo.customerName === undefined) ? '' :
                    this.loanDataHolder.customerInfo.customerName, Validators.required],
            dob:
                [(this.loanDataHolder.customerInfo === undefined
                    || this.loanDataHolder.customerInfo.dob === undefined) ? '' :
                    this.loanDataHolder.customerInfo.dob, Validators.required],
            companyId:
                [(this.loanDataHolder.entityInfo === undefined || this.loanDataHolder.entityInfo.id === undefined) ? '' :
                    this.loanDataHolder.entityInfo.id],
            companyName:
                [(this.loanDataHolder.entityInfo === undefined
                    || this.loanDataHolder.entityInfo.companyName === undefined) ? '' :
                    this.loanDataHolder.entityInfo.companyName],
            registrationNumber: [(this.loanDataHolder.entityInfo === undefined
                || this.loanDataHolder.entityInfo.registrationNumber === undefined) ? '' :
                this.loanDataHolder.entityInfo.registrationNumber],
            citizenshipNumber:
                [(this.loanDataHolder.customerInfo === undefined)
                || (this.loanDataHolder.customerInfo.citizenshipNumber === undefined) ? '' :
                    this.loanDataHolder.customerInfo.citizenshipNumber],
            contactNumber: [(this.loanDataHolder.customerInfo === undefined
                || this.loanDataHolder.customerInfo.contactNumber === undefined) ? '' :
                this.loanDataHolder.customerInfo.contactNumber, Validators.required],
            occupation: [(this.loanDataHolder.customerInfo === undefined
                || this.loanDataHolder.customerInfo.occupation === undefined) ? '' :
                this.loanDataHolder.customerInfo.occupation, Validators.required],
            incomeSource: [(this.loanDataHolder.customerInfo === undefined
                || this.loanDataHolder.customerInfo.incomeSource === undefined) ? '' :
                this.loanDataHolder.customerInfo.incomeSource, Validators.required],
            interestRate: [this.loanDataHolder.dmsLoanFile.interestRate === undefined ? '' : this.loanDataHolder.dmsLoanFile.interestRate,
                [Validators.required, Validators.min(0)]],
            proposedAmount: [this.loanDataHolder.dmsLoanFile.proposedAmount === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.proposedAmount,
                [Validators.required, Validators.min(0)]],
            security: [this.loanDataHolder.dmsLoanFile.securities === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.securities, Validators.required],
            serviceChargeType: [this.loanDataHolder.dmsLoanFile.serviceChargeType === undefined ? 'Percentage' :
                this.loanDataHolder.dmsLoanFile.serviceChargeType,
                Validators.required],
            serviceChargeAmount: [this.loanDataHolder.dmsLoanFile.serviceChargeAmount === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.serviceChargeAmount,
                [Validators.required, Validators.min(0)]],
            tenureDuration: [this.loanDataHolder.dmsLoanFile.tenureDuration === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.tenureDuration,
                [Validators.required, Validators.min(0)]],
            priority: [this.loanDataHolder.dmsLoanFile.priority === undefined ? '' : this.loanDataHolder.dmsLoanFile.priority,
                [Validators.required, Validators.min(0)]],
            recommendation: [this.loanDataHolder.dmsLoanFile.recommendationConclusion === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.recommendationConclusion,
                Validators.required],
            waiver: [this.loanDataHolder.dmsLoanFile.waiver === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.waiver, Validators.required],
            fmvTotal: [this.loanDataHolder.dmsLoanFile.fmvTotal === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.fmvTotal, Validators.min(0)],
            totalLoanLimit: [this.loanDataHolder.dmsLoanFile.totalLoanLimit === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.totalLoanLimit,
                [Validators.required, Validators.min(0)]],
            groupExpo: [this.loanDataHolder.dmsLoanFile.groupExpo === undefined ? '' : this.loanDataHolder.dmsLoanFile.groupExpo],
            fmvFundingPercent: [this.loanDataHolder.dmsLoanFile.fmvFundingPercent === undefined ? '' :
                this.loanDataHolder.dmsLoanFile.fmvFundingPercent, Validators.min(0)],
            file: ['']
        });
        this.reqPersonalOrBusiness();
        if (this.renewDocuments.length > 0) {
            this.renew = true;
        }

    }

    onSubmit() {
        this.loanDataHolder.customerInfo.id = this.loanForm.get('customerEntityId').value;
        this.loanDataHolder.customerInfo.version = this.loanForm.get('customerVersion').value;
        this.loanDataHolder.customerInfo.customerName = this.loanForm.get('customerName').value;
        this.loanDataHolder.entityInfo.id = this.loanForm.get('companyId').value;
        this.loanDataHolder.entityInfo.companyName = this.loanForm.get('companyName').value;
        this.loanDataHolder.entityInfo.registrationNumber = this.loanForm.get('registrationNumber').value;
        this.loanDataHolder.customerInfo.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanDataHolder.customerInfo.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanDataHolder.customerInfo.dob = this.loanForm.get('dob').value;
        this.loanDataHolder.customerInfo.occupation = this.loanForm.get('occupation').value;
        this.loanDataHolder.customerInfo.incomeSource = this.loanForm.get('incomeSource').value;
        this.loanDataHolder.dmsLoanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanDataHolder.dmsLoanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanDataHolder.dmsLoanFile.securities = this.loanForm.get('security').value;
        this.loanDataHolder.dmsLoanFile.tenureDuration = this.loanForm.get('tenureDuration').value;
        this.loanDataHolder.dmsLoanFile.serviceChargeType = this.loanForm.get('serviceChargeType').value;
        this.loanDataHolder.dmsLoanFile.serviceChargeAmount = this.loanForm.get('serviceChargeAmount').value;
        this.loanDataHolder.dmsLoanFile.priority = this.loanForm.get('priority').value;
        this.loanDataHolder.dmsLoanFile.waiver = this.loanForm.get('waiver').value;
        this.loanDataHolder.dmsLoanFile.recommendationConclusion = this.loanForm.get('recommendation').value;
        this.loanDataHolder.dmsLoanFile.fmvTotal = this.loanForm.get('fmvTotal').value;
        this.loanDataHolder.dmsLoanFile.fmvFundingPercent = this.loanForm.get('fmvFundingPercent').value;
        this.loanDataHolder.dmsLoanFile.groupExpo = this.loanForm.get('groupExpo').value;
        this.loanDataHolder.dmsLoanFile.totalLoanLimit = this.loanForm.get('totalLoanLimit').value;
        // console.log(this.loanDataHolder.dmsLoanFile);
        // console.log(this.loanDataHolder.customerInfo);
        // console.log(this.loanDataHolder.entityInfo);
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
                this.loanDataHolder.dmsLoanFile.documents.push(this.document);
                this.documentMap = documentName + ':' + result.detail;
                if (!this.documentMaps.includes(this.documentMap)) {
                    this.documentMaps.push(this.documentMap);
                }
                this.loanDataHolder.dmsLoanFile.documentMap = this.documentMaps;
                this.document = new LoanDocument();
            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error occurred while uploading the document'));
            }
        );
    }

    searchByCitizenship() {
        this.customerSearch.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.customerService.getPaginationWithSearchObject(this.customerSearch).subscribe((customerResponse: any) => {
            console.log(customerResponse);
            if (customerResponse.detail.content.length <= 0) {
                this.customerFormField.isOldCustomer = false;
                this.toastService.show(new Alert(AlertType.INFO, 'No Customer'));
                this.loanForm.patchValue({
                    customerEntityId: '',
                    customerVersion: '',
                    customerName: '',
                    dob: '',
                    contactNumber: '',
                    occupation: '',
                    incomeSource: ''
                });
            } else {
                this.customerFormField.isOldCustomer = true;
                const customer: Customer = customerResponse.detail.content[0];
                this.loanForm.patchValue({
                    customerEntityId: customer.id,
                    customerVersion: customer.version,
                    customerName: customer.customerName,
                    dob: customer.dob,
                    contactNumber: customer.contactNumber,
                    occupation: customer.occupation,
                    incomeSource: customer.incomeSource
                });
                this.loanFormService.getLoansByCitizenship(customer.citizenshipNumber).subscribe((response: any) => {
                    this.previousLoans = response.detail;
                    this.hasPreviousLoan = this.previousLoans.length > 0;
                }, error => console.error(error));
            }
        });
        this.customerFormField.showFormField = true;
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
        console.log(regNO);
        this.loanFormService.getLoansByRegistrationNumber(regNO).subscribe((response: any) => {
            console.log(response);
            if (response.detail.length <= 0) {
                this.toastService.show(new Alert(AlertType.INFO, 'No company  under given registration number.'));
                this.loanForm.patchValue({
                    companyId: '',
                    companyName: ''
                });
            } else {
                console.log(response.detail[0]);
                const entityInfo: EntityInfo = response.detail[0].dmsLoanFile.entityInfo;
                this.loanForm.patchValue({
                    companyId: entityInfo.id,
                    companyName: entityInfo.companyName
                });
            }
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

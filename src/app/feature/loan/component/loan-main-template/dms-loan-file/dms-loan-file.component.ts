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
    loanFile: DmsLoanFile;
    loanForm: FormGroup;
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

        this.dropdownPriorities = [
            {id: 'HIGH', name: 'High'},
            {id: 'MEDIUM', name: 'Medium'},
            {id: 'LOW', name: 'Low'},

        ];
        this.loanForm = this.formBuilder.group({
            customerEntityId:
                [(this.loanFile.customer === undefined
                    || this.loanFile.customer.id === undefined) ? '' :
                    this.loanFile.customer.id],
            customerName:
                [(this.loanFile.customer === undefined
                    || this.loanFile.customer.customerName === undefined) ? '' :
                    this.loanFile.customer.customerName, Validators.required],
            dob:
                [(this.loanFile.customer === undefined
                    || this.loanFile.customer.dob === undefined) ? '' :
                    this.loanFile.customer.dob, Validators.required],
            companyId:
                [(this.loanFile.entityInfo === undefined || this.loanFile.entityInfo.id === undefined) ? '' :
                    this.loanFile.entityInfo.id],
            companyName:
                [(this.loanFile.entityInfo === undefined
                    || this.loanFile.entityInfo.companyName === undefined) ? '' :
                    this.loanFile.entityInfo.companyName],
            registrationNumber: [(this.loanFile.entityInfo === undefined
                || this.loanFile.entityInfo.registrationNumber === undefined) ? '' :
                this.loanFile.entityInfo.registrationNumber],
            citizenshipNumber:
                [(this.loanFile.customer === undefined)
                || (this.loanFile.customer.citizenshipNumber === undefined) ? '' :
                    this.loanFile.customer.citizenshipNumber],
            contactNumber: [(this.loanFile.customer === undefined
                || this.loanFile.customer.contactNumber === undefined) ? '' :
                this.loanFile.customer.contactNumber, Validators.required],
            occupation: [(this.loanFile.customer === undefined
                || this.loanFile.customer.occupation === undefined) ? '' :
                this.loanFile.customer.occupation, Validators.required],
            incomeSource: [(this.loanFile.customer === undefined
                || this.loanFile.customer.incomeSource === undefined) ? '' :
                this.loanFile.customer.incomeSource, Validators.required],
            interestRate: [this.loanFile.interestRate === undefined ? '' : this.loanFile.interestRate,
                [Validators.required, Validators.min(0)]],
            proposedAmount: [this.loanFile.proposedAmount === undefined ? '' : this.loanFile.proposedAmount,
                [Validators.required, Validators.min(0)]],
            security: [this.loanFile.securities === undefined ? '' : this.loanFile.securities, Validators.required],
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

    onSubmit() {
        this.loanFile.customer.id = this.loanForm.get('customerEntityId').value;
        this.loanFile.customer.customerName = this.loanForm.get('customerName').value;
        this.loanFile.entityInfo.id = this.loanForm.get('companyId').value;
        this.loanFile.entityInfo.companyName = this.loanForm.get('companyName').value;
        this.loanFile.entityInfo.registrationNumber = this.loanForm.get('registrationNumber').value;
        this.loanFile.customer.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.loanFile.customer.contactNumber = this.loanForm.get('contactNumber').value;
        this.loanFile.customer.dob = this.loanForm.get('dob').value;
        this.loanFile.customer.occupation = this.loanForm.get('occupation').value;
        this.loanFile.customer.incomeSource = this.loanForm.get('incomeSource').value;
        this.loanFile.interestRate = this.loanForm.get('interestRate').value;
        this.loanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
        this.loanFile.securities = this.loanForm.get('security').value;
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
        this.customerSearch.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
        this.customerService.getPaginationWithSearchObject(this.customerSearch).subscribe((customerResponse: any) => {
            if (customerResponse.detail.content.length <= 0) {
                this.toastService.show(new Alert(AlertType.INFO, 'No Customer'));
                this.loanForm.patchValue({
                    customerEntityId: '',
                    customerName: '',
                    dob: '',
                    contactNumber: '',
                    occupation: '',
                    incomeSource: ''
                });
            } else {
                const customer: Customer = customerResponse.detail.content[0];
                this.loanForm.patchValue({
                    customerEntityId: customer.id,
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

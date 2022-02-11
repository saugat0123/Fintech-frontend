import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import * as CryptoJS from 'crypto-js';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {PreProcessModel} from '../../model/preProcess.model';
import {PreProcessService} from '../../service/pre-process.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {CustomerType} from '../../../customer/model/customerType';
import {Router} from '@angular/router';
import {PreProcessStatus} from '../pre-process-enums/pre-process-status';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {CustomerService} from '../../../customer/service/customer.service';
import {CompanyService} from '../../../admin/component/company/company.service';
import {DocStatus} from '../../../loan/model/docStatus';
import {Proposal} from '../../../admin/modal/proposal';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanTag} from '../../../loan/model/loanTag';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-pre-process-loan-modal',
    templateUrl: './pre-process-loan-modal.component.html',
    styleUrls: ['./pre-process-loan-modal.component.scss']
})
export class PreProcessLoanModalComponent implements OnInit {
    @Input() preProcessDetails: PreProcessModel;
    @Input() customerInfoId: number;
    @Input() loanConfigId: number;
    @Input() customerProfileId;
    @Input() loanType;
    @Input() customerType: CustomerType;
    @Input() customerInfoDetails: CustomerInfoData;
    parsedData: any;
    spinner = false;
    loanCategory;

    loanData: LoanDataHolder = new LoanDataHolder();
    proposal: Proposal = new Proposal();
    loanConfig: LoanConfig = new LoanConfig();
    dropdownPriorities = [
        {id: 'HIGH', name: 'High'},
        {id: 'MEDIUM', name: 'Medium'},
        {id: 'LOW', name: 'Low'},

    ];
    validateUrl = environment.validationUrl;

    constructor(private nbDialogService: NbDialogService,
                private dialogRef: NbDialogRef<PreProcessLoanModalComponent>,
                private preProcessService: PreProcessService,
                private toastService: ToastService,
                private route: Router,
                private customerService: CustomerService,
                private companyService: CompanyService,
                private loanFormService: LoanFormService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.preProcessDetails.data)) {
            this.parsedData = JSON.parse(this.preProcessDetails.data);
        }
        if (!ObjectUtil.isEmpty(this.customerProfileId)) {
            if (this.customerType === CustomerType.INDIVIDUAL) {
                this.getCustomerDetails(this.customerProfileId);
            }
            if (this.customerType === CustomerType.INSTITUTION) {
                this.getCompanyInfoDetails(this.customerProfileId);
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfoDetails)) {
            this.setSecurityDetails(this.customerInfoDetails);
        }
        this.checkSecurityDetails();
    }

    redirectPage() {
        const tempAt = this.getATStorage();
        const finalEncryptedAt = this.removeSpecialCharacters(this.encryptUrl(tempAt, 'at'));
        const finalEncryptedId = this.removeSpecialCharacters(this.encryptUrl(this.customerInfoId, 'id'));
        const encryptLoanId = this.removeSpecialCharacters(this.encryptUrl(this.loanConfigId, 'loanConfigId'));
        // window.location.href = `http://localhost:4200/#/home/preprocess/${finalEncryptedId}/${finalEncryptedAt}/${encryptLoanId}`;
        window.location.href = `${this.validateUrl}/#/home/preprocess/${finalEncryptedId}/${finalEncryptedAt}/${encryptLoanId}
        ?loanType=${this.loanType}&customerType=${this.customerType}&customerProfileId=${this.customerProfileId}&loanCategory=${this.customerType} `;
    }

    encryptUrl(id, key: String) {
        const i = CryptoJS.AES.encrypt(id.toString(), key).toString();
        return i;
    }

    getATStorage() {
        const storage = LocalStorageUtil.getStorage();
        return storage.at;
    }

    removeSpecialCharacters(data) {
        // Replaced Text
        const cipherText = data.replace(/\+/g, 'pl1U2ops').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
        return cipherText;
    }

    async submit() {
        this.spinner = true;
        /* Checking security Details */
        this.checkSecurityDetails();
        const preProcess = new PreProcessModel();
        preProcess.id = this.preProcessDetails.id;
        preProcess.data = this.preProcessDetails.data;
        preProcess.status = PreProcessStatus.PROCEED;
        this.setLoanDetails(this.preProcessDetails);
        /* For Save */
        await this.preProcessService.saveDetails(preProcess, this.loanConfigId, this.customerInfoId).subscribe((res: any) => {
            /*this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved and proceed the details !'));*/
            this.spinner = false;
            this.close();

        }, error => {
            /*this.toastService.show(new Alert(AlertType.DANGER, 'Unable to proceed the data!'));*/
            this.spinner = false;
        });
        await this.saveLoanDetails(this.loanData);

        this.routeToLoanForm();
    }

    close() {
        this.dialogRef.close();
    }

    routeToLoanForm() {
        this.route.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.loanConfigId,
                customerInfoId: this.customerInfoId,
                customerType: this.preProcessDetails.customerInfo.customerType,
                customerProfileId: this.customerProfileId,
                loanCategory: this.preProcessDetails.customerInfo.customerType,
                loanType: this.loanType,
                preProcessId: this.preProcessDetails.id,
            }
        });
    }

    getCustomerDetails(id) {
        this.spinner = true;
        this.customerService.detail(id).subscribe((res: any) => {
            this.loanData.customerInfo = res.detail;
            this.spinner = false;
        }, error => {
            this.spinner = false;
            console.log(error);
        });
    }

    getCompanyInfoDetails(id) {
        this.spinner = true;
        this.companyService.detail(id).subscribe((res: any) => {
            this.loanData.companyInfo = res.detail;
            this.spinner = false;
        }, error => {
            this.spinner = false;
            console.log(error);
        });
    }

    saveLoanDetails(loanData: LoanDataHolder) {
        this.spinner = true;
        this.loanFormService.save(loanData).subscribe((res: any) => {
            console.log(res.detail);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved and raised the loan !'));
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while saving details ! '));
            this.spinner = false;
        });
    }

    setProposalDetails() {
        const tempData = JSON.parse(this.preProcessDetails.data);
        this.proposal.proposedLimit = tempData.loanAmount;
        this.proposal.data = this.preProcessDetails.data;
    }

    setLoanDetails(preProcessData) {
        if (!ObjectUtil.isEmpty(this.preProcessDetails)) {
            this.setProposalDetails();
            this.loanConfig.id = this.loanConfigId;
            const tempCategory = this.preProcessDetails.loanConfig.loanCategory;
            this.loanData.loanHolder = this.preProcessDetails.customerInfo;
            this.loanData.loanCategory = tempCategory;
            this.loanData.loan = this.loanConfig;
            this.loanData.priority = this.dropdownPriorities[1].id;
            this.loanData.documentStatus = DocStatus.value(DocStatus.UNDER_REVIEW);
            this.loanData.loanType = this.loanType;
            this.loanData.proposal = this.proposal;
        }
        console.log(this.loanData);
    }

    /* CHECK SECURITY DETAILS */
    checkSecurityDetails() {
        const securityDetails = this.customerInfoDetails.security ? JSON.parse(this.customerInfoDetails.security.data) : undefined;
        const tempLoanConfig = this.preProcessDetails.loanConfig;
        if (ObjectUtil.isEmpty(securityDetails)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Security is Empty! Please Fill the security '));
        }
        /*if (!ObjectUtil.isEmpty(securityDetails) && !ObjectUtil.isEmpty(tempLoanConfig)) {
            switch (tempLoanConfig.loan) {
                case LoanTag.getKeyByValue(LoanTag.SHARE_SECURITY) :
                    if (!securityDetails.selectedArray.includes('ShareSecurity')) {
                        this.toastService.show(new Alert(AlertType.INFO, 'Fill Share Security for Share Loan'));
                    }
                    break;
                case LoanTag.getKeyByValue(LoanTag.FIXED_DEPOSIT) :
                    if (!securityDetails.selectedArray.includes('FixedDeposit')) {
                        this.toastService.show(new Alert(AlertType.INFO, 'Fill Fixed Deposit Security for Fixed Deposit Loan'));
                    } else {
                        this.routeToLoanForm();

                    }
                    break;
                case LoanTag.getKeyByValue(LoanTag.VEHICLE) :
                    if (!securityDetails.selectedArray.includes('VehicleSecurity')) {
                        this.toastService.show(new Alert(AlertType.INFO, 'Fill Vehicle Security for Vehicle Loan'));
                    } else {
                        this.routeToLoanForm();

                    }
                    break;
            }
        }*/
    }


    /* For Security and other details */
    setSecurityDetails(details) {
        this.loanData.siteVisit = this.customerInfoDetails.siteVisit;
        this.loanData.financial = this.customerInfoDetails.financial;
        this.loanData.creditRiskGradingAlpha = this.customerInfoDetails.creditRiskGradingAlpha;
        this.loanData.creditRiskGrading = this.customerInfoDetails.creditRiskGrading;
        this.loanData.crgGamma = this.customerInfoDetails.crgGamma;
        this.loanData.security = this.customerInfoDetails.security;
        this.loanData.shareSecurity = this.customerInfoDetails.shareSecurity;
        this.loanData.insurance = this.customerInfoDetails.insurance;
    }


}

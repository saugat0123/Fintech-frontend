import {Component, OnInit} from '@angular/core';
import {Branch} from '../../admin/modal/branch';
import {LoanConfig} from '../../admin/modal/loan-config';
import {LoanDataHolder} from '../model/loanData';
import {Role} from '../../admin/modal/role';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../model/loanType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanActionService} from '../loan-action/service/loan-action.service';
import {UserService} from '../../admin/component/user/user.service';
import {SocketService} from '../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from '../../admin/component/catalogue/catalogue.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {RoleType} from '../../admin/modal/roleType';
import {RoleAccess} from '../../admin/modal/role-access';
import {DocStatus} from '../model/docStatus';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {DocAction} from '../model/docAction';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {OfferLetter} from '../../admin/modal/offerLetter';
import {CustomerOfferLetterService} from '../service/customer-offer-letter.service';

@Component({
    selector: 'app-loan-offer-letter',
    templateUrl: './loan-offer-letter.component.html',
    styleUrls: ['./loan-offer-letter.component.scss']
})
export class LoanOfferLetterComponent implements OnInit {

    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    roleList: Array<Role> = new Array<Role>();
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    age: number;
    loanType = LoanType;
    filterForm: FormGroup;
    tempLoanType = null;
    validStartDate = true;
    validEndDate = true;
    transferDoc = false;
    roleType = false;
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;
    loanDataHolder: LoanDataHolder;
    formAction: FormGroup;
    redirected = false;
    isFilterCollapsed = true;
    loanConfig: LoanConfig = new LoanConfig();
    uploadFile;
    preview;
    customerId;
    valForwardBackward;
    roleName = false;

    constructor(
        private branchService: BranchService,
        private loanConfigService: LoanConfigService,
        private toastService: ToastService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private loanActionService: LoanActionService,
        private userService: UserService,
        private socketService: SocketService,
        private catalogueService: CatalogueService,
        private customerOfferLetterService: CustomerOfferLetterService) {
    }

    static loadData(other: LoanOfferLetterComponent) {
        other.catalogueService.search.committee = 'true';
        other.customerOfferLetterService.getIssuedOfferLetter(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.redirected = paramsValue.redirect === 'true';
            });

        if (localStorage.getItem('roleType') === RoleType.MAKER) {
            this.roleType = true;
        }
        if (localStorage.getItem('roleName') === 'CAD') {
            this.roleName = true;
        }
        this.buildFilterForm();
        this.buildActionForm();

        this.roleAccess = localStorage.getItem('roleAccess');
        if (localStorage.getItem('roleType') === RoleType.MAKER) {
            this.roleType = true;
        }
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }

        if (this.accessSpecific || this.accessAll) {
            this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                this.branchList = response.detail;
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
            });
        }
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });


        if (localStorage.getItem('username') === 'SPADMIN') {
            this.transferDoc = true;
        }

        if (!this.redirected) {
            // reset filter object if not redirected from other component
            const resetSearch: CatalogueSearch = new CatalogueSearch();
            resetSearch.documentStatus = DocStatus.value(DocStatus.PENDING);
            this.catalogueService.search = resetSearch;
        }
        LoanOfferLetterComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            loanNewRenew: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            role: [undefined],
            customerName: [undefined]
        });
    }

    buildActionForm(): void {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );
    }

    changePage(page: number) {
        this.page = page;
        LoanOfferLetterComponent.loadData(this);
    }

    getDifferenceInDays(createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const current = new Date();
        return Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }

    getDaysDifference(lastModifiedDate: Date, createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const lastModifiedAt = new Date(lastModifiedDate);
        return Math.floor((Date.UTC(lastModifiedAt.getFullYear(), lastModifiedAt.getMonth(), lastModifiedAt.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }

    checkIfDateFiltration() {
        this.validStartDate = this.filterForm.get('startDate').valid;
        this.validEndDate = this.filterForm.get('endDate').valid;
    }

    onSearch() {
        this.tempLoanType = null;
        this.catalogueService.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined :
            this.filterForm.get('branch').value;
        this.catalogueService.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ? undefined :
            this.filterForm.get('loanType').value;
        this.catalogueService.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanNewRenew').value) ? undefined :
            this.filterForm.get('loanNewRenew').value;
        if (!ObjectUtil.isEmpty(this.filterForm.get('startDate').value) && this.filterForm.get('endDate').value) {
            this.catalogueService.search.currentStageDate = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.catalogueService.search.currentUserRole = ObjectUtil.isEmpty(this.filterForm.get('role').value) ? undefined :
            this.filterForm.get('role').value;
        this.catalogueService.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
            this.filterForm.get('customerName').value;
        LoanOfferLetterComponent.loadData(this);
    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                catalogue: true
            }
        });
    }

    clearSearch() {
        this.buildFilterForm();
        this.isFilterCollapsed = true;
    }

    onPullClick(template, customerLoanId, userId) {

        this.formAction.patchValue({
                customerLoanId: customerLoanId,
                docAction: DocAction.value(DocAction.PULLED),
                documentStatus: DocStatus.PENDING,
                comment: 'PULLED'
            }
        );
        this.modalService.open(template);
    }

    onClose() {
        this.modalService.dismissAll();
    }


    docTransfer(userId, roleId) {
        const users = {id: userId};
        const role = {id: roleId};
        this.formAction.patchValue({
                toUser: users,
                toRole: role
            }
        );
    }

    confirm() {
        this.onClose();
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));

            LoanOfferLetterComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    onChange(data, onActionChange) {
        this.loanDataHolder = data;
        this.modalService.open(onActionChange);

    }


    getCsv() {
        this.loanFormService.download(this.catalogueService.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

    generateOfferLetter(offerLetter: OfferLetter, customerLoan: LoanDataHolder) {
        let existing = false;
        if (customerLoan.customerOfferLetter) {
            customerLoan.customerOfferLetter.customerOfferLetterPath.forEach(existingOfferLetter => {
                if (offerLetter.id === existingOfferLetter.id) {
                    existing = true;
                }
            });
        }
        this.router.navigate([offerLetter.templateUrl],
            {
                queryParams: {
                    customerId: customerLoan.id,
                    offerLetterId: offerLetter.id,
                    existing: existing
                }
            });
    }

    uploadOfferLetterTemplate(uploadDocument, customerId) {
        this.preview = false;
        this.customerId = customerId;
        this.modalService.open(uploadDocument);
    }

    uploadOfferLetter(event) {
        this.uploadFile = event.target.files[0];
        this.preview = true;
    }

    previewClick(file) {
        alert(file);
        let fileName = this.uploadFile;
        if (file !== null) {
            fileName = ApiConfig.URL + '/' + file;

            const link = document.createElement('a');
            link.href = fileName;
            link.target = '_blank';
            link.click();
        } else {
            const downloadUrl = window.URL.createObjectURL(fileName);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.click();
        }
    }

    submitOfferLetter() {
        const formdata: FormData = new FormData();

        formdata.append('file', this.uploadFile);
        formdata.append('id', this.customerId);
        formdata.append('status', DocStatus[DocStatus.PENDING]);
        if (this.customerId === undefined) {
            return this.toastService.show(new Alert(AlertType.ERROR, 'Customer Cannot be empty'));
        }
        this.customerOfferLetterService.uploadOfferFile(formdata).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'OFFER LETTER HAS BEEN UPLOADED'));
            this.modalService.dismissAll();
            LoanOfferLetterComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.modalService.dismissAll();
        });

    }

    openForwardBackward(template, offerLetterId, val) {
        this.valForwardBackward = 'FORWARD to CAD ?';
        if (val === 0) {
            this.valForwardBackward = 'Backward to RM ?';
        }
        this.modalService.dismissAll();
        this.modalService.open(template);
    }

}

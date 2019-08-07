import {Component, OnInit} from '@angular/core';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {LoanConfig} from '../../modal/loan-config';
import {LoanConfigService} from '../loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {DocStatus} from '../../../loan/model/docStatus';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoleAccess} from '../../modal/role-access';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Role} from '../../modal/role';
import {RoleService} from '../role-permission/role.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user/user.service';
import {LoanActionService} from '../../../loan/loan-action/service/loan-action.service';
import {LoanType} from '../../../loan/model/loanType';
import {RoleType} from '../../modal/roleType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';


@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    roleList: Array<Role> = new Array<Role>();
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    age: number;
    docStatus = DocStatus;
    loanType = LoanType;
    filterForm: FormGroup;
    tempLoanType = null;
    validStartDate = true;
    validEndDate = true;
    transferDoc = false;
    roleType = false;
    search: any = {
        branchIds: undefined,
        documentStatus: DocStatus.value(DocStatus.PENDING),
        loanConfigId: undefined,
        currentStageDate: undefined,
        currentUserRole: undefined,
        toUser: undefined
    };
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;
    statusApproved = false;
    loanDataHolder: LoanDataHolder;
    id;
    transferUserList;
    formAction: FormGroup;

    constructor(private branchService: BranchService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loanFormService: LoanFormService,
                private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private loanActionService: LoanActionService,
                private userService: UserService,
                private roleService: RoleService) {
    }

    static loadData(other: CatalogueComponent) {
        other.loanFormService.getCatalogues(other.search, other.page, 10).subscribe((response: any) => {
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
        this.buildFilterForm();
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
        if (this.accessAll) {
            this.roleService.getAll().subscribe(
                (response: any) => {
                    this.roleList = response.detail;
                    this.roleList.splice(0, 1); // removes ADMIN
                }, error => {
                    console.log(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Roles'));
                }
            );
        }
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.id = {
                    userId: null
                };
                this.id = paramsValue;
            });
        if (this.id.userId !== undefined) {
            this.transferDoc = true;
        }

        if (localStorage.getItem('username') === 'SPADMIN') {
            this.transferDoc = true;
        }
        this.search.toUser = this.id.userId;
        CatalogueComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            loanNewRenew: [undefined],
            docStatus: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            role: [undefined]
        });
    }

    changePage(page: number) {
        this.page = page;
        CatalogueComponent.loadData(this);
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
        this.statusApproved = this.filterForm.get('docStatus').value === 'APPROVED';
        this.search.branchIds = this.filterForm.get('branch').value === null ? undefined :
            this.filterForm.get('branch').value;
        this.search.documentStatus = this.filterForm.get('docStatus').value === null ? DocStatus.value(DocStatus.PENDING) :
            this.filterForm.get('docStatus').value;
        this.search.loanConfigId = this.filterForm.get('loanType').value === null ? undefined :
            this.filterForm.get('loanType').value;
        this.search.loanNewRenew = this.filterForm.get('loanNewRenew').value === null ? undefined :
            this.filterForm.get('loanNewRenew').value;
        if (this.filterForm.get('startDate').value !== null && this.filterForm.get('endDate').value) {
            this.search.currentStageDate = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.search.currentUserRole = this.filterForm.get('role').value === null ? undefined :
            this.filterForm.get('role').value;
        CatalogueComponent.loadData(this);
    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: loanConfigId, customerId: customerId, catalogue: true}});
    }

    clearSearch() {
        this.buildFilterForm();
    }

    onTransferClick(template, customerLoanId, userId) {
        this.userService.getUserListForTransfer(userId).subscribe((res: any) => {
            this.transferUserList = res.detail;
        });
        this.formAction.patchValue({
                customerLoanId: customerLoanId,
                docAction: 'TRANSFER',
                documentStatus: DocStatus.PENDING,
                comment: 'TRANSFER'
            }
        );
        this.modalService.open(template);
    }

    onClose() {
        this.modalService.dismissAll();
    }

    changeAction() {
        this.loanDataHolder.loanType = this.tempLoanType;
        this.loanFormService.renewLoan(this.loanDataHolder).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated loan type.'));
                this.modalService.dismissAll('Close modal');
                this.tempLoanType = null;
                this.clearSearch();
                this.search.documentStatus = DocStatus.APPROVED;
                this.onSearch();
            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to update loan type.'));
                this.modalService.dismissAll('Close modal');
            }
        );

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

    action(templates) {
        this.onClose();
        this.modalService.open(templates);
    }

    confirm() {
        this.onClose();
        this.loanActionService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            CatalogueComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    onChange(data, onActionChange) {
        this.loanDataHolder = data;
        this.modalService.open(onActionChange);

    }

    renewedOrCloseFrom(loanConfigId, childId) {
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: childId,
                catalogue: true
            }

        });


    }

    getCsv() {
        this.loanFormService.download(this.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

}

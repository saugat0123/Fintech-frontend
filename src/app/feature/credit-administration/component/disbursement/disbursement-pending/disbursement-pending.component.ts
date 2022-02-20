import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {LoanType} from '../../../../loan/model/loanType';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {UserService} from '../../../../../@core/service/user.service';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {AssignPopUpComponent} from '../../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {Role} from '../../../../admin/modal/role';

@Component({
    selector: 'app-disbursement-pending',
    templateUrl: './disbursement-pending.component.html',
    styleUrls: ['./disbursement-pending.component.scss']
})
export class DisbursementPendingComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {docStatus: 'DISBURSEMENT_PENDING', isCadFile: 'true'};
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    loanList = [];
    loanType = LoanType;
    toggleArray: { toggled: boolean }[] = [];
    encryptUrlArray: { url: string }[] = [];
    currentIndexArray: { currentIndex: number }[] = [];

    user: User = new User();
    roleType = RoleType;
    storage = LocalStorageUtil.getStorage();
    cadData;
    productUtils = LocalStorageUtil.getStorage().productUtil;
    constructor(private service: CreditAdministrationService,
                private router: Router,
                private routeService: RouterUtilsService,
                private userService: UserService,
                private modalService: NgbModal,
                private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: DisbursementPendingComponent) {
        other.spinner = true;
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.loanList = [];
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            // tslint:disable-next-line:max-line-length
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
            console.log(other.loanList);
            other.pageable = PaginationUtils.getPageable(res.detail);
            other.spinner = false;

        }, error => {
            other.spinner = false;
            console.log(error);
        });
    }

    ngOnInit() {
        this.userDetail();
        DisbursementPendingComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        DisbursementPendingComponent.loadData(this);
    }

    loadProfile(cadDocumentId, model) {
        console.log('this is cad', cadDocumentId);
        this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
    }

    setSearchValue(value) {
        this.searchObj = Object.assign(value, {docStatus: 'DISBURSEMENT_PENDING'});
        DisbursementPendingComponent.loadData(this);
    }

    userDetail() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
        });
    }
        openPopUp(template, data) {
        this.cadData = data;
        this.modalService.open(template, {
            size: 'xl',
            windowClass: 'on-pull-click full-width modal'
        });
    }
    onClose() {
        this.modalService.dismissAll();
    }
    openAssignPopUp(data: CustomerApprovedLoanCadDocumentation) {
        const comp = this.modalService.open(AssignPopUpComponent);
        const dataCad = {
            cadId: data.id,
            branch: data.loanHolder.branch,
            associateId: data.loanHolder.associateId,
            id: data.loanHolder.id,
            customerType: data.loanHolder.customerType,
            idNumber: data.loanHolder.idNumber,
            idRegDate: data.loanHolder.idRegDate,
            idRegPlace: data.loanHolder.idRegPlace,
            name: data.loanHolder.customerType,
            customerLoanDtoList: data.assignedLoan
        };
        comp.componentInstance.cadData = dataCad;
        comp.componentInstance.disbursementDataAssign = true;
        comp.result.then(() => {
            DisbursementPendingComponent.loadData(this);
            console.log('When exposure closes');
        }, () => {
            DisbursementPendingComponent.loadData(this);
        });
    }
    pullLoan(data) {
        const user = new User();
        user.id = +LocalStorageUtil.getStorage().userId;
        const role = new Role();
        role.id = +LocalStorageUtil.getStorage().roleId;
        this.spinnerService.show();
        const obj = {
            customerLoanDtoList: data.assignedLoan,
            toUser: user ,
            toRole: role,
            documentStatus: 'DISBURSEMENT_PENDING',
            docAction: 'PULLED',
            comment: 'Pulled To Own Bucket',
            loanHolderId: data.loanHolder.id,
            cadId: ObjectUtil.isEmpty(data.id) ? undefined : data.id
        };
        this.service.assignLoanToUser(obj).subscribe(res => {
            this.spinnerService.hide();
            this.loadProfile(data.id,data);
            // this.toastService.success('Successfully Pulled Loan');
            this.modalService.dismissAll();
            // this.routerService.navigateByUrl('/home/credit/offer-pending');
        }, err => {
            this.spinnerService.hide();
            this.modalService.dismissAll();
            // this.toastService.danger('Something Went Wrong');
        });
    }

}

import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import * as CryptoJS from 'crypto-js';
import {CommonService} from '../../../../@core/service/common.service';
import {User} from '../../../admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {RoleType} from '../../../admin/modal/roleType';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {squareOutline} from 'ionicons/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DocAction} from '../../../loan/model/docAction';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RouteConst} from '../../model/RouteConst';
import {ToastService} from '../../../../@core/utils';
import {RouterUtilsService} from '../../utils/router-utils.service';

@Component({
    selector: 'app-cad-document-list',
    templateUrl: './cad-document-list.component.html',
    styleUrls: ['./cad-document-list.component.scss']
})
export class CadDocumentListComponent implements OnInit {

    // todo dynamic search obj for approve , pending
    searchObj = {isCadFile: 'true'};
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
    formAction: FormGroup;

    constructor(private service: CreditAdministrationService,
                private router: Router,
                private spinnerService: NgxSpinnerService,
                private userService: UserService,
                private modalService: NgbModal,
                public commonService: CommonService,
                private formBuilder: FormBuilder,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService) {
    }

    static loadData(other: CadDocumentListComponent) {
        other.currentIndexArray = [];
        other.toggleArray = [];
        other.encryptUrlArray = [];
        other.loanList = [];
        other.spinner = true;
        other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
            other.spinner = false;
            other.loanList = res.detail.content;
            other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanList.forEach((l) => other.encryptUrlArray.push({url: other.encryptUrl(l.id)}));
            other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: l.previousList.length}));
            other.pageable = PaginationUtils.getPageable(res.detail);


        }, error => {
            other.spinner = false;
            console.log(error);
        });
    }

    ngOnInit() {
        this.buildForm();
        this.userDetail();
        CadDocumentListComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        CadDocumentListComponent.loadData(this);
    }

    loadProfile(cadDocumentId) {
        this.router.navigate(['/home/credit/offer-letter-profile'],
            {
                queryParams: {
                    cadDocumentId: cadDocumentId,
                }
            });
    }

    setSearchValue(value) {
        this.searchObj = Object.assign(value, {isCadFile: 'true'});
        CadDocumentListComponent.loadData(this);
    }

    encryptUrl(id) {
        const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
        return i;
    }

    loadSummary(model) {
        this.router.navigate(['/home/credit/cad-summary/', this.encryptUrl(model.id)],
            {state: {data: model}});

    }

    userDetail() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
        });
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
        comp.componentInstance.disbursementDataAssign = false;
        comp.result.then(() => {
            CadDocumentListComponent.loadData(this);
        }, () => {
            CadDocumentListComponent.loadData(this);
        });
    }

    buildForm() {
        this.formAction = this.formBuilder.group(
            {
                customerLoanDtoList: [undefined],
                toUser: [undefined, Validators.required],
                toRole: [undefined, Validators.required],
                docAction: [undefined],
                comment: [undefined],
                loanHolderId: [undefined],
                cadId: [undefined]
            }
        );
    }

    onClose() {
        this.modalService.dismissAll();
    }

    openPullPopUp(template, model) {
        this.modalService.open(template);
        this.formAction = this.formBuilder.group(
            {
                customerLoanDtoList: [model.assignedLoan],
                toUser: [this.user],
                toRole: [this.user.role],
                docAction: [DocAction.value(DocAction.PULLED)],
                comment: ['Pulled'],
                loanHolderId: [model.loanHolder.id],
                cadId: [model.id]
        });
    }

    confirm() {
        this.spinner = true;
        this.service.assignLoanToUser(this.formAction.value).subscribe((res: any) => {
            console.log(res);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SuccessFully Assigned Cad Document'));
            this.onClose();
            this.routerUtilsService.reloadRoute(RouteConst.ROUTE_DASHBOARD, RouteConst.ROUTE_CAD_LIST_BY_PERMISSIONS);
        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Assigning Cad Document'));
        });
    }

}


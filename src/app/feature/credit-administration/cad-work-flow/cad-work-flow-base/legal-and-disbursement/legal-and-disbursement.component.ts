import {Component, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ActivatedRoute} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {UserService} from '../../../../../@core/service/user.service';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {NbDialogService} from '@nebular/theme';
import {CadFileSetupComponent} from './cad-file-setup/cad-file-setup.component';

@Component({
    selector: 'app-legal-and-disbursement',
    templateUrl: './legal-and-disbursement.component.html',
    styleUrls: ['./legal-and-disbursement.component.scss']
})
export class LegalAndDisbursementComponent implements OnInit {

    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    customerInfoData: CustomerInfoData;
    cadDocumentId;
    spinner = false;
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
    checkListLiteVersion = LocalStorageUtil.getStorage().productUtil.CHECK_LIST_LITE_VERSION;
    showHideAction = true;
    activeTab = 0;
    toggleArray: { toggled: boolean }[] = [];
    user = new User();
    isRoleLegal = false;
    layoutFlag = false;
    isCad = false;
    isInCurrentUser = false;
    productUtils = LocalStorageUtil.getStorage().productUtil;

    constructor(private activatedRoute: ActivatedRoute,
                private service: CreditAdministrationService,
                private userService: UserService,
                private nbService: NbDialogService
    ) {
    }


    static loadData(other: LegalAndDisbursementComponent) {
        other.spinner = true;
        other.toggleArray = [];
        other.isInCurrentUser = false;
        other.service.detail(other.cadDocumentId).subscribe((res: any) => {
            other.cadOfferLetterApprovedDoc = res.detail;
            other.customerInfoData = other.cadOfferLetterApprovedDoc.loanHolder;
            other.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => other.toggleArray.push({toggled: false}));
            if (!ObjectUtil.isEmpty(other.cadOfferLetterApprovedDoc.cadCurrentStage.toUser)) {
            if (other.cadOfferLetterApprovedDoc.cadCurrentStage.toUser.id.toString() === LocalStorageUtil.getStorage().userId) {
                other.isInCurrentUser = true;
            }}
            other.spinner = false;
        }, error => {
            console.log(error);
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.getUserDetail();
        this.cadDocumentId = Number(this.activatedRoute.snapshot.queryParamMap.get('cadDocumentId'));
            LegalAndDisbursementComponent.loadData(this);

        if (!ObjectUtil.isEmpty(history.state.tabId)) {
            this.activeTab = history.state.tabId;
        }

    }

    getUserDetail() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
            if (this.user.role.roleType === RoleType.CAD_LEGAL) {
                this.isRoleLegal = true;
            } else {
                this.isRoleLegal = false;
            }
            if (this.user.role.roleName === 'CAD') {
                this.isCad = true;
            }
        });
    }

    newCadData(event: CustomerApprovedLoanCadDocumentation) {
        this.cadOfferLetterApprovedDoc = event;
        if (ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            LegalAndDisbursementComponent.loadData(this);
        } else {
            this.customerInfoData = this.cadOfferLetterApprovedDoc.loanHolder;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(() => this.toggleArray.push({toggled: false}));
        }
    }

    changeCssOfCad(value) {
        console.log(value);
        this.layoutFlag = value;
    }

    openCadFIleSetup() {
        this.nbService.open(CadFileSetupComponent, {
            context: {
                cadData: this.cadOfferLetterApprovedDoc
            }
        });
    }

}

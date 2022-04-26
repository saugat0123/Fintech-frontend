import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../../loan/model/loanType';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {User} from '../../../../admin/modal/user';
import {RoleType} from '../../../../admin/modal/roleType';
import {UserService} from '../../../../../@core/service/user.service';
import {Stage} from '../../../../loan/model/stage';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ApprovalRoleHierarchy} from '../../../../loan/approval/ApprovalRoleHierarchy';
import {NbDialogService} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from '../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {CadOneformService} from '../../../service/cad-oneform.service';
import {CustomerType} from '../../../../customer/model/customerType';
import {EducationalLoanTemplateEditComponent} from '../../../cad-view/template-data/educational-loan-template-edit/educational-loan-template-edit.component';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../model/OfferDocument';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {EditLoanDetailComponent} from '../../../cad-view/template-data/edit-loan-detail/edit-loan-detail.component';
import {PersonalLoanTemplateEditComponent} from '../../../cad-view/template-data/personal-loan-template-edit/personal-loan-template-edit.component';
import {PersonalOverdraftTemplateDataEditComponent} from '../../../cad-view/template-data/personal-overdraft-template-data-edit/personal-overdraft-template-data-edit.component';
import {HomeLoanTemplateEditComponent} from '../../../cad-view/template-data/home-loan-template-edit/home-loan-template-edit.component';
import {RetailMortageLoanTemplateDataEditComponent} from '../../../cad-view/template-data/retail-mortage-loan-template-data-edit/retail-mortage-loan-template-data-edit.component';
import {AutoLoanTemplateEditComponent} from '../../../cad-view/template-data/auto-loan-template-edit/auto-loan-template-edit.component';
import {UdhyamsilKarjaSubsidyTemplateEditComponent} from '../../../cad-view/template-data/nabil-sme-template-data/udhyamsil-karja-subsidy/udhyamsil-karja-subsidy-template-edit/udhyamsil-karja-subsidy-template-edit.component';
import {PersonalOverdraftWithoutCollateralTemplateEditComponent} from '../../../cad-view/template-data/personal-overdraft-without-collateral-template-edit/personal-overdraft-without-collateral-template-edit.component';
import {KisanKarjaSubsidyTemplateEditComponent} from '../../../cad-view/template-data/nabil-sme-template-data/kisan-karja-subsidy/kisan-karja-subsidy-template-edit/kisan-karja-subsidy-template-edit.component';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {InterestSubsidySanctionLetterTemplateEditComponent} from '../../../cad-view/template-data/nabil-sme-template-data/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter-template-edit/interest-subsidy-sanction-letter-template-edit.component';
import {DdslWithoutSubsidyTemplateEditComponent} from '../../../cad-view/template-data/nabil-sme-template-data/ddsl-without-subsidy/ddsl-without-subsidy-template-edit/ddsl-without-subsidy-template-edit.component';
import {PersonalLoanAndPersonalOverdraftTemplateEditComponent} from '../../../cad-view/template-data/personal-loan-and-personal-overdraft-template-edit/personal-loan-and-personal-overdraft-template-edit.component';
import {SmeMasterTemplateComponent} from '../../../cad-view/template-data/nabil-sme-template-data/sme-template-data/sme-master-template/sme-master-template.component';
import {ClassASanctionLetterTemplateDataComponent} from '../../../cad-view/template-data/nabil-sme-template-data/class-a-sanction-letter-template-data/class-a-sanction-letter-template-data.component';
import {RetailTemplateDataComponent} from '../../../cad-view/template-data/retail-template-data/retail-template-data.component';

@Component({
  selector: 'app-offer-letter-list',
  templateUrl: './offer-letter-list.component.html',
  styleUrls: ['./offer-letter-list.component.scss']
})
export class OfferLetterListComponent implements OnInit {
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  offerDocumentList: Array<OfferDocument>;
  docName: string;
  initialInformation: any;
  // todo dynamic search obj for approve , pending
  searchObj = {docStatus: 'OFFER_AND_LEGAL_PENDING'};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  currentUserLocalStorage = LocalStorageUtil.getStorage().userId;
  toggleArray: { toggled: boolean }[] = [];
  currentIndexArray: { currentIndex: number }[] = [];
  user: User = new User();
  roleType = RoleType;
  asc = false;
  offerLetterName = NabilOfferLetterConst;
  offerLetterType = NabilOfferLetterConst;

  constructor(private service: CreditAdministrationService,
              private router: Router,
              private userService: UserService,
              public routeService: RouterUtilsService,
              private spinnerService: NgxSpinnerService,
              private dialogService: NbDialogService,
              private cadOneFormService: CadOneformService,
              private toastService: ToastService) {
  }

  static async loadData(other: OfferLetterListComponent) {
    other.spinner = true;
    other.currentIndexArray = [];
    other.toggleArray = [];
    other.loanList = [];
    // await other.userService.getDefaultCommunityUser().then(res => {
    //   this.defaultCommunityUser = res.detail.id;
    // });
    other.service.getCadListPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.spinner = false;
      console.log(res.detail);
      other.loanList = res.detail.content;
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      // other.loanList.forEach((l) => l.loanStage = other.getInitiator(l.assignedLoan));
      // tslint:disable-next-line:max-line-length
      other.loanList.forEach((l) => other.currentIndexArray.push({currentIndex: ObjectUtil.isEmpty(l.previousList) ? 0 : l.previousList.length}));
      other.pageable = PaginationUtils.getPageable(res.detail);

    }, error => {
      other.spinner = false;
      console.log(error);
    });
  }

  ngOnInit() {
    // this.cadOneFormService.getCustomerInfo(10056).subscribe( resp => {
    //   console.log(resp.detail);
    // });
    this.userDetail();
    if (LocalStorageUtil.getStorage().roleType === RoleType.CAD_ADMIN) {
      this.setDefaultCADROLE();
    } else {
      OfferLetterListComponent.loadData(this);
    }
  }

  changePage(page: number) {
    this.page = page;
    OfferLetterListComponent.loadData(this);
  }

  loadProfile(cadDocumentId, model) {
    this.routeService.routeOnConditionProfileOrSummary(cadDocumentId, model);
  }


  setSearchValue(value) {
    this.searchObj = Object.assign(value, {docStatus: 'OFFER_AND_LEGAL_PENDING'});
    OfferLetterListComponent.loadData(this);
  }

  userDetail() {
    this.userService.getLoggedInUser().subscribe((res: any) => {
      this.user = res.detail;
    });
  }


  /**
   *  last modified is of approved date
   */
  public getInitiator(loan: any) {
    let stage = new Stage();
    if (!ObjectUtil.isEmpty(loan)) {
      if (loan.length > 1) {
        const commentLoan = loan[loan.length - 1];
        if (ObjectUtil.isEmpty(commentLoan.previousList)) {
          const tempPreviousList = JSON.parse(commentLoan.previousStageList);
          stage = tempPreviousList[0];
        } else {
          stage = commentLoan.previousList[0];
        }
        stage.lastModifiedAt = commentLoan.lastModifiedAt;
        return stage;
      } else if (loan.length === 1) {
        if (ObjectUtil.isEmpty(loan[0].previousList)) {
          const tempPreviousList = JSON.parse(loan[0].previousStageList);
          stage = tempPreviousList[0];
        } else {
          stage = loan[0].previousList[0];
        }

        stage.lastModifiedAt = loan[0].lastModifiedAt;
        return stage;
      }
    }
  }
  sortFilter(sortBy, dir) {
    this.searchObj = Object.assign(this.searchObj, {docStatus: 'OFFER_PENDING', sortBy: sortBy, sortOrder: dir});
    OfferLetterListComponent.loadData(this);
  }

  setDefaultCADROLE() {
    this.spinner = true;
    this.service.getRoleInCad().subscribe((res: any) => {
      const roleListInCAD = res.detail;
      const role: ApprovalRoleHierarchy = roleListInCAD.filter(c => c.role.roleName === 'CAD')[0];
      this.searchObj = Object.assign(this.searchObj, {docStatus: 'OFFER_AND_LEGAL_PENDING', toRole: role.role.id});
      OfferLetterListComponent.loadData(this);
      this.spinner = false;

    }, error => {
      this.spinner = false;
      console.log(error);
    });
  }

  onEdit(id: any) {
    this.cadOneFormService.getCustomerInfo(id).subscribe(resp => {
      console.log(resp);
      this.dialogService.open(CadOfferLetterConfigurationComponent, {
        context: {
          customerType: resp.detail.customerType === 'individual' ? CustomerType.INDIVIDUAL : CustomerType.INSTITUTION,
          customerInfo: resp.detail.customerType === 'individual' ? resp.detail.customerInfo : resp.detail.companyInfo,
          loanHolder: resp.detail.loanHolder,
          oneFormCustomer: resp.detail.customerType === 'individual' ? resp.detail.customerInfo : resp.detail.companyInfo,
          actionType: 'Edit',
          activeLoanTab: true,
          customerSubType: resp.detail.loanHolder.customerSubType
        },
        hasBackdrop: false,
        dialogClass: 'model-full',
      });
    });

  }

    public editOfferLetter(id: any): void {
        this.spinner = true;
        this.service.detail(id).subscribe((res) => {
            this.cadOfferLetterApprovedDoc = res.detail;
            this.spinner = false;
            this.offerDocumentList = this.cadOfferLetterApprovedDoc.offerDocumentList;
            if (this.offerDocumentList.length === 0) {
              this.toastService.show(new Alert(AlertType.ERROR, `${ObjectUtil.isEmpty(this.docName) ? 'offer letter' : this.docName} not found`));
            }
            this.offerDocumentList.forEach(offerLetter => {
                this.docName = offerLetter.docName;
                if (this.docName === 'Educational Loan') {
                    this.dialogService.open(EducationalLoanTemplateEditComponent, {
                        context: {
                            offerLetterId: offerLetter.id,
                            customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                            offerDocumentList: this.offerDocumentList,
                            initialInformation: JSON.parse(offerLetter.initialInformation)
                        },
                        hasBackdrop: false,
                        dialogClass: 'model-full',
                    });
                } else if (this.docName === 'Personal Loan') {
                this.dialogService.open(PersonalLoanTemplateEditComponent, {
                  context: {
                    offerLetterId: offerLetter.id,
                    customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                    offerDocumentList: this.offerDocumentList,
                    initialInformation: JSON.parse(offerLetter.initialInformation)
                  },
                  hasBackdrop: false,
                  dialogClass: 'model-full',
                });
              } else if (this.docName === 'Personal Overdraft') {
                  this.dialogService.open(PersonalOverdraftTemplateDataEditComponent, {
                    context: {
                      offerLetterId: offerLetter.id,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'Home Loan') {
                  this.dialogService.open(HomeLoanTemplateEditComponent, {
                    context: {
                      offerLetterId: offerLetter.id,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'Auto Loan') {
                  this.dialogService.open(AutoLoanTemplateEditComponent, {
                    context: {
                      offerLetterId: offerLetter.id,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'Mortage Loan') {
                  this.dialogService.open(RetailMortageLoanTemplateDataEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation),
                      fieldFlag: true
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'Udyamsil Karja Subsidy') {
                  this.dialogService.open(UdhyamsilKarjaSubsidyTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'Personal overdraft without collateral') {
                  this.dialogService.open(PersonalOverdraftWithoutCollateralTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === this.offerLetterName.value(this.offerLetterName.INTEREST_SUBSIDY_SANCTION_LETTER)) {
                  this.dialogService.open(InterestSubsidySanctionLetterTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === 'DDSL Without Subsidy') {
                  this.dialogService.open(DdslWithoutSubsidyTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === this.offerLetterName.value(this.offerLetterName.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT)) {
                  this.dialogService.open(PersonalLoanAndPersonalOverdraftTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === this.offerLetterType.value(this.offerLetterType.KISAN_KARJA_SUBSIDY)) {
                  this.dialogService.open(KisanKarjaSubsidyTemplateEditComponent, {
                    context: {
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                  });
                } else if (this.docName === this.offerLetterType.value(this.offerLetterType.COMBINED_LETTER) &&
                    this.cadOfferLetterApprovedDoc.loanHolder.customerType === 'INSTITUTION') {
                  this.dialogService.open(SmeMasterTemplateComponent, {
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                    context: {
                      isEdit: true,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                  });
                } else if (this.docName === this.offerLetterType.value(this.offerLetterType.COMBINED_LETTER) &&
                    this.cadOfferLetterApprovedDoc.loanHolder.customerType === 'INDIVIDUAL') {
                  this.dialogService.open(RetailTemplateDataComponent, {
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                    context: {
                      isEdit: true,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                  });
                } else if (this.docName === this.offerLetterType.value(this.offerLetterType.CLASS_A)) {
                  this.dialogService.open(ClassASanctionLetterTemplateDataComponent, {
                    hasBackdrop: false,
                    dialogClass: 'model-full',
                    context: {
                      isEdit: true,
                      customerApprovedDoc: this.cadOfferLetterApprovedDoc,
                      offerDocumentList: this.offerDocumentList,
                      initialInformation: JSON.parse(offerLetter.initialInformation)
                    },
                  });
                } else {
                  this.toastService.show(new Alert(AlertType.ERROR, `${ObjectUtil.isEmpty(this.docName) ? 'offer letter' : this.docName} not found`));
                }
            });
        }, error => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'OOPS something went wrong please try again!!'));
        });
    }

    public editLoanDetail(id: any): void {
    this.spinner = true;
    this.service.detail(id).subscribe((response) => {
      this.dialogService.open(EditLoanDetailComponent, {
        context: {
          data: response.detail,
        }
      });
      this.spinner = false;
    }, error => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'OOPS something went wrong please try again!!'));
    });
    }
}

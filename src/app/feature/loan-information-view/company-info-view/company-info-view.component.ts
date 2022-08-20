import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CompanyJsonData} from '../../admin/modal/CompanyJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {BusinessAndIndustry} from '../../admin/modal/businessAndIndustry';
import {RegisteredOfficeList} from '../../admin/modal/registeredOfficeList';
import {BusinessGiven} from '../../admin/modal/businessGiven';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {SummaryType} from '../../loan/component/SummaryType';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';

@Component({
  selector: 'app-company-info-view',
  templateUrl: './company-info-view.component.html',
  styleUrls: ['./company-info-view.component.scss']
})
export class CompanyInfoViewComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() loanHolder;
  @Input() formValue: CompanyInfo;
  @Input() calendarType: CalendarType;
  @Input() customerInfo: CustomerInfoData;
  @Input() loanId: any;
  @Input() companyData: any;
  customerType = CustomerType;
  companyJsonData: CompanyJsonData;
  additionalInfoJsonData;
  contactPersonJsonData;
  bankingRelation;
  businessAndIndustry: BusinessAndIndustry;
  registeredOffice: typeof RegisteredOfficeList = RegisteredOfficeList;
  businessGiven: BusinessGiven;
  companyLocationData;
  srdbAffiliatedId = false;
  disableCrgAlpha = environment.disableCrgAlpha;
  client = environment.client;
  clientName = Clients;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  customerAllLoanList: LoanDataHolder[] = [];
  proposalData: Proposal;
  fiscalYearArray: Array<FiscalYear>;

  constructor(private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService,
              private fiscalYearService: FiscalYearService) {
  }

  ngOnInit() {
    this.loanHolder = this.loanDataHolder.loanHolder;
    this.getAllLoans(this.loanDataHolder.loanHolder.id);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
    }
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.companyJsonData = JSON.parse(this.formValue.companyJsonData);
      this.additionalInfoJsonData = JSON.parse(this.formValue.additionalCompanyInfo);
      this.contactPersonJsonData = JSON.parse(this.formValue.contactPersons);
      this.businessAndIndustry = JSON.parse(this.formValue.businessAndIndustry);
      this.businessGiven = JSON.parse(this.formValue.businessGiven);
      this.companyLocationData = JSON.parse(this.formValue.companyLocations.address);
    }
    this.bankingRelation = JSON.parse(this.customerInfo.bankingRelationship);
    this. fiscalYearService.getAll().subscribe( res => {
      this.fiscalYearArray = res.detail;
    });
  }

  getAllLoans(customerInfoId: number): void {
    const search = {
      loanHolderId: customerInfoId.toString(),
      isStaged: 'true'
    };
    this.customerLoanService.getAllWithSearch(search)
        .subscribe((res: any) => {
          this.customerAllLoanList = res.detail;
          // push current loan if not fetched from staged spec response
          if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
            this.customerAllLoanList.push(this.loanDataHolder);
          }
          if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
            this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
          } else {
            this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.currentStage.docAction !== 'APPROVED');
          }
          // push loans from combined loan if not in the existing array
          const combinedLoans = this.customerAllLoanList
              .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
          if (combinedLoans.length > 0) {
            const combinedLoanId = combinedLoans[0].combinedLoan.id;
            this.combinedLoanService.detail(combinedLoanId).subscribe((response: any) => {
              (response.detail as CombinedLoan).loans.forEach((cl) => {
                const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
                if (!allLoanIds.includes(cl.id)) {
                  this.customerAllLoanList.push(cl);
                }
              });
            }, err => {
              console.error(err);
            });
          }
        }, error => {
          console.error(error);
        });
  }

}

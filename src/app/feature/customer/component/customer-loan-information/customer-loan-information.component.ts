import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';
import {TemplateName} from '../../model/templateName';
import {CustomerInfoService} from '../../service/customer-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {SiteVisit} from '../../../admin/modal/siteVisit';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbAccordionItemComponent} from '@nebular/theme';
import {Financial} from '../../../loan/model/financial';
import {FinancialComponent} from '../../../loan-information-template/financial/financial.component';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {GuarantorComponent} from '../../../loan-information-template/guarantor/guarantor.component';
import {Insurance} from '../../../admin/modal/insurance';
import {CreditRiskGradingAlphaComponent} from '../../../loan-information-template/credit-risk-grading-alpha/credit-risk-grading-alpha.component';
import {CreditRiskGradingAlpha} from '../../../admin/modal/CreditRiskGradingAlpha';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {CreditRiskGrading} from '../../../admin/modal/creditRiskGrading';
import {CreditGradingComponent} from '../../../loan-information-template/credit-grading/credit-grading.component';

@Component({
  selector: 'app-customer-loan-information',
  templateUrl: './customer-loan-information.component.html',
  styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit {

  @Input() public customerInfoId: number;
  @Input() public customerInfo: CustomerInfoData;
  @Input() public companyInfo: CompanyInfo;

  @ViewChild('siteVisitComponent', {static: false})
  public siteVisitComponent: SiteVisitComponent;
  @ViewChild('itemSiteVisit', {static: false})
  private itemSiteVisit: NbAccordionItemComponent;
  @ViewChild('financialComponent', {static: false})
  public financialComponent: FinancialComponent;
  @ViewChild('itemFinancial', {static: false})
  private itemFinancial: NbAccordionItemComponent;
  @ViewChild('CrgAlphaComponent', {static: false})
  public CrgAlphaComponent: CreditRiskGradingAlphaComponent;
  @ViewChild('itemCrgAlpha', {static: false})
  private itemCrgAlpha: NbAccordionItemComponent;
  @ViewChild('CrgComponent', {static: false})
  public CrgComponent: CreditGradingComponent;
  @ViewChild('itemCrg', {static: false})
  private itemCrg: NbAccordionItemComponent;
  @ViewChild('itemSecurity', {static: false})
  private itemSecurity: NbAccordionItemComponent;
  @ViewChild('guarantorComponent', {static: false})
  public guarantorComponent: GuarantorComponent;
  @ViewChild('itemGuarantor', {static: false})
  private itemGuarantor: NbAccordionItemComponent;
  @ViewChild('itemInsurance', {static: false})
  private  itemInsurance: NbAccordionItemComponent;
  @Output() public triggerCustomerRefresh = new EventEmitter<boolean>();
  calendarType: CalendarType = CalendarType.AD;
  private siteVisit: SiteVisit;
  private financial: Financial;
  private creditRiskGradingAlpha: CreditRiskGradingAlpha;
  private creditRiskGrading: CreditRiskGrading;
  private security: Security;
  private shareSecurity: ShareSecurity;
  private guarantors: GuarantorDetail;
  public insurance: Array<Insurance>;

  constructor(
      private toastService: ToastService,
      private customerInfoService: CustomerInfoService
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
      this.siteVisit = this.customerInfo.siteVisit;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.financial)) {
      this.financial = this.customerInfo.financial;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.creditRiskGradingAlpha)) {
      this.creditRiskGradingAlpha = this.customerInfo.creditRiskGradingAlpha;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.creditRiskGrading)) {
      this.creditRiskGrading = this.customerInfo.creditRiskGrading;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
      this.security = this.customerInfo.security;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.insurance)) {
      this.insurance = this.customerInfo.insurance;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
      this.guarantors = this.customerInfo.guarantors;
    }
  }

  public saveSiteVisit(data: string) {
    if (ObjectUtil.isEmpty(this.siteVisit)) {
      this.siteVisit = new SiteVisit();
    }
    this.siteVisit.data = data;
    this.customerInfoService.saveLoanInfo(this.siteVisit, this.customerInfoId, TemplateName.SITE_VISIT)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));
      this.itemSiteVisit.close();
      this.triggerCustomerRefresh.emit(true);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
    });
  }

  saveFinancial(data: string) {
    if (ObjectUtil.isEmpty(this.financial)) {
      this.financial = new Financial();
    }
    this.financial.data = data;
    this.customerInfoService.saveLoanInfo(this.financial, this.customerInfoId, TemplateName.FINANCIAL)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Financial!'));
          this.itemFinancial.close();
          this.triggerCustomerRefresh.emit(true);
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Financial!'));
        });
  }

  public saveSecurity(data: Security) {
    if (ObjectUtil.isEmpty(this.security)) {
      this.security = new Security();
    }
    if (!ObjectUtil.isEmpty(data)) {
      this.security.data = data.data;
      this.customerInfoService.saveLoanInfo(this.security, this.customerInfoId, TemplateName.SECURITY)
      .subscribe(() => {
        this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Security Data!'));
        if (!ObjectUtil.isEmpty(data.share)) {
          this.saveShare(data);
        } else {
          this.triggerCustomerRefresh.emit(true);
          this.itemSecurity.close();
        }
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Data!'));
      });
    }}
    saveShare(data) {
      this.shareSecurity = data.share;
      this.customerInfoService.saveLoanInfo(this.shareSecurity, this.customerInfoId, TemplateName.SHARE_SECURITY)
      .subscribe(() => {
        this.itemSecurity.close();
        this.triggerCustomerRefresh.emit(true);
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Share Security!'));
      });
    }

  saveGuarantor(data: GuarantorDetail) {
    if (ObjectUtil.isEmpty(this.guarantors)) {
      this.guarantors = new GuarantorDetail();
    }
    this.guarantors = data;
    this.customerInfoService.saveLoanInfo(this.guarantors, this.customerInfoId, TemplateName.GUARANTOR)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Guarantor saved successfully !'));
          this.itemGuarantor.close();
          this.triggerCustomerRefresh.emit(true);
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Guarantor !'));
    });
  }

    public saveInsurance(data: Array<Insurance>) {
      if (ObjectUtil.isEmpty(this.insurance)) {
        this.insurance = new Array<Insurance>();
      }
      this.insurance = data;
      this.customerInfoService.saveLoanInfo(this.insurance, this.customerInfoId, TemplateName.INSURANCE)
      .subscribe(() => {
        this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Insurance!'));
        this.itemInsurance.close();
        this.triggerCustomerRefresh.emit(true);
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Insurance!'));
      });
    }

  saveCrgAlpha(data: string) {
    if (ObjectUtil.isEmpty(this.creditRiskGradingAlpha)) {
      this.creditRiskGradingAlpha = new CreditRiskGradingAlpha();
    }
    this.creditRiskGradingAlpha.data = data;
    this.customerInfoService.saveLoanInfo(this.creditRiskGradingAlpha, this.customerInfoId, TemplateName.CRG_ALPHA)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Risk Grading (Alpha)!'));
          this.itemCrgAlpha.close();
          this.triggerCustomerRefresh.emit(true);
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading (Alpha)!'));
        });
  }

  saveCrg(data: string) {
    if (ObjectUtil.isEmpty(this.creditRiskGrading)) {
      this.creditRiskGrading = new CreditRiskGrading();
    }
    this.creditRiskGrading.data = data;
    this.customerInfoService.saveLoanInfo(this.creditRiskGrading, this.customerInfoId, TemplateName.CRG)
        .subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Risk Grading!'));
          this.itemCrg.close();
          this.triggerCustomerRefresh.emit(true);
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading!'));
        });
  }
}

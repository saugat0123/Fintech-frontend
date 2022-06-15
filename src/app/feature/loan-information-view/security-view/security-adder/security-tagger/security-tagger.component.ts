import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Security} from '../../../../loan/model/security';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityLoanReferenceService} from '../../../../security-service/security-loan-reference.service';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanType} from '../../../../loan/model/loanType';
import {CustomerInfoService} from '../../../../customer/service/customer-info.service';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';

@Component({
  selector: 'app-security-tagger',
  templateUrl: './security-tagger.component.html',
  styleUrls: ['./security-tagger.component.scss']
})
export class SecurityTaggerComponent implements OnInit {
  @Input() securities: Array<Security>;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() mGroupCode;
  securityForm: FormGroup;
  limitExceed = [];
  isUsedAmount = [];
  @Input() proposedLimit: number;
  toggleArray: { toggled: boolean, security: any, freeLimit: any , securityLoanReferenceId: number}[] = [];
  spinner = false;
  securityPresent = [];
  securityList: Array<Security> = new Array<Security>();
  coverage = 0;
  @Output() deleteEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  isRelease = false;
  existingSecurity = [];
  customerInfoList: Array<CustomerInfoData>;

  constructor(private formBuilder: FormBuilder,
              private securityLoanReferenceService: SecurityLoanReferenceService,
              private customerInfoService: CustomerInfoService) { }

  ngOnInit() {
      if (LoanType[this.loanDataHolder.loanType] === LoanType.RELEASE_AND_REPLACEMENT) {
          this.isRelease = true;
          this.securityLoanReferenceService.getAllSecurityLoanReferencesByLoanId(this.loanDataHolder.parentId).subscribe((res) => {
              this.existingSecurity = (res.detail).map((d) => {
                  return {data: JSON.parse(d.data), usedAmount: d.usedAmount, coverage: d.coverage, securityType: d.securityType};
              });
          // .filter(f => f.status === 'INACTIVE')
          });
      }
    this.buildForm();
    if (this.securities.length > 0) {
      this.setSecurities(this.securities);
      this.toggleSecurity();
      this.getAllSecurityByLoanHolderId();
    }
      this.getAllCustomerSecurityByCustomerGroupCode();
  }

  get securityControls(): FormArray {
    return this.securityForm.get('securityDetails') as FormArray;
  }

  private getAllCustomerSecurityByCustomerGroupCode(): void {
      if (!ObjectUtil.isEmpty(this.mGroupCode)) {
          this.customerInfoService.getAllCustomerByGroupCode(this.mGroupCode).subscribe((response: any) => {
             this.customerInfoList = response.detail;
             if (this.customerInfoList.length > 0) {
                 const securities = [];
                 this.customerInfoList.forEach((customerInfoData: CustomerInfoData) => {
                     if (customerInfoData.securities.length > 0) {
                         customerInfoData.securities.forEach((security: Security) => {
                             securities.push(security);
                         });
                     }
                 });
                 this.securities = securities;
                 if (this.securities.length > 0) {
                     this.setSecurities(this.securities);
                     this.toggleSecurity();
                     this.getAllSecurityByLoanHolderId();
                 }
             }
          });
      }
  }

    private getAllSecurityByLoanHolderId(): void {
        if (!ObjectUtil.isEmpty(this.loanDataHolder.id)) {
            this.spinner = true;
            this.securityLoanReferenceService.getAllSecurityLoanReferencesByLoanId(this.loanDataHolder.id).subscribe(
                (response: any) => {
                    this.securityList = [];
                    const data = response.detail;
                    data.forEach((dd) => {
                        (this.securityForm.get('securityDetails').value).forEach((d, i) => {
                            if (d.id === dd.securityId) {
                                d.securityLoanReferenceId = dd.id;
                                d.usedAmount = dd.usedAmount;
                                d.coverage = dd.coverage;
                                // d.freeLimit = this.toggleArray[i].freeLimit;
                                this.securityList.push(d);
                                this.limitExceed[i] = true;
                            }
                        });
                    });
                    this.calculateCoverage();
                    this.spinner = false;
                });
        }
    }

  private buildForm(): FormGroup {
    return this.securityForm = this.formBuilder.group({
      securityDetails: this.formBuilder.array([]),
    });
  }

  setSecurities(securityData) {
    const plantDetails = this.securityForm.get('securityDetails') as FormArray;
    securityData.forEach((singleData, index) => {
        const tempUsedAmount = (singleData.usedAmount ?
            singleData.usedAmount : singleData.considerValue);
        const calcCoverage = this.calcDefaultCoverage(tempUsedAmount);
      plantDetails.push(
          this.formBuilder.group({
            id: [singleData.id],
            version: [singleData.version],
            securityLoanReferenceId: [undefined],
            data: [singleData.data],
            fairMarketValue: [singleData.fairMarketValue],
            distressValue: [singleData.distressValue],
            considerValue: [singleData.considerValue],
            securityType: [singleData.securityType],
            coverage: [calcCoverage],
            freeLimit: [singleData.considerValue],
            usedAmount: [singleData.usedAmount ? singleData.usedAmount : singleData.considerValue],
            status: [singleData.status],
            isCrossCollateral: [!ObjectUtil.isEmpty(this.mGroupCode) ? true : false]
          })
      );
    });
  }

  public calcFreeLimit(index: number, freeLimit: number, usedAmount: number, formControlName: string, id): void {
      // freeLimit -= usedAmount;
      const coverage = (usedAmount / this.proposedLimit) * 100;
      this.limitExceed[index] = freeLimit < 0;
      this.setLimitExceed(index, id);
      this.isUsedAmount[index] = false;
      this.securityForm.get([formControlName, index, 'freeLimit']).setValue(freeLimit);
      this.securityForm.get([formControlName, index, 'coverage']).setValue(Number(coverage.toFixed(2)));
  }

    private getSecurityDetails(id, i): void {
        this.spinner = true;
        this.securityLoanReferenceService.getAllSecurityLoanReferences(Number(id)).subscribe(res => {
            this.spinner = false;
            this.toggleArray[i].security = res.detail;
            let totalUsedAmount = 0;
            this.toggleArray[i].security.forEach((d) => {
                if (!ObjectUtil.isEmpty(d.usedAmount)) {
                    totalUsedAmount += d.usedAmount;
                }
            });
            this.toggleArray[i].freeLimit = Number(this.securityForm.get(['securityDetails', i , 'considerValue']).value);
            // this.securityForm.get(['securityDetails', i , 'freeLimit']).setValue(this.toggleArray[i].freeLimit);
            this.securityPresent[i] = this.toggleArray[i].security.length > 0;
        }, (err) => {
            this.spinner = false;
        });
    }

    public setToggled(array): void {
        this.toggleArray = [];
        array.forEach((a, i) => {
            this.toggleArray.push({toggled: false, security: null, freeLimit: null, securityLoanReferenceId: null});
            this.getSecurityDetails(a.id, i);
        });
    }

    public toggleSecurity(): void {
        this.toggleArray = [];
        if (this.securities.length > 0) {
            this.setToggled(this.securities);
        }
    }

    public tagSecurity(security: any, idx: number, secId: number): void {
        if (!ObjectUtil.isEmpty(this.loanDataHolder.id)) {
            const id = this.toggleArray[idx].security.map((d) => {
                if (d.customerLoan.id === this.loanDataHolder.id) {
                    return d.id;
                }
            });
            if (id.length > 0) {
                this.securityForm.get(['securityDetails', idx, 'securityLoanReferenceId']).patchValue(id[0]);
            }
        }
        // Set Free limit for added security
        // security.value.freeLimit = security.value.considerValue - security.value.usedAmount;
        if (!ObjectUtil.isEmpty(this.proposedLimit)) {
            const calcCoverageVal = ((security.value.usedAmount / this.proposedLimit) * 100).toFixed(2);
            security.value.coverage = calcCoverageVal;
            this.securityForm.get(['securityDetails', idx, 'coverage']).patchValue(calcCoverageVal);
        }
        if (security.value.usedAmount <= 0) {
            this.isUsedAmount[idx] = true;
            return;
        }
            const index = this.getIndex(secId);
            if (index) {
                this.securityList[index] = security.value;
            } else {
                this.securityList.push(security.value);
            }
        this.calculateCoverage();
        this.securityList.forEach((data, i) => {
            this.limitExceed[idx] = data.id === secId;
        });
    }

    getIndex(security): number {
        let i: number = null;
        this.securityList.forEach((s, index) => {
            if (s.id === Number(security)) {
                i = index;
            }
        });
        return i;
    }

    public removeSecurity(idx, securityLoanReferenceId: number): void {
      this.securityForm.get('securityDetails').value.forEach((data, index) => {
          if (this.securityList[idx].id === data.id) {
              this.limitExceed[index] = false;
          }
      });
        this.securityList.splice(idx, 1);
        if (!ObjectUtil.isEmpty(securityLoanReferenceId)) {
            this.securityLoanReferenceService.deleteSecurityLoanReferenceById(securityLoanReferenceId).subscribe((res) => {
                this.ngOnInit();
                this.deleteEmitter.emit(true);
            }, error => {
                console.error(error);
            });
        }
        this.calculateCoverage();
    }

    public calculateCoverage() {
        let coveragePercent = 0;
        if (this.securityList.length > 0) {
            this.securityList.forEach((security: any) => {
                coveragePercent += security.coverage;
            });
        } else {
            coveragePercent = 0;
        }
        this.coverage = coveragePercent;
    }

    calcDefaultCoverage(useAmount) {
        useAmount = !ObjectUtil.isEmpty(useAmount) ? useAmount : 0;
        const finalData = 0;
        if (!ObjectUtil.isEmpty(this.proposedLimit)) {
            const tempUsedAmount = !ObjectUtil.isEmpty(this.proposedLimit) ? this.proposedLimit : 0;
            return Number((useAmount / tempUsedAmount) * 100).toFixed(2);
        }
        return finalData;
    }

    setLimitExceed(index, secId) {
        this.securityList.forEach((data, idx) => {
            if (secId === data.id) {
                this.limitExceed[index] = secId === data.id;
            }
        });
    }

}

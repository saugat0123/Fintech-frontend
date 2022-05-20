import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Security} from '../../../../loan/model/security';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityLoanReferenceService} from '../../../../security-service/security-loan-reference.service';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-tagger',
  templateUrl: './security-tagger.component.html',
  styleUrls: ['./security-tagger.component.scss']
})
export class SecurityTaggerComponent implements OnInit {
  @Input() securities: Array<Security>;
  @Input() loanDataHolder: LoanDataHolder;
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

  constructor(private formBuilder: FormBuilder,
              private securityLoanReferenceService: SecurityLoanReferenceService) { }

  ngOnInit() {
    this.buildForm();
    if (this.securities.length > 0) {
      this.setSecurities(this.securities);
      this.toggleSecurity();
      this.getAllSecurityByLoanHolderId();
    }
  }

  get securityControls(): FormArray {
    return this.securityForm.get('securityDetails') as FormArray;
  }

    private getAllSecurityByLoanHolderId(): void {
        if (!ObjectUtil.isEmpty(this.loanDataHolder.id)) {
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
                                d.freeLimit = this.toggleArray[i].freeLimit;
                                this.securityList.push(d);
                            }
                        });
                    });
                    this.calculateCoverage();
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
            coverage: [singleData.coverage],
            freeLimit: [singleData.considerValue],
            usedAmount: [singleData.usedAmount],
          })
      );
    });
  }

  public calcFreeLimit(index: number, freeLimit: number, usedAmount: number, formControlName: string): void {
      freeLimit -= usedAmount;
      const coverage = (usedAmount / this.proposedLimit) * 100;
      this.limitExceed[index] = freeLimit < 0;
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
            this.toggleArray[i].freeLimit = Number(this.securityForm.get(['securityDetails', i , 'considerValue']).value) - totalUsedAmount;
            this.securityForm.get(['securityDetails', i , 'freeLimit']).setValue(this.toggleArray[i].freeLimit);
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

    public tagSecurity(security: any, key, idx: number): void {
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
        if (security.value.usedAmount <= 0) {
            this.isUsedAmount[idx] = true;
            return;
        }
        if (this.securityList.length > 0) {
            this.securityList.splice(idx, 1);
        }
        this.securityList.push(security.value);
        this.calculateCoverage();
    }

    public removeSecurity(idx, securityLoanReferenceId: number): void {
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

}
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Document} from '../../../../admin/modal/document';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {Security} from '../../../../admin/modal/security';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {DmsLoanService} from './dms-loan-service';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanDataService} from '../../../service/loan-data.service';
import {Occupation} from '../../../../admin/modal/occupation';
import {IncomeSource} from '../../../../admin/modal/incomeSource';
import {CustomerService} from '../../../../admin/service/customer.service';
import {Customer} from '../../../../admin/modal/customer';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {BusinessType} from '../../../../admin/modal/businessType';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanType} from '../../../model/loanType';

@Component({
  selector: 'app-dms-loan',
  templateUrl: './dms-loan-file.component.html',
  styleUrls: ['./dms-loan-file.component.css']
})

export class DmsLoanFileComponent implements OnInit {
  public static FILE_SIZE_5MB = 5242880;
  public static FILE_SIZE_10MB = 10485760;
  @Input()
  loanDataHolder: LoanDataHolder;
  loanForm: FormGroup;
  submitted = false;

  initialDocuments: Document[] = [];
  renewDocuments: Document[] = [];
  document: LoanDocument = new LoanDocument();
  renew = true;
  loan: LoanConfig = new LoanConfig();
  permissions = [];
  loanName: string;
  loanConfig: LoanConfig = new LoanConfig();
  customerId: number;
  errorMessage: string;
  dropdownPriorities = [];
  documentMaps = [];
  documentMap: string;
  allId;
  imagePaths: string[] = [];
  imageUrl = [];
  action: string;
  loanConfigId: number;
  hasPreviousLoan = false;
  previousLoans: Array<LoanDataHolder>;
  spinner = false;
  personal = true;
  security = Security.enumObject();
  businessTypes = BusinessType.enumObject();
  customerSearch = {
    citizenshipNumber: undefined
  };
  companySearch = {
    registrationNumber: undefined
  };
  customerFormField = {
    showFormField: false,
    isOldCustomer: false
  };
  companyFormField = {
    showFormField: false,
    isOldCustomer: false
  };

  docHeader = [];

  constructor(private formBuilder: FormBuilder,
              private loanDataService: LoanDataService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dmsLoanService: DmsLoanService,
              private loanFormService: LoanFormService,
              private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private customerService: CustomerService,
              private companyInfoService: CompanyInfoService) {
  }

  get form() {
    return this.loanForm.controls;
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanId: null,
            customerId: null,
            loanCategory: null
          };
          this.allId = paramsValue;
          this.customerId = this.allId.customerId;
          this.loanConfigId = this.allId.loanId;
          if (this.allId.loanCategory !== 'INDIVIDUAL') {
            this.personal = false;
          }

        });


    if (this.loanDataHolder.dmsLoanFile.id !== undefined) {
      this.action = 'EDIT';
      this.imagePaths = JSON.parse(this.loanDataHolder.dmsLoanFile.documentPath);
      if (JSON.parse(this.loanDataHolder.dmsLoanFile.documentPath) != null) {
        this.documentMaps = JSON.parse(this.loanDataHolder.dmsLoanFile.documentPath);
        this.loanDataHolder.dmsLoanFile.documentMap = JSON.parse(this.loanDataHolder.dmsLoanFile.documentPath);
        this.documentMaps.forEach(d => {
          const arrayOfd = d.split(':')[0];
          this.docHeader.push(arrayOfd);
        });


      }
    }
    this.loanConfigService.detail(this.loanConfigId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
          this.loanName = this.loanConfig.name;
          if (LoanType[this.loanDataHolder.loanType] === LoanType.NEW_LOAN) {
            this.initialDocuments = this.loanConfig.initial;
          } else if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
            this.initialDocuments = this.loanConfig.renew;
          } else if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
            this.initialDocuments = this.loanConfig.closure;
          } else {
            this.initialDocuments = this.loanConfig.initial;
          }

          this.initialDocuments.forEach(i => {
            this.docHeader.forEach(d => {
              if (d === i.displayName || d === i.name) {
                i.checked = true;
              }
            });
          });
        }
    );

    this.dropdownPriorities = [
      {id: 'HIGH', name: 'High'},
      {id: 'MEDIUM', name: 'Medium'},
      {id: 'LOW', name: 'Low'},

    ];
    this.loanForm = this.formBuilder.group({
      // Customer Information
      customerEntityId:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.id)) ? undefined :
              this.loanDataHolder.customerInfo.id],
      customerVersion:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.version)) ? undefined :
              this.loanDataHolder.customerInfo.version],
      customerName:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.customerName)) ? undefined :
              this.loanDataHolder.customerInfo.customerName, Validators.required],
      dob:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.dob)) ? undefined :
              this.loanDataHolder.customerInfo.dob, Validators.required],
      citizenshipNumber:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.citizenshipNumber)) ? undefined :
              this.loanDataHolder.customerInfo.citizenshipNumber],
      contactNumber:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.contactNumber)) ? undefined :
              this.loanDataHolder.customerInfo.contactNumber, Validators.required],
      occupation:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.occupation)) ? undefined :
              this.loanDataHolder.customerInfo.occupation, Validators.required],
      incomeSource:
          [(ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.incomeSource)) ? undefined :
              this.loanDataHolder.customerInfo.incomeSource, Validators.required],
      // Company Information
      companyId:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.id)) ? undefined :
              this.loanDataHolder.companyInfo.id],
      companyInfoVersion:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.version)) ? undefined :
              this.loanDataHolder.companyInfo.version],
      companyName:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.companyName)) ? undefined :
              this.loanDataHolder.companyInfo.companyName, !this.personal ? [Validators.required] : []],
      registrationNumber:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.registrationNumber)) ? undefined :
              this.loanDataHolder.companyInfo.registrationNumber, !this.personal ? [Validators.required] : []],
      companyPAN:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.panNumber)) ? undefined :
              this.loanDataHolder.companyInfo.panNumber, !this.personal ? [Validators.required] : []],
      companyEstablishmentDate:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.establishmentDate)) ? undefined :
              this.loanDataHolder.companyInfo.establishmentDate, !this.personal ? [Validators.required] : []],
      businessType:
          [(ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
              || ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.businessType)) ? undefined :
              this.loanDataHolder.companyInfo.businessType, !this.personal ? [Validators.required] : []],
      // Loan Information
      interestRate:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.interestRate) ? undefined :
              this.loanDataHolder.dmsLoanFile.interestRate, [Validators.required, Validators.min(0)]],
      proposedAmount:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.proposedAmount) ? undefined :
              this.loanDataHolder.dmsLoanFile.proposedAmount, [Validators.required, Validators.min(0)]],
      security:
          [this.loanDataHolder.dmsLoanFile.securities === undefined ? undefined :
              this.loanDataHolder.dmsLoanFile.securities, Validators.required],
      serviceChargeType:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.serviceChargeType) ? 'Percentage' :
              this.loanDataHolder.dmsLoanFile.serviceChargeType, Validators.required],
      serviceChargeAmount:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.serviceChargeAmount) ? undefined :
              this.loanDataHolder.dmsLoanFile.serviceChargeAmount, [Validators.required, Validators.min(0)]],
      tenureDuration:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.tenureDuration) ? undefined :
              this.loanDataHolder.dmsLoanFile.tenureDuration, [Validators.required, Validators.min(0)]],
      priority:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.priority) ? undefined :
              this.loanDataHolder.dmsLoanFile.priority, [Validators.required, Validators.min(0)]],
      recommendation:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.recommendationConclusion) ? undefined :
              this.loanDataHolder.dmsLoanFile.recommendationConclusion, Validators.required],
      waiver:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.waiver) ? undefined :
              this.loanDataHolder.dmsLoanFile.waiver, Validators.required],
      fmvTotal:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.fmvTotal) ? undefined :
              this.loanDataHolder.dmsLoanFile.fmvTotal, Validators.min(0)],
      dvTotal:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.distressValue) ? undefined :
              this.loanDataHolder.dmsLoanFile.distressValue, Validators.min(0)],
      fmvFundingPercent:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.fmvFundingPercent) ? undefined :
              this.loanDataHolder.dmsLoanFile.fmvFundingPercent, Validators.min(0)],
      totalLoanLimit:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.totalLoanLimit) ? undefined :
              this.loanDataHolder.dmsLoanFile.totalLoanLimit, [Validators.required, Validators.min(0)]],
      individualExposure:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.individualExposure) ? undefined :
              this.loanDataHolder.dmsLoanFile.individualExposure],
      institutionExposure:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.institutionExposure) ? undefined :
              this.loanDataHolder.dmsLoanFile.institutionExposure],
      groupExpo:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.groupExpo) ? undefined :
              this.loanDataHolder.dmsLoanFile.groupExpo],
      incomeCoverageRatio:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.incomeCoverageRatio) ? undefined :
              this.loanDataHolder.dmsLoanFile.incomeCoverageRatio, Validators.min(0)],
      debtServiceCoverageRatio:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.debtServiceCoverageRatio) ? undefined :
              this.loanDataHolder.dmsLoanFile.debtServiceCoverageRatio, Validators.min(0)],
      keyPersonName:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.keyPersonName) ? undefined :
              this.loanDataHolder.dmsLoanFile.keyPersonName],
      dealingProductName:
          [ObjectUtil.isEmpty(this.loanDataHolder.dmsLoanFile.dealingProductName) ? undefined :
              this.loanDataHolder.dmsLoanFile.dealingProductName],
      file: [undefined]
    });
    this.customerFormField = {
      showFormField: (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
          && !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.id)),
      isOldCustomer: (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)
          && !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.id))
    };
    this.companyFormField = {
      showFormField: (!ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
          && !ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.id)),
      isOldCustomer: (!ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)
          && !ObjectUtil.isEmpty(this.loanDataHolder.companyInfo.id) && !this.personal)
    };
    this.reqPersonalOrBusiness();
    if (this.renewDocuments.length > 0) {
      this.renew = true;
    }

  }

  onSubmit() {
    // Customer Information
    this.loanDataHolder.customerInfo = new Customer();
    this.loanDataHolder.customerInfo.id = this.loanForm.get('customerEntityId').value;
    this.loanDataHolder.customerInfo.version = this.loanForm.get('customerVersion').value;
    this.loanDataHolder.customerInfo.customerName = this.loanForm.get('customerName').value;
    this.loanDataHolder.customerInfo.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
    this.loanDataHolder.customerInfo.contactNumber = this.loanForm.get('contactNumber').value;
    this.loanDataHolder.customerInfo.dob = this.loanForm.get('dob').value;
    this.loanDataHolder.customerInfo.occupation = this.loanForm.get('occupation').value;
    this.loanDataHolder.customerInfo.incomeSource = this.loanForm.get('incomeSource').value;
    // Company Information
    if (!this.personal) {
      this.loanDataHolder.companyInfo.id = this.loanForm.get('companyId').value;
      this.loanDataHolder.companyInfo.companyName = this.loanForm.get('companyName').value;
      this.loanDataHolder.companyInfo.registrationNumber = this.loanForm.get('registrationNumber').value;
      this.loanDataHolder.companyInfo.panNumber = this.loanForm.get('companyPAN').value;
      this.loanDataHolder.companyInfo.establishmentDate = this.loanForm.get('companyEstablishmentDate').value;
      this.loanDataHolder.companyInfo.businessType = this.loanForm.get('businessType').value;
      this.loanDataHolder.companyInfo.version = this.loanForm.get('companyInfoVersion').value;
    }
    // Loan Information
    this.loanDataHolder.dmsLoanFile.interestRate = this.loanForm.get('interestRate').value;
    this.loanDataHolder.dmsLoanFile.proposedAmount = this.loanForm.get('proposedAmount').value;
    this.loanDataHolder.dmsLoanFile.securities = this.loanForm.get('security').value;
    this.loanDataHolder.dmsLoanFile.tenureDuration = this.loanForm.get('tenureDuration').value;
    this.loanDataHolder.dmsLoanFile.serviceChargeType = this.loanForm.get('serviceChargeType').value;
    this.loanDataHolder.dmsLoanFile.serviceChargeAmount = this.loanForm.get('serviceChargeAmount').value;
    this.loanDataHolder.dmsLoanFile.priority = this.loanForm.get('priority').value;
    this.loanDataHolder.dmsLoanFile.waiver = this.loanForm.get('waiver').value;
    this.loanDataHolder.dmsLoanFile.recommendationConclusion = this.loanForm.get('recommendation').value;
    this.loanDataHolder.dmsLoanFile.fmvTotal = this.loanForm.get('fmvTotal').value;
    this.loanDataHolder.dmsLoanFile.distressValue = this.loanForm.get('dvTotal').value;
    this.loanDataHolder.dmsLoanFile.fmvFundingPercent = this.loanForm.get('fmvFundingPercent').value;
    this.loanDataHolder.dmsLoanFile.individualExposure = this.loanForm.get('individualExposure').value;
    this.loanDataHolder.dmsLoanFile.institutionExposure = this.loanForm.get('institutionExposure').value;
    this.loanDataHolder.dmsLoanFile.groupExpo = this.loanForm.get('groupExpo').value;
    this.loanDataHolder.dmsLoanFile.totalLoanLimit = this.loanForm.get('totalLoanLimit').value;
    this.loanDataHolder.dmsLoanFile.incomeCoverageRatio = this.loanForm.get('incomeCoverageRatio').value;
    this.loanDataHolder.dmsLoanFile.debtServiceCoverageRatio = this.loanForm.get('debtServiceCoverageRatio').value;
    this.loanDataHolder.dmsLoanFile.keyPersonName = this.loanForm.get('keyPersonName').value;
    this.loanDataHolder.dmsLoanFile.dealingProductName = this.loanForm.get('dealingProductName').value;
    console.log(this.loanDataHolder);
  }


  documentUploader(event, documentName: string, index: number) {
    const file = event.target.files[0];
    if (file.size > DmsLoanFileComponent.FILE_SIZE_5MB) {
      this.errorMessage = 'Maximum File Size Exceeds for  ' + documentName;
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else if (ObjectUtil.isEmpty(this.loanForm.get('citizenshipNumber').value)) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Citizenship Number is required to upload file.'));
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else if (ObjectUtil.isEmpty(this.loanForm.get('customerName').value)) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Customer Name is required to upload file.'));
      (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
    } else {
      this.errorMessage = undefined;
      const formdata: FormData = new FormData();

      formdata.append('file', file);
      formdata.append('type', this.loanName);
      formdata.append('citizenNumber', this.loanForm.get('citizenshipNumber').value);
      formdata.append('customerName', this.loanForm.get('customerName').value);
      formdata.append('documentName', documentName);
      if (this.loanDataHolder.loanType === null || this.loanDataHolder.loanType === undefined) {
        formdata.append('action', 'new');
      }

      if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
        formdata.append('action', 'renew');
      }

      if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
        formdata.append('action', 'close');
      }
      this.dmsLoanService.uploadFile(formdata).subscribe(
          (result: any) => {
            this.document.name = documentName;
            // this.loanDataHolder.dmsLoanFile.documents.push(this.document);
            this.documentMap = documentName + ':' + result.detail;
            this.docHeader.push(documentName);
            this.initialDocuments.forEach(i => {
              this.docHeader.forEach(d => {
                if (d === i.displayName || d === i.name) {
                  i.checked = true;
                }
              });
            });

            if (this.documentMaps != null && !this.documentMaps.includes(this.documentMap)) {
              this.documentMaps.forEach(d => {
                const arrayOfd = d.split(':')[0];
                if (arrayOfd === documentName) {
                  const i = this.documentMaps.findIndex(order => order === d);
                  this.documentMaps.splice(i, 1);
                }
              });

              this.documentMaps.push(this.documentMap);
              console.log(this.documentMaps);
            } else {
              this.documentMaps.push(this.documentMap);
            }

            this.loanDataHolder.dmsLoanFile.documentMap = this.documentMaps;
            this.loanDataHolder.dmsLoanFile.documentPath = this.documentMaps.map(x => x).join(',');
            this.document = new LoanDocument();
          },
          error => {
            console.error(error);
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to upload Selected File.'
                + error.error.message));
          }
      );
    }

  }

  searchByCitizenship() {
    this.customerSearch.citizenshipNumber = this.loanForm.get('citizenshipNumber').value;
    this.customerService.getPaginationWithSearchObject(this.customerSearch).subscribe((customerResponse: any) => {
      if (customerResponse.detail.content.length <= 0) {
        this.customerFormField.isOldCustomer = false;
        this.toastService.show(new Alert(AlertType.INFO, 'No Customer Found under provided Citizenship Number.'));
        this.loanForm.patchValue({
          customerEntityId: undefined,
          customerVersion: undefined,
          customerName: undefined,
          dob: undefined,
          contactNumber: undefined,
          occupation: undefined,
          incomeSource: undefined
        });
      } else {
        this.customerFormField.isOldCustomer = true;
        const customer: Customer = customerResponse.detail.content[0];
        this.loanForm.patchValue({
          customerEntityId: customer.id,
          customerVersion: customer.version,
          customerName: customer.customerName,
          dob: customer.dob,
          contactNumber: customer.contactNumber,
          occupation: customer.occupation,
          incomeSource: customer.incomeSource
        });
        this.loanFormService.getLoansByCitizenship(customer.citizenshipNumber).subscribe((response: any) => {
          this.previousLoans = response.detail;
          this.hasPreviousLoan = this.previousLoans.length > 0;
        }, error => console.error(error));
      }
    });
    this.customerFormField.showFormField = true;
  }

  openLoan(loanConfigId: number, customerId: number) {
    this.spinner = true;
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId
      }
    });
  }

  hidePreviousLoans() {
    this.hasPreviousLoan = false;
  }

  searchByRegNO() {
    this.companySearch.registrationNumber = this.loanForm.get('registrationNumber').value;
    this.companyInfoService.getPaginationWithSearchObject(this.companySearch).subscribe((response: any) => {
      if (response.detail.content <= 0) {
        this.companyFormField.isOldCustomer = false;
        this.toastService.show(new Alert(AlertType.INFO, 'No company  under given registration number.'));
        this.loanForm.patchValue({
          companyId: undefined,
          companyName: undefined,
          companyEstablishmentDate: undefined,
          companyPAN: undefined,
          businessType: undefined,
          companyInfoVersion: undefined
        });
      } else {
        this.companyFormField.isOldCustomer = true;
        const companyInfo: CompanyInfo = response.detail.content[0];
        this.loanForm.patchValue({
          companyId: companyInfo.id,
          companyName: companyInfo.companyName,
          companyEstablishmentDate: companyInfo.establishmentDate,
          companyPAN: companyInfo.panNumber,
          businessType: companyInfo.businessType,
          companyInfoVersion: companyInfo.version
        });
      }
    }, error => console.error(error));
    this.companyFormField.showFormField = true;
  }

  reqPersonalOrBusiness() {
    const citizenControl = this.loanForm.get('citizenshipNumber');
    const companyControl = this.loanForm.get('companyName');
    const regdControl = this.loanForm.get('registrationNumber');
    if (this.personal) {
      citizenControl.setValidators([Validators.required]);
      companyControl.setValidators(null);
      regdControl.setValidators(null);
    } else {
      citizenControl.setValidators([Validators.required]);
      companyControl.setValidators([Validators.required]);
      regdControl.setValidators([Validators.required]);
    }
  }
}

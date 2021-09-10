import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MicroCrgParams} from '../../../loan/model/MicroCrgParams';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../../@core/utils/constants/pattern';
import {NumberUtils} from '../../../../@core/utils/number-utils';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {ExpOfClient} from './model/ExpOfClient';
import {OwnershipOfResidence} from './model/OwnershipOfResidence';
import {RelationWithMega} from './model/RelationWithMega';
import {InsuranceCoverage} from './model/InsuranceCoverage';
import {LocationOfProperty} from './model/LocationOfProperty';
import {RoadAccess} from './model/RoadAccess';
import {Multibanking} from './model/Multibanking';
import {RepaymentHistory} from './model/RepaymentHistory';
import {MultipleSourceIncomeType} from './model/MajorSourceIncomeType';
import {RelationWithBank} from './model/RelationWithBank';
import {TypeOfSourceOfIncome, TypeOfSourceOfIncomeArray, TypeOfSourceOfIncomeMap} from './model/TypeOfSourceOfIncome';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-micro-crg-params',
  templateUrl: './micro-crg-params.component.html',
  styleUrls: ['./micro-crg-params.component.scss']
})
export class MicroCrgParamsComponent implements OnInit {

  @Input() fromProfile;
  @Input() microCrgParams: MicroCrgParams;
  @Output() dataEmitter = new EventEmitter();

  expOfClient = ExpOfClient.enumObject();
  ownershipOfResidence = OwnershipOfResidence.enumObject();
  relationWithMega = RelationWithMega.enumObject();
  insuranceCoverage = InsuranceCoverage.enumObject();
  locationOfProperty = LocationOfProperty.enumObject();
  roadAccess = RoadAccess.enumObject();
  multibanking = Multibanking.enumObject();
  relationWithBank = RelationWithBank.enumObject();
  repaymentHistory = RepaymentHistory.enumObject();

  microCrgParamsForm: FormGroup;
  microCrgParamsData: MicroCrgParams = new MicroCrgParams();
  currentFormData: Object;
  submitted = false;

  typeOfSourceOfIncomeArray = TypeOfSourceOfIncomeArray.typeOfSourceOfIncomeArray;
  majorSourceIncomeType = MultipleSourceIncomeType.enumObject();

  numberUtils = NumberUtils;
  client = environment.client;
  clientName = Clients;

  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) {
  }

  get form() {
    return this.microCrgParamsForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.microCrgParams)) {
      this.currentFormData = JSON.parse(this.microCrgParams.data);
      const initialFormData = this.currentFormData['initialForm'];

      this.setIncomeOfBorrower(initialFormData.incomeOfBorrower);
      this.setProjectDetails(initialFormData.projectDetailsArray);
      this.setExpensesOfBorrower(initialFormData.expensesOfBorrower);
      this.microCrgParamsForm.get('totalIncome').setValue(initialFormData.totalIncome);
      this.microCrgParamsForm.get('projectCostTotal').setValue(initialFormData.projectCostTotal);
      this.microCrgParamsForm.get('totalExpense').setValue(initialFormData.totalExpense);
      this.microCrgParamsForm.get('netSaving').setValue(initialFormData.netSaving);
      this.microCrgParamsForm.get('salesProjectionVsAchievement').setValue(initialFormData.salesProjectionVsAchievement);
      this.microCrgParamsForm.get('netWorthOfFirmOrCompany').setValue(initialFormData.netWorthOfFirmOrCompany);
      this.microCrgParamsForm.get('taxCompliance').setValue(initialFormData.taxCompliance);
      this.microCrgParamsForm.get('totalWorkingCapitalLimit').setValue(initialFormData.totalWorkingCapitalLimit);
      this.microCrgParamsForm.patchValue(initialFormData);
      this.methodListeners();
    } else {
        this.currentFormData = {
          initialForm: {}
        };
      this.addIncomeOfBorrower();
      this.addProjectDetails();
      this.addExpensesOfBorrower();
    }
  }

  buildForm() {
    this.microCrgParamsForm = this.formBuilder.group({
      incomeOfBorrower: this.formBuilder.array([]),
      projectDetailsArray: this.formBuilder.array([]),
      expensesOfBorrower: this.formBuilder.array([]),
      typeOfSourceOfIncomeObtainedScore: undefined,
      totalIncome: [0],
      projectCostTotal: [0],
      totalExpense: [0],
      currentTotal: [0],
      netSaving: [0],
      salesProjectionVsAchievement: undefined,
      netWorthOfFirmOrCompany: undefined,
      taxCompliance: undefined,
      totalWorkingCapitalLimit: [0],
      // crg lambda fields---
      majorSourceIncomeType: [undefined, [Validators.required]],
      periodOfEarning: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_ONLY)]],
      alternateIncomeSource: [undefined],
      alternateIncomeSourceAmount: [undefined, [Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      totalNetMonthlyIncome: [undefined],
      totalEMIInterest: [undefined],
      emiWithProposal: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      emiGrossMonthly: [undefined],
      emiNetMonthly: [undefined],
      note: [undefined],

      existingObligationOtherBank: [undefined],
      totalObligationCurrentBank: [undefined],
      totalBankObligation: [undefined],
      obligationGrossIncomeRatio: [undefined],

      totalDebt: [undefined, Validators.required],
      totalEquity: [undefined, Validators.required],
      netWorth: [undefined, Validators.required],
      totalLoan: [undefined, Validators.required],
      expOfClient: [undefined, Validators.required],
      ownershipOfResidence: [undefined, Validators.required],
      relationWithMega: [undefined, Validators.required],

      isSubsidized: [false],
      insuranceCoverage: [undefined],
      locationOfProperty: [undefined],
      roadAccess: [undefined],

      multibanking: [undefined, Validators.required],
      relationWithBank: [undefined, Validators.required],
      repaymentHistory: [undefined, Validators.required],
    });
  }

  setIncomeOfBorrower(currentData) {
    const controls = this.microCrgParamsForm.get('incomeOfBorrower') as FormArray;
    currentData.forEach(singleData => {
      controls.push(
          this.formBuilder.group({
            incomeSource: [singleData.incomeSource, Validators.required],
            organization: [singleData.organization, Validators.required],
            amount: [singleData.amount, Validators.required],
            remarks: [singleData.remarks, Validators.required],
            ageOfIncomeGenerated: [singleData.ageOfIncomeGenerated, Validators.required],
          })
      );
    });
  }

  setExpensesOfBorrower(currentData) {
    const controls = this.microCrgParamsForm.get('expensesOfBorrower') as FormArray;
    currentData.forEach(singleData => {
      controls.push(
          this.formBuilder.group({
            particulars: [singleData.particulars, Validators.required],
            amount: [singleData.amount, Validators.required],
            remarks: [singleData.remarks, Validators.required]
          })
      );
    });
  }

  addIncomeOfBorrower() {
    const control = this.microCrgParamsForm.controls.incomeOfBorrower as FormArray;
    control.push(
        this.formBuilder.group({
          incomeSource: [undefined, Validators.required],
          organization: [undefined, Validators.required],
          amount: [undefined, Validators.required],
          remarks: [undefined, Validators.required],
          ageOfIncomeGenerated: [undefined, Validators.required],
        })
    );
  }

  addExpensesOfBorrower() {
    const control = this.microCrgParamsForm.controls.expensesOfBorrower as FormArray;
    control.push(
        this.formBuilder.group({
          particulars: [undefined, Validators.required],
          amount: [undefined, Validators.required],
          remarks: [undefined, Validators.required]
        })
    );
  }

  removeIncomeIndex(incomeIndex) {
    (this.microCrgParamsForm.get('incomeOfBorrower') as FormArray).removeAt(incomeIndex);
    this.totalAdditionInitialForm('incomeOfBorrower', 'totalIncome');
  }

  removeExpensesIndex(incomeIndex) {
    (this.microCrgParamsForm.get('expensesOfBorrower') as FormArray).removeAt(incomeIndex);
    this.totalAdditionInitialForm('expensesOfBorrower', 'totalExpense');
  }

  totalAdditionInitialForm(formArrayName, resultControllerName) {
    let total = 0;
    (this.microCrgParamsForm.get(formArrayName) as FormArray).controls.forEach(group => {
      total = Number(group.get('amount').value) + Number(total);
    });
    this.microCrgParamsForm.get(resultControllerName).setValue(total);
    this.microCrgParamsForm.get('netSaving').setValue(Number(this.microCrgParamsForm.get('totalIncome').value)
        - Number(this.microCrgParamsForm.get('totalExpense').value));
  }

  totalEmiMonthlyGross() {
    const totalNetMonthly = Number(this.microCrgParamsForm.get('totalIncome').value) -
        Number(this.microCrgParamsForm.get('totalExpense').value);
    const totalEmiNetMonthly = (Number(this.microCrgParamsForm.get('emiWithProposal').value) / totalNetMonthly).toFixed(2);
    this.microCrgParamsForm.get('emiNetMonthly').patchValue(totalEmiNetMonthly);

    const totalEMIInterest = (Number(this.microCrgParamsForm.get('emiWithProposal').value) /
        Number(this.microCrgParamsForm.get('totalIncome').value)).toFixed(2);
    this.microCrgParamsForm.get('totalEMIInterest').patchValue(totalEMIInterest);
  }

  methodListeners() {
    this.microCrgParamsForm.get('totalIncome').valueChanges.subscribe(value => {
      this.totalObligationRatio();
    });
  }

  totalObligation() {
    this.microCrgParamsForm.get('totalBankObligation').setValue(Number(this.form.existingObligationOtherBank.value)
        + Number(this.form.totalObligationCurrentBank.value));
    this.totalObligationRatio();

  }

  totalObligationRatio() {
    this.microCrgParamsForm.get('obligationGrossIncomeRatio').setValue((
        this.form.totalBankObligation.value / this.form.totalIncome.value).toFixed(2));
  }

  optionChangeTypeOfSourceOfIncome($event, organizationSelect: NgSelectComponent, clearField: boolean) {
    if (clearField) {
      organizationSelect.clearModel();
    }
    switch ($event) {
      case TypeOfSourceOfIncome.SALARY:
        organizationSelect.itemsList.setItems(TypeOfSourceOfIncomeArray.salaryArray);
        break;
      case TypeOfSourceOfIncome.RENTAL:
        organizationSelect.itemsList.setItems(TypeOfSourceOfIncomeArray.rentalArray);
        break;
      case TypeOfSourceOfIncome.BUSINESS:
        organizationSelect.itemsList.setItems(TypeOfSourceOfIncomeArray.businessArray);
        break;
      case TypeOfSourceOfIncome.REMITTANCE:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.REMITTANCE]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.REMITTANCE,
          label: TypeOfSourceOfIncome.REMITTANCE
        });
        break;
      case TypeOfSourceOfIncome.COMMISSION:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.COMMISSION]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.COMMISSION,
          label: TypeOfSourceOfIncome.COMMISSION
        });
        break;
      case TypeOfSourceOfIncome.TRANSPORTATION:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.TRANSPORTATION]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.TRANSPORTATION,
          label: TypeOfSourceOfIncome.TRANSPORTATION
        });
        break;
      case TypeOfSourceOfIncome.FREELANCING:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.FREELANCING]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.FREELANCING,
          label: TypeOfSourceOfIncome.FREELANCING
        });
        break;
      case TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE,
          label: TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE
        });
        break;
      case TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS:
        organizationSelect.itemsList.setItems([TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS]);
        organizationSelect.select({
          value: TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS,
          label: TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS
        });
        break;
    }
  }

  calculateAndSetHighestScore() {
    const incomeSourcePointsArray = [];
    (this.microCrgParamsForm.get('incomeOfBorrower') as FormArray).controls.forEach(group => {
      incomeSourcePointsArray.push(TypeOfSourceOfIncomeMap.typeOfSourceOfIncomePointsMap.get(group.get('organization').value));
    });
    this.microCrgParamsForm.get('typeOfSourceOfIncomeObtainedScore').patchValue(Math.max(...incomeSourcePointsArray));
  }

  /** Project Details **/

  setProjectDetails(currentData) {
    const controls = this.microCrgParamsForm.get('projectDetailsArray') as FormArray;
    currentData.forEach(singleData => {
      controls.push(
          this.formBuilder.group({
            projectDescription: [singleData.projectDescription],
            projectCost: [singleData.projectCost],
            projectCostTotal: [singleData.projectCostTotal],
          })
      );
    });
  }

  addProjectDetails() {
    const control = this.microCrgParamsForm.controls.projectDetailsArray as FormArray;
    control.push(
        this.formBuilder.group({
          projectDescription: [undefined],
          projectCost: [undefined],
          projectCostTotal: [undefined],
        })
    );
  }

  removeProjectDetails(index) {
    (this.microCrgParamsForm.get('projectDetailsArray') as FormArray).removeAt(index);
    this.totalProjectDetails();
  }

  totalProjectDetails() {
    let total = 0;
    (this.microCrgParamsForm.get('projectDetailsArray') as FormArray).controls.forEach(group => {
      total = Number(group.get('projectCost').value) + Number(total);
    });
    this.microCrgParamsForm.get('projectCostTotal').setValue(total);
  }

  onSubmit() {
    this.overlay.show();
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.microCrgParams)) {
      this.microCrgParamsData = this.microCrgParams;
    }
    if (this.microCrgParamsForm.invalid) {
      this.overlay.hide();
      return;
    }
    this.calculateAndSetHighestScore();
    this.currentFormData['initialForm'] = this.microCrgParamsForm.value;
    this.microCrgParamsData.data = JSON.stringify(this.currentFormData);
    this.dataEmitter.emit(this.microCrgParamsData);
  }

}

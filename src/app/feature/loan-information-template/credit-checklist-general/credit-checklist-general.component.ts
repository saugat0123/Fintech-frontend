import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreditChecklistGeneral} from '../../loan/model/creditChecklistGeneral';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {NbToastrService} from '@nebular/theme';

@Component({
    selector: 'app-credit-checklist-general',
    templateUrl: './credit-checklist-general.component.html',
    styleUrls: ['./credit-checklist-general.component.scss']
})
export class CreditChecklistGeneralComponent implements OnInit {
    @Output() creditChecklistGeneralEmitter = new EventEmitter();
    @Input() formData: CreditChecklistGeneral;
    @Input() fromProfile;
    @Input() calendarType: CalendarType;
    @Input() customerType: CustomerType;
    @Input()
    client = environment.client;
    clientName = Clients;

    formGroupCheckList: FormGroup;
    dataForEdit;
    creditChecklistGeneral: CreditChecklistGeneral = new CreditChecklistGeneral();
    optionList = ['Yes', 'No', 'Na'];
    optionListRegulatory = ['Yes', 'No'];
    riskLevelOptions = ['HIGH', 'MEDIUM', 'LOW'];
    questionAnswer = [];
    riskCalculate = new Map();

    constructor(private formBuilder: FormBuilder,
                private toastService: NbToastrService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditChecklistGeneral = this.formData;
            this.dataForEdit = JSON.parse(this.formData.data);
        }
        this.buildForm(this.dataForEdit);
        const lowerCustomerType = !ObjectUtil.isEmpty(this.customerType) ? this.customerType.toLowerCase()
            : '';
        if (lowerCustomerType === 'institution') {
           this.questionAnswer = this.buildQuestionAnswer();
            this.questionAnswer.forEach(d => {
                const fa = this.formGroupCheckList.get('question') as FormArray;
                fa.push(this.buildQuestionForm());
            });
            if (!ObjectUtil.isEmpty(this.formData)) {
                if (!ObjectUtil.isEmpty(this.dataForEdit.question)) {
                    if (!ObjectUtil.isEmpty(this.dataForEdit.riskCalculate)) {
                        const jsonObj = JSON.parse(this.dataForEdit.riskCalculate);
                        for (let k of Object.keys(jsonObj)) {
                            this.riskCalculate.set(parseInt(k), jsonObj[k]);
                        }
                    }
                    this.dataForEdit.question.forEach((d, i) => {
                        this.formGroupCheckList.get(['question', i, 'answer']).patchValue(d.answer);
                        this.formGroupCheckList.get(['question', i, 'remarks']).patchValue(d.remarks);
                        this.formGroupCheckList.get(['question', i, 'questionNumber']).patchValue(d.questionNumber);
                    });
                }
            }
        }
    }

    buildForm(data) {
        this.formGroupCheckList = this.formBuilder.group({
            dateCheckList: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.dateCheckList)
                ? undefined : new Date(data.dateCheckList)],
            permit: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.permit)],
            permitRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.permitRemark)],
            clearance: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.clearance)],
            clearanceRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.clearanceRemark)],
            noProposal: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.noProposal)],
            noProposalRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.noProposalRemark)],
            audit: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.audit)],
            auditRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.auditRemark)],
            copies: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.copies)],
            copiesRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.copiesRemark)],
            verification: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.verification)],
            verificationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.verificationRemark)],
            valuation: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuation)],
            valuationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuationRemark)],
            dateValuation: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.dateValuation)
                ? undefined : new Date(data.dateValuation)],
            assets: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.assets)],
            assetsRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.assetsRemark)],
            callReportMonth: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReportMonth)],
            callReportDate: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.isEmpty(data.callReportDate)
                ? undefined : new Date(data.callReportDate)],
            callReportIrregularityReport: [ObjectUtil.isEmpty(data) ? undefined
                : ObjectUtil.setUndefinedIfNull(data.callReportIrregularityReport)],
            callReport: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReport)],
            callReportRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.callReportRemark)],
            director: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.director)],
            directorRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorRemark)],
            bankPost: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankPost)],
            bankPostRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankPostRemark)],
            share: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.share)],
            shareRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareRemark)],
            guarantor: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantor)],
            guarantorRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorRemark)],
            promoter: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.promoter)],
            promoterRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.promoterRemark)],
            shareOfBank: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareOfBank)],
            shareOfBankRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.shareOfBankRemark)],
            guarantorOfBank: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorOfBank)],
            guarantorOfBankRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.guarantorOfBankRemark)],
            financialInterest: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialInterest)],
            financialInterestRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialInterestRemark)],
            bankName: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bankName)],
            selfDeclaration: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.selfDeclaration)],
            applicantPG: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.applicantPG)],
            netWorth: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorth)],
            consentObtained: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.consentObtained)],
            directorUndivided: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorUndivided)],
            borrowingFirmCompany: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowingFirmCompany)],
            borrowerPromoter: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowerPromoter)],
            selfDeclarationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.selfDeclarationRemark)],
            applicantPGRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.applicantPGRemark)],
            netWorthRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorthRemark)],
            consentObtainedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.consentObtainedRemark)],
            directorUndividedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.directorUndividedRemark)],
            borrowingFirmCompanyRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowingFirmCompanyRemark)],
            borrowerPromoterRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowerPromoterRemark)],
            information: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.information)],
            informationRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.informationRemark)],
            form: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.form)],
            formRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.formRemark)],
            kyc: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.kyc)],
            AMLRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.AMLRemark)],
            operators: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.operators)],
            document: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.document)],
            nature: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nature)],
            audited: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.audited)],
            financial: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financial)],
            business: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.business)],
            customer: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.customer)],
            loan: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.loan)],
            settled: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.settled)],
            payment: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.payment)],
            identified: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.identified)],
            risk: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.risk)],
            enhanced: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.enhanced)],
            PEP: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.PEP)],
            diligence: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.diligence)],
            CIC: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.CIC)],
            rating: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.rating)],
            transaction: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.transaction)],
            transactionRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.transactionRemark)],
            ratingRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.ratingRemark)],
            CICRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.CICRemark)],
            diligenceRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.diligenceRemark)],
            PEPRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.PEPRemark)],
            enhancedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.enhancedRemark)],
            riskRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.riskRemark)],
            identifiedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.identifiedRemark)],
            paymentRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.paymentRemark)],
            settledRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.settledRemark)],
            loanRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.loanRemark)],
            customerRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.customerRemark)],
            businessRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.businessRemark)],
            financialRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.financialRemark)],
            natureRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.natureRemark)],
            documentRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.documentRemark)],
            operatorsRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.operatorsRemark)],
            kycRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.kycRemark)],
            prohibitedRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.prohibitedRemark)],
            prohibited: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.prohibited)],
            valuator: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuator)],
            valuatorRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.valuatorRemark)],
            borrower: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrower)],
            borrowerRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.borrowerRemark)],
            cites: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.cites)],
            citesRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.citesRemarks)],
            fishing: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.fishing)],
            fishingRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.fishingRemarks)],
            unesco: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.unesco)],
            unescoRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.unescoRemarks)],
            logging: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.logging)],
            loggingRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.loggingRemarks)],
            humanRight: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.humanRight)],
            humanRightRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.humanRightRemarks)],
            productionActivities: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.productionActivities)],
            productionActivitiesRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.productionActivitiesRemarks)],
            ifc: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.ifc)],
            ifcRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.ifcRemarks)],
            liscenceBoard: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.liscenceBoard)],
            liscenceBoardRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.liscenceBoardRemarks)],
            washing: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.washing)],
            washingRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.washingRemarks)],
            steel: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.steel)],
            steelRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.steelRemarks)],
            bricks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bricks)],
            bricksRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bricksRemarks)],
            tanning: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.tanning)],
            tanningRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.tanningRemarks)],
            nitrogen: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nitrogen)],
            nitrogenRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nitrogenRemarks)],
            chemicals: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.chemicals)],
            chemicalsRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.chemicalsRemarks)],
            plastic: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.plastic)],
            plasticRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.plasticRemarks)],
            batteries: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.batteries)],
            batteriesRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.batteriesRemarks)],
            papers: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.papers)],
            papersRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.papersRemarks)],
            smallScale: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.smallScale)],
            smallScaleRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.smallScaleRemarks)],
            overdue: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.overdue)],
            overdueRemarks: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.overdueRemarks)],
            fi: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.fi)],
            fiRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.fiRemark)],
            unit: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.unit)],
            unitRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.unitRemark)],
            netWorths: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorths)],
            netWorthsRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.netWorthsRemark)],
            der: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.der)],
            derRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.derRemark)],
            npr: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.npr)],
            nprRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nprRemark)],
            dscrRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.dscrRemark)],
            iscrRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.iscrRemark)],
            adeRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.adeRemark)],
            oRemark: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.oRemark)],
            esrmDate: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.esrmDate)],
            client: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.client)],
            customerId: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.customerId)],
            location: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.location)],
            industry: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.industry)],
            traded: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.traded)],
            nameOf: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.nameOf)],
            bl: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.bl)],
            question: this.formBuilder.array([]),
            esRisk: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.esRisk)],
            riskCalculate: undefined,
            criticalSector: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.criticalSector)],
            esDiligence: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.esDiligence)],
            riskLevel: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.riskLevel)],
            correctiveActionPlan: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.correctiveActionPlan)]
        });
    }

    environmentYesToAll() {
        this.formGroupCheckList.patchValue({
            cites: 'Yes',
            fishing: 'Yes',
            unesco: 'Yes',
            logging: 'Yes',
            humanRight: 'Yes',
            productionActivities: 'Yes',
            ifc: 'Yes',
            liscenceBoard: 'Yes',
            washing: 'Yes',
            steel: 'Yes',
            bricks: 'Yes',
            tanning: 'Yes',
            nitrogen: 'Yes',
            chemicals: 'Yes',
            plastic: 'Yes',
            batteries: 'Yes',
            papers: 'Yes',
            smallScale: 'Yes'
        });
    }

    creditGeneralYesToAll() {
        this.formGroupCheckList.get('permit').patchValue('Yes');
        this.formGroupCheckList.get('clearance').patchValue('Yes');
        this.formGroupCheckList.get('noProposal').patchValue('Yes');
        this.formGroupCheckList.get('audit').patchValue('Yes');
        this.formGroupCheckList.get('copies').patchValue('Yes');
        this.formGroupCheckList.get('verification').patchValue('Yes');
        this.formGroupCheckList.get('valuation').patchValue('Yes');
        this.formGroupCheckList.get('assets').patchValue('Yes');
        this.formGroupCheckList.get('callReport').patchValue('Yes');
        this.formGroupCheckList.get('selfDeclaration').patchValue('Yes');
        this.formGroupCheckList.get('applicantPG').patchValue('Yes');
        this.formGroupCheckList.get('netWorth').patchValue('Yes');
        this.formGroupCheckList.get('consentObtained').patchValue('Yes');
        this.formGroupCheckList.get('directorUndivided').patchValue('Yes');
        this.formGroupCheckList.get('borrowingFirmCompany').patchValue('Yes');
        this.formGroupCheckList.get('borrowerPromoter').patchValue('Yes');
    }

    directiveAll() {
        this.formGroupCheckList.get('director').patchValue('Yes');
        this.formGroupCheckList.get('bankPost').patchValue('Yes');
        this.formGroupCheckList.get('share').patchValue('Yes');
        this.formGroupCheckList.get('guarantor').patchValue('Yes');
        this.formGroupCheckList.get('promoter').patchValue('Yes');
        this.formGroupCheckList.get('shareOfBank').patchValue('Yes');
        this.formGroupCheckList.get('guarantorOfBank').patchValue('Yes');
        this.formGroupCheckList.get('financialInterest').patchValue('Yes');
        this.formGroupCheckList.get('prohibited').patchValue('Yes');
        this.formGroupCheckList.get('valuator').patchValue('Yes');
        this.formGroupCheckList.get('borrower').patchValue('Yes');
    }


    AMLYesAll() {
        this.formGroupCheckList.get('information').patchValue('Yes');
        this.formGroupCheckList.get('form').patchValue('Yes');
        this.formGroupCheckList.get('kyc').patchValue('Yes');
        this.formGroupCheckList.get('operators').patchValue('Yes');
        this.formGroupCheckList.get('document').patchValue('Yes');
        this.formGroupCheckList.get('nature').patchValue('Yes');
        this.formGroupCheckList.get('audited').patchValue('Yes');
        this.formGroupCheckList.get('financial').patchValue('Yes');
        this.formGroupCheckList.get('business').patchValue('Yes');
        this.formGroupCheckList.get('customer').patchValue('Yes');
        this.formGroupCheckList.get('loan').patchValue('Yes');
        this.formGroupCheckList.get('settled').patchValue('Yes');
        this.formGroupCheckList.get('payment').patchValue('Yes');
        this.formGroupCheckList.get('identified').patchValue('Yes');

        this.formGroupCheckList.get('risk').patchValue('Yes');
        this.formGroupCheckList.get('enhanced').patchValue('Yes');
        this.formGroupCheckList.get('PEP').patchValue('Yes');
        this.formGroupCheckList.get('diligence').patchValue('Yes');
        this.formGroupCheckList.get('CIC').patchValue('Yes');
        this.formGroupCheckList.get('rating').patchValue('Yes');
        this.formGroupCheckList.get('transaction').patchValue('Yes');

    }

    watchListAll() {
        this.formGroupCheckList.get('overdue').patchValue('Yes');
        this.formGroupCheckList.get('fi').patchValue('Yes');
        this.formGroupCheckList.get('unit').patchValue('Yes');
        this.formGroupCheckList.get('netWorths').patchValue('Yes');
        this.formGroupCheckList.get('npr').patchValue('Yes');
        this.formGroupCheckList.get('der').patchValue('Yes');
    }

    public buildQuestionAnswer() {
        const firstQuestion = [
            {
                'sn': '1.1',
                'question': 'Are there any legal issues associated with the client’s E&S performance?',
                'answer': [
                    'Client has all valid permits AND has not faced any legal claims or any serious environmental/social incident in last three years',
                    'Client does not have all valid permits but has taken definite steps to acquire them in next six months AND/OR client has faced legal claims but has addressed or has definite plan to address all of them',
                    'Client does not have all valid permits and has not taken any definite step to acquire them AND/OR client has faced legal claims and has no definite plan to address them',
                    'Not applicable'
                ]
            },
            {
                'sn': '1.2',
                'question': 'Have operations ever been affected by local stakeholder grievances, media or non-governmental organization (NGO) campaigns over E&S issues?',

                'answer': [
                    'There is no evidence of  stakeholder grievances, negative media or NGO protest',
                    'There is evidence of  stakeholder grievances, negative media or NGO protest for a particular operation AND client has taken adequate steps to address the issue',
                    'There is evidence of  stakeholder grievances, negative media or NGO protest and client has not taken any step to address the issue',
                    'Not applicable'
                ]
            },
            {
                'sn': '1.3',
                'question': 'Is project site and/or its routing likely to have negative impacts on sensitive areas (residential or protected sites) near the project site?',

                'answer': [
                    'No eco-sensitive areas observed',
                    'There are few eco-sensitive areas AND the client has taken adequate measures to mitigate the impact of their operation on the eco-sensitive areas as per regulations',
                    'There are eco-sensitive areas observed and mitigation measures are not adequate as per regulations and the client may face legal challenge in future',
                    'Not applicable'
                ]
            },
            {
                'sn': '2.1',
                'question': 'Is there any evidence of air and noise pollution from the client’s operation violating the Environment Protection Rules (Official Gazette, June 26/1997) or the conditions specified in the client’s Pollution Control Certificate?',

                'answer': [
                    'There is no evidence of air /noise pollution and non-compliance and/or all mitigation measures and monitoring systems are in place',
                    'There is evidence of air/ noise emission and non-compliance AND partial mitigation measure, monitoring system is in place AND client is addressing or has a definite plan to address the remaining issues',
                    'There is evidence of air emission/noise and non-compliance AND there is no mitigation measure/monitoring system in place AND client has no definite plan to address the issues',
                    'Not applicable'
                ]
            },
            {
                'sn': '2.2',
                'question': 'There is no evidence of water pollution and non-compliance and /or all mitigation measures and monitoring systems are in place',

                'answer': [
                    ' There is no evidence of land contamination or lack of waste handling mechanism or non-compliance OR all mitigation measures and monitoring systems are in place',
                    'There is evidence of air/ noise emission and non-compliance AND partial mitigation measure, monitoring system is in place AND client is addressing or has a definite plan to address the remaining issues',
                    'There is evidence of water pollution and non-compliance AND there is no mitigation measure/monitoring system in place AND client has no definite plan to address the issues',
                    'Not applicable'
                ]
            },
            {
                'sn': '2.3',
                'question': 'Is there any evidence of land pollution and lack of waste handling mechanism in the project operation violating the Environment Protection Rules (Official Gazette, June 26/1997) or the conditions specified in the client’s Pollution Control Certificate?',

                'answer': [
                    ' There is no evidence of land contamination or lack of waste handling mechanism or non-compliance OR all mitigation measures and monitoring systems are in place',
                    'There is evidence of land contamination or lack of waste handling mechanism or non-compliance AND partial mitigation measure, monitoring system is in place AND client is addressing or has a definite plan to address the remaining issues',
                    'There is evidence of land contamination or lack of waste handling mechanism or non-compliance AND there is no mitigation measure/monitoring system in place AND client has no definite plan to address the issues',
                    'Not applicable'
                ]
            },
            {
                'sn': '2.4',
                'question': 'Has the client made any investments in technologies or measures in its operation leading to cost savings by reducing energy consumption (increasing energy efficiency)  or using renewable energy (solar, wind, mini-hydropower, organic fuel)?',

                'answer': [
                    ' The client made investment in energy efficiency technologies / measures OR in renewable energy generation (electricity or heat) OR analyzed its operation from the energy efficiency standpoint (e.g. energy audit) and is actively pursuing opportunities for energy related cost savings.',
                    'The client is considering identifying opportunities for cost savings from improved energy efficiency or renewable energy use but has not made any particular steps in this direction yet',
                    'The client has never made any investment in technologies or measures for energy related cost savings and appears to be unaware of the opportunities in these areas',
                    'Not applicable'
                ]
            },
            {
                'sn': '3.1',
                'question': 'Is there any evidence of increased fire risk or occupational health & safety (OHS) risk, i.e. risk of injuries at work? ',

                'answer': [
                    'The client does not have any OHS concern or have mitigated them adequately',
                    'The client has some OHS concern but has taken definite steps to correct them',
                    'The client has OHS concern in its operation and have no plans of correcting them',
                    'Not applicable'
                ]
            },
            {
                'sn': '3.2',
                'question': 'Are the labor and working conditions poor and breaching local regulations / standards?',

                'answer': [
                    'There is proper working condition and labor practice AND there is no evidence of poor working condition or labor practice for which client may face legal challenge or labor unrest or negative media coverage or protest from activist',
                    'There are a few evidences of poor working conditions BUT no significantly poor labor practice such as child/forced labor is present AND the client has a definite plan to improve the working condition to ensure there is no legal challenge or labor unrest or negative media coverage or protest from activist in future',
                    'Working condition is very poor AND/OR there is presence of significantly poor labor practice such as child labor/forced labor AND client is not addressing/has no definite plan to address the issues',
                    'Not applicable'
                ]
            },
            {
                'sn': '3.3',
                'question': 'Does the project pose a threat to Community Health, Safety and Security?',

                'answer': [
                    'There is no evidence of issues that may create nuisance/accidents/injuries to local community in future or the company has a robust plan for community health & safety which was developed in consultation with the local community',
                    'There are a few evidences of issues that may create nuisance/ accidents/ injuries to local community AND the client intends to address the gaps AND/OR the client has a plan for community health & safety but it is not robust or it is not developed in consultation with the community',
                    'There is evidence of significant issues that can create nuisance/ accidents/ injuries to local community AND client has no definite plan to address the gaps AND/OR does not intend to manage its impact on community health & safety',
                    'Not applicable'
                ]
            },
            {
                'sn': '3.4',
                'question': 'Is there any evidence of community consultation with key stakeholders including indigenous people?',

                'answer': [
                    'There is evidence that the client consults / engages with the stakeholders including local community, indigenous people on (such as rehabilitation, compensation, their expectations as the case may be',
                    'There is limited / inadequate consultations with the stakeholders',
                    'No consultations with the stakeholders',
                    'Not applicable'
                ]
            },
        ];
        return firstQuestion;
    }

    onChange(index, value) {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        this.riskCalculate.set(index, value);
        this.riskCalculate.forEach((value, key) => {
            switch (value) {
                case 0: {
                    a++;
                }
                    break;
                case 1: {
                    b++;
                }
                    break;

                case 2: {
                    c++;
                }
                    break;

                case 3: {
                    d++;
                }
                    break;
            }
        });
        if (a + d === this.questionAnswer.length || b === 0 || c === 0) {
            this.formGroupCheckList.get('esRisk').patchValue('Low Risk');
        }
        if (b > 0 && c < 1) {
            this.formGroupCheckList.get('esRisk').patchValue('Medium Risk');
        }
        if (c > 1) {
            this.formGroupCheckList.get('esRisk').patchValue('High Risk');
        }
    }

    buildQuestionForm(): FormGroup {
        return this.formBuilder.group({
            answer: [undefined, Validators.required],
            remarks: [undefined],
            questionNumber: [undefined],
        });
    }

    submitForm() {
        if (this.customerType.toLowerCase() === 'institution') {
            if (this.formGroupCheckList.invalid) {
                this.toastService.warning('Please Fill ESRM Annex 3');
                return;
            }
            let jsonObject = {};
            this.riskCalculate.forEach((value, key) => {
                jsonObject[key] = value;
            });
            this.formGroupCheckList.get('riskCalculate').patchValue(JSON.stringify(jsonObject));
        }
        this.creditChecklistGeneral.data = JSON.stringify(this.formGroupCheckList.value);
        this.creditChecklistGeneralEmitter.emit(this.creditChecklistGeneral);
    }

    setDefaultValueYes() {
        this.formGroupCheckList.get('criticalSector').patchValue('Yes');
        this.formGroupCheckList.get('esDiligence').patchValue('Yes');
    }
}

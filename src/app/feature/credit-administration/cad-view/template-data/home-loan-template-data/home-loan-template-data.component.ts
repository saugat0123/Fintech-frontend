import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HomeLoanType} from '../../cad-constant/home-loan-type';
import {ConstructionLoanComponent} from '../home-loan-type/construction-loan/construction-loan.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../model/OfferDocument';
import {ToastService} from '../../../../../@core/utils';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {HomeLandAndBuildingComponent} from '../home-loan-type/home-land-and-building/home-land-and-building.component';
import {HomeLoanComponent} from '../../../cad-document-template/mega/home-loan/home-loan.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CadOfferLetterConfigurationComponent} from "../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-home-loan-template-data',
    templateUrl: './home-loan-template-data.component.html',
    styleUrls: ['./home-loan-template-data.component.scss']
})
export class HomeLoanTemplateDataComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    homeLoanForm: FormGroup;
    homeLoanType: Array<String> = new Array<String>();
    offerLetterConst = NabilOfferLetterConst;
    isConstructionLoan = false;
    isPurchaseLoan = false;
    isTakeOverLoan = false;
    submitted = false;
    spinner = false;
    btnDisable = true;
    loanLimit: false;
    existingOfferLetter = false;
    previewBtn = true;
    closed = false;

    @ViewChild('constructionLoan', {static: false}) constructionLoan: ConstructionLoanComponent;
    @ViewChild('landAndBuilding', {static: false}) landAndBuilding: HomeLandAndBuildingComponent;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                private dialogService: NbDialogService,
                protected dialogRefcad: NbDialogRef<CadOfferLetterConfigurationComponent>,
                private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.getHomeLoanType();
        if (this.isConstructionLoan) {
            this.landAndBuilding.landBuildingForm.clearValidators();
            this.landAndBuilding.landBuildingForm.updateValueAndValidity();
        }
        if (this.isPurchaseLoan || this.isTakeOverLoan) {
            this.constructionLoan.constructionLoanForm.clearValidators();
            this.constructionLoan.constructionLoanForm.updateValueAndValidity();
        }
    }

    private getHomeLoanType(): void {
        HomeLoanType.enumObject().forEach(element => {
            this.homeLoanType.push(element);
        });
    }

    private buildForm(): FormGroup {
        return this.homeLoanForm = this.formBuilder.group({
            homeLoanType: [undefined],
        });
    }

    public typeOfHomeLoan(value): void {
        this.isConstructionLoan = value === HomeLoanType.CONSTRUCTION.valueOf();
        this.isPurchaseLoan = value === HomeLoanType.PURCHASE.valueOf();
        this.isTakeOverLoan = value === HomeLoanType.TAKE_OVER.valueOf();
    }
    openModel() {
        this.dialogService.open(HomeLoanComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
            hasBackdrop: false,
            context: {
                cadOfferLetterApprovedDoc: this.customerApprovedDoc,
                preview: true,
            },
            dialogClass: 'model-full',
        });
    }

    onSubmit() {
        this.spinner = true;
        this.submitted = true;

        let homeLoan;
        if (this.isConstructionLoan) {
            homeLoan = this.constructionLoan.constructionLoanForm;
        }
        if (this.isPurchaseLoan || this.isTakeOverLoan) {
            homeLoan = this.landAndBuilding.landBuildingForm;
        }
        if (homeLoan.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
            this.spinner = false;
            return;
        }
        const securityDetails = [{
            securities: homeLoan.get('securities').value,
        }];
        homeLoan.value['securityDetails'] = securityDetails;
        this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
        const offerDocument = new OfferDocument();
        offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HOME_LOAN);
        offerDocument.initialInformation = JSON.stringify({loan: homeLoan.value, loanType: this.homeLoanForm.get('homeLoanType').value});
        this.customerApprovedDoc.offerDocumentList.push(offerDocument);

        console.log('Customer Document', this.customerApprovedDoc.offerDocumentList);

        this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.customerApprovedDoc = res.detail;
            this.spinner = false;
            this.previewBtn = false;
            this.btnDisable = false;
            this.closed = true;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.btnDisable = true;
            this.previewBtn = false;
        });
    }

    openCloseTemplate(template) {
        this.modalService.open(template);
    }

    dismiss(template){
        this.modalService.dismissAll();
    }

    decline(template){
        this.modalService.dismissAll();
    }

    accept(){
        this.modalService.dismissAll();
        this.dialogRefcad.close();
    }

}

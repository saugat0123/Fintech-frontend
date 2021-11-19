import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PromissoryNoteIndividualPrintComponent} from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {NbButtonModule, NbSpinnerModule} from '@nebular/theme';
import {LetterOfSetOffComponent} from './letter-of-set-off/letter-of-set-off.component';
import {LetterOfSetOffPrintComponent} from './letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import {LoanDeedPartnershipComponent} from './loan-deed-partnership/loan-deed-partnership.component';
import {PersonalGuaranteeIndividualPrintComponent} from './personal-guarantee-individual/personal-guarantee-individual-print/personal-guarantee-individual-print.component';
import {PersonalGuaranteeIndividualComponent} from './personal-guarantee-individual/personal-guarantee-individual.component';
import {PersonalGuaranteeCompanyComponent} from './personal-guarantee-company/personal-guarantee-company.component';
import {NabilLoanDeedCompanyComponent} from './nabil-loan-deed-company/nabil-loan-deed-company.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {LoanDeedIndividualPrintComponent} from './loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import {PromissoryNotePartnershipComponent} from './promissory-note-partnership/promissory-note-partnership.component';
import {PromissoryNotePartnershipPrintComponent} from './promissory-note-partnership/promissory-note-partnership-print/promissory-note-partnership-print.component';
import { PersonalGuaranteePartnershipComponent } from './personal-guarantee-partnership/personal-guarantee-partnership.component';
import {PromissoryNoteProprietorshipComponent} from './promissory-note-proprietorship/promissory-note-proprietorship.component';
import {PromissoryNoteProprietorshipPrintComponent} from './promissory-note-proprietorship/promissory-note-propertiership-print/promissory-note-proprietorship-print.component';
import {LoanDeedPartnershipPrintComponent} from './loan-deed-partnership/loan-deed-partnership-print/loan-deed-partnership-print.component';
import {LetterVehicleThirdpartyCompanyComponent} from './letter-vehicle-thirdparty-company/letter-vehicle-thirdparty-company.component';
import {LetterVehicleThirdpartyCompanyPrintComponent} from './letter-vehicle-thirdparty-company/letter-vehicle-thirdparty-company-print/letter-vehicle-thirdparty-company-print.component';
import { LetterVehicleIndividualComponent } from './letter-vehicle-individual/letter-vehicle-individual.component';
import { LetterVehicleIndividualPrintComponent } from './letter-vehicle-individual/letter-vehicle-individual-print/letter-vehicle-individual-print.component';
import { PromissoryNoteCompanyPrintComponent } from './promissory-note-company/promissory-note-company-print/promissory-note-company-print.component';
import {PersonalGuaranteeProprietorshipComponent} from './personal-guarantee-proprietorship/personal-gaurantee-proprietorship.component';
import { MegaOfferLetterTemplateModule } from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import { NabilSmeComponent } from './nabil-sme/nabil-sme.component';
import { KisanKarjaSubsidyComponent } from './nabil-sme/kisan-karja-subsidy/kisan-karja-subsidy.component';
import { UdyamsilKarjaSubsidyComponent } from './nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy.component';
import { DdslWithoutSubsidyComponent } from './nabil-sme/ddsl-without-subsidy/ddsl-without-subsidy.component';


@NgModule({
    declarations: [
        PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent, PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent,
        PersonalGuaranteeCompanyComponent, PromissoryNoteCompanyComponent, NabilLoanDeedCompanyComponent,
        LoanDeedIndividualComponent, LoanDeedIndividualPrintComponent, PromissoryNotePartnershipComponent, PromissoryNotePartnershipPrintComponent, PersonalGuaranteePartnershipComponent,
        PersonalGuaranteeCompanyComponent, PromissoryNoteCompanyComponent, NabilLoanDeedCompanyComponent,
        LoanDeedIndividualComponent, LoanDeedIndividualPrintComponent,
        LetterVehicleIndividualComponent, LetterVehicleIndividualPrintComponent,
        LoanDeedIndividualPrintComponent, PromissoryNoteProprietorshipComponent, PromissoryNoteProprietorshipPrintComponent,
        PromissoryNotePartnershipComponent, PromissoryNotePartnershipPrintComponent,
        PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent,
        LoanDeedPartnershipComponent,
        PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent, LoanDeedIndividualComponent, LoanDeedPartnershipPrintComponent, LetterVehicleThirdpartyCompanyComponent, LetterVehicleThirdpartyCompanyPrintComponent,
        PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent,
        LoanDeedIndividualComponent, LoanDeedPartnershipPrintComponent, PromissoryNoteCompanyPrintComponent, PersonalGuaranteeProprietorshipComponent, NabilSmeComponent, KisanKarjaSubsidyComponent, UdyamsilKarjaSubsidyComponent, DdslWithoutSubsidyComponent],

    exports: [
        PromissoryNoteIndividualComponent,
        LetterOfSetOffComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeIndividualComponent,
        LetterOfSetOffPrintComponent,
        PromissoryNoteIndividualPrintComponent,
        PromissoryNoteCompanyComponent,
        LoanDeedIndividualComponent,
        LoanDeedIndividualPrintComponent,
        NabilLoanDeedCompanyComponent,
        LetterVehicleIndividualComponent,
        LetterVehicleIndividualPrintComponent,
        NabilLoanDeedCompanyComponent,
        PromissoryNoteProprietorshipPrintComponent,
        PromissoryNoteProprietorshipComponent,
        PromissoryNotePartnershipComponent,
        PromissoryNotePartnershipPrintComponent,
        PersonalGuaranteePartnershipComponent,
        LoanDeedPartnershipComponent,
        LoanDeedPartnershipPrintComponent,
        LetterVehicleThirdpartyCompanyComponent,
        LetterVehicleThirdpartyCompanyPrintComponent,
        PersonalGuaranteeProprietorshipComponent,
        KisanKarjaSubsidyComponent,
        UdyamsilKarjaSubsidyComponent,
        DdslWithoutSubsidyComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule,
        NbButtonModule,
        CKEditorModule,
        NbSpinnerModule,
        MegaOfferLetterTemplateModule,
    ],
    entryComponents: [
        UdyamsilKarjaSubsidyComponent
    ]
})
export class NabilModule {
}

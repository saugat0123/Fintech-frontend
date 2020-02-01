import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepaliTemplateDataHolder} from '../../../model/nepali-template-data-holder';
import {NepaliTemplateType} from '../../../../admin/modal/nepali-template-type.enum';

@Component({
    selector: 'app-hayar-parches-karja-nibedan',
    templateUrl: './hayar-parches-karja-nibedan.component.html',
    styleUrls: ['./hayar-parches-karja-nibedan.component.scss']
})
export class HayarParchesKarjaNibedanComponent implements OnInit {
    @Input() karjaLoan: Array<NepaliTemplateDataHolder>;
    hayarParchesKarjaInfo: FormGroup;
    submitted = false;
    finalData: string;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.formBuild();

        if (this.karjaLoan !== undefined) {
            for (let i = 0; i < this.karjaLoan.length; i++) {
                if (this.karjaLoan[i].type === NepaliTemplateType.HIRE_PURCHASE_KARJA_BIKE) {
                    const parsedData = JSON.parse(this.karjaLoan[i].data);
                    this.hayarParchesKarjaInfo.patchValue(parsedData);
                    break;
                }
            }
        }

    }
    get hayarParchesKarjaValid() {
        return this.hayarParchesKarjaInfo.controls;
    }

    formBuild(): void {
        this.hayarParchesKarjaInfo = this.formBuilder.group({
            /**
             * 0st column
             */
            date: [undefined, Validators.required],
            applicantPhoto: [undefined],
            selectPronoun: [undefined],
            headerName: [undefined],
            selectPronoun1: [undefined],
            selectPronoun2: [undefined],
            selectPronoun3: [undefined],
            selectPronoun4: [undefined],

            /**
             * 1st column
             */
            borrowMoney: [undefined],
            duration: [undefined],
            month: [undefined],
            applicanttName: [undefined],
            applicantAge: [undefined],
            applicantGender: [undefined],


            /**
             * 2nd column
             */
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentWardNo: [undefined],
            permanentTole: [undefined],
            permanentHouseNo: [undefined],
            permanentStayedYear: [undefined],
            permanentPhoneNo: [undefined],
            permanentContactNo: [undefined],
            permanentEmail: [undefined],

            tempDistrict: [undefined],
            tempMunicipality: [undefined],
            tempWardNo: [undefined],
            tempTole: [undefined],
            tempHouseNo: [undefined],
            tempStayedYear: [undefined],
            tempPhoneNo: [undefined],
            tempContactNo: [undefined],
            tempEmail: [undefined],

            StayingPlace: [undefined],
            fatherName: [undefined],
            gFatherName: [undefined],
            husbandWifeName: [undefined],
            totalFamilyMember: [undefined],
            heritancePersonName: [undefined],
            relation: [undefined],
            /**
             * 3rd column
             */
            occuption: [undefined],
            officeName: [undefined],
            officePhoneNo: [undefined],
            officeFaxNo: [undefined],
            officeAddress: [undefined],
            officeEmail: [undefined],
            recentPost: [undefined],
            currentEmployerPeriod: [undefined],
            bussinessName: [undefined],
            bussinessPhoneNo: [undefined],
            bussinessFaxNo: [undefined],
            bussinessEmail: [undefined],
            bussinessAddress: [undefined],
            bussinessNature: [undefined],
            bussinessStartDate: [undefined],
            incomeTaxNo: [undefined],
            investInBussiness: [undefined],
            monthlyBussiness: [undefined],
            monthlyIncome: [undefined],
            otherIncome: [undefined],
            homeOwnerName: [undefined],
            rentalPhoneNo: [undefined],
            rentalMonthlyCharge: [undefined],
            rentalAddress: [undefined],
            rentalAgreement: [undefined],
            /**
             * 4th column
             */
            landsOwnerName: [undefined],
            homeCondition: [undefined],
            estimatedValue: [undefined],
            landArea: [undefined],
            landAddress: [undefined],
            vehiclesType: [undefined],
            vehicleModel: [undefined],
            vehicleRate: [undefined],
            vehiclesRegisteredNo: [undefined],
            householdGoodDetail: [undefined],
            debtTransaction: [undefined],
            loanTitle: [undefined],
            loanMoney: [undefined],
            loanDate: [undefined],
            creditCard: [undefined],
            ifAny: [undefined],
            bankName: [undefined],
            accountNumber: [undefined],
            branch: [undefined],
            accountType: [undefined],
            bankBalance: [undefined],
            guarantorName: [undefined],
            guarantorRelation: [undefined],
            guarantorAddress: [undefined],
            guarantorPhoneNo: [undefined],
            guarantorMobileNo: [undefined],
            guarantorOccuption: [undefined],
            guarantorOfficeName: [undefined],
            /**
             * 5th column
             */
            firstName: [undefined],
            firstRelation: [undefined],
            firstAddress: [undefined],
            firstContactNo: [undefined],
            firstMobileNo: [undefined],
            secondName: [undefined],
            secondRelation: [undefined],
            secondAddress: [undefined],
            secondContactNo: [undefined],
            secondMobileNo: [undefined],
            thirdName: [undefined],
            thirdRelation: [undefined],
            thirdAddress: [undefined],
            thirdContactNo: [undefined],
            thirdMobileNo: [undefined],
            forthName: [undefined],
            forthRelation: [undefined],
            forthAddress: [undefined],
            forthContactNo: [undefined],
            forthMobileNo: [undefined],
            /**
             * 6th column
             */
            selectPronoun10: [undefined],
            selectPronoun5: [undefined],
            selectPronoun6: [undefined],
            selectPronoun7: [undefined],
            selectPronoun8: [undefined],
            selectPronoun9: [undefined],
            applicantSignature: [undefined],
            applicantsName: [undefined],
            applicantsDate: [undefined],
            guarantorsSignature: [undefined],
            guarantorsName: [undefined],
            guarantorsDate: [undefined],

        });
    }

    submit(): void {
        this.finalData = this.hayarParchesKarjaInfo.value;
    }

}

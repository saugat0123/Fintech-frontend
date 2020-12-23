import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {RelationshipList} from '../../../../loan/model/relationshipList';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {District} from '../../../../admin/modal/district';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';

@Component({
    selector: 'app-owner-kyc-applicable',
    templateUrl: './owner-kyc-applicable.component.html',
    styleUrls: ['./owner-kyc-applicable.component.scss']
})
export class OwnerKycApplicableComponent implements OnInit {

    ownerKycForm: FormGroup;
    ownerRelationship: RelationshipList = new RelationshipList();
    @Input() data;
    @Input() ownerFormData;
    allDistrict: Array<District> = Array<District>();
    shareSecurityData: ShareSecurity = new ShareSecurity();
    submitValue: any;
    constructor(private formBuilder: FormBuilder,
                private districtService: AddressService) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.data !== undefined) {
            this.setOwnerKycDetails(this.data);
        } else {
            this.addMoreOwnerKycDetail();
        }
        this.getAllDistrict();
    }


    buildForm() {
        this.ownerKycForm = this.formBuilder.group({
            ownerKycDetails: this.formBuilder.array([]),
        });
    }

    setOwnerKycDetails(currentData) {
        const ownerKycDetails = this.ownerKycForm.get('ownerKycDetails') as FormArray;
        currentData.forEach((singleData) => {
            ownerKycDetails.push(
                this.formBuilder.group({
                    ownerRelationship: [singleData.ownerRelationship],
                    relationName: [singleData.relationName],
                    citizenshipNumber: [singleData.citizenshipNumber],
                    issuedLocation: [singleData.issuedLocation],
                    issuedDate: [singleData.issuedDate],
                    mobileNumber: [singleData.mobileNumber],
                    address: [singleData.address],

                })
            );
        });
    }

    ownerKycDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                ownerRelationship: [undefined],
                relationName: [undefined],
                citizenshipNumber: [undefined],
                issuedLocation: [undefined],
                issuedDate: [undefined],
                mobileNumber: [undefined],
                address: [undefined],
            }
        );
    }

    addMoreOwnerKycDetail() {
        (this.ownerKycForm.get('ownerKycDetails') as FormArray).push(this.ownerKycDetailsFormGroup());
    }

    removeOwnerKycDetail(index: number) {
        (<FormArray>this.ownerKycForm.get('ownerKycDetails')).removeAt(index);
    }

    getAllDistrict() {
        this.districtService.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
        }, (error) => {
            console.log(error);
        });
    }

    onSubmit() {
        if (this.ownerKycForm.invalid) {
            return;
        }
        this.submitValue = this.ownerKycForm.value;
    }
}

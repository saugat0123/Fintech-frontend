import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-nepali-loan-template',
  templateUrl: './nepali-loan-template.component.html',
  styleUrls: ['./nepali-loan-template.component.scss']
})
export class NepaliLoanTemplateComponent implements OnInit {
 nepaliLoan: FormGroup;
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.nepaliLoan = this.formBuilder.group({
        customerName: [undefined],
        rupees: [undefined],
        amountInWords: [undefined],
        guarantorName: [undefined],
        nameNepali: [undefined],
        name: [undefined],
        address: [undefined],
        age: [undefined],
        citizenship: [undefined],
        issuedYear: [undefined],
        issuedPlace: [undefined],
        fatherName: [undefined],
        grandfatherName: [undefined],
        relationship: [undefined],
        knownDebtor: [undefined],
        permanentAddress: [undefined],
        currentAddress: [undefined],
        municipality: [undefined],
        wardNumber: [undefined],
        tol: [undefined],
        houseNumber: [undefined],
        contactNo: [undefined],
        mobileNo: [undefined],
        email: [undefined],
        currentResidence: [undefined],
        occupation: [undefined],
        companyName: [undefined],
        workAddress: [undefined],
        WorkPhoneNo: [undefined],
        position: [undefined],
        spouseName: [undefined],
        schoolCollegeName: [undefined],
        level: [undefined],
        relativesName: [undefined],
        relativesAddress: [undefined],
        relativesPhone: [undefined],
        relativesMobileNo: [undefined],
      relativesDetails: this.formBuilder.array([])
    });
    this.addDetails();
  }
  addDetails() {
    const addDetails = this.nepaliLoan.get('relativesDetails') as FormArray;
    addDetails.push(
        this.formBuilder.group({
          relativesName: [undefined],
          relativesAddress: [undefined],
          relativesPhone: [undefined],
          relativesMobileNo: [undefined],
        })
    );
  }

  removeDetails(index: number) {
    (this.nepaliLoan.get('relativesDetails') as FormArray).removeAt(index);
  }

}

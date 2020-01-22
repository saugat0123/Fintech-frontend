import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bike-karja',
  templateUrl: './bike-karja.component.html',
  styleUrls: ['./bike-karja.component.scss']
})
export class BikeKarjaComponent implements OnInit {

  // date1: string;
  // proposalAmount: number;
  // applicantFullName: string;
  // applicantDob: string;
  //
  bikeKarjaForm: FormGroup;


  constructor(
      private formBuilder: FormBuilder) {

  }


  ngOnInit() {
    this.buildBikeKarjaForm();
  }

  buildBikeKarjaForm() {
    this.bikeKarjaForm = this.formBuilder.group({
      date1: [undefined],
      photo: [undefined],
      proposalAmount: [undefined],
      applicantFullName: [undefined],
      applicantDob: [undefined],
    /*
    * placeholder for few radio buttons*/

      applicant

    });
  }


}

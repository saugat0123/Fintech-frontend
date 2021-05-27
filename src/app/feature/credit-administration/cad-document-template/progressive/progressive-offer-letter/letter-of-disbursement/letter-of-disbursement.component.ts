import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-disbursement',
  templateUrl: './letter-of-disbursement.component.html',
  styleUrls: ['./letter-of-disbursement.component.scss']
})
export class LetterOfDisbursementComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }

  onSubmit():void{

  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-loan-deed',
  templateUrl: './loan-deed.component.html',
  styleUrls: ['./loan-deed.component.scss']
})
export class LoanDeedComponent implements OnInit {

  @Input()
  offerLetterType;
  @Input()
  cadOfferLetterApprovedDoc;

  form:FormGroup;
  constructor(private  formBuilder:FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.form=this.formBuilder.group({

    })
  }


  onSubmit():void{

  }

}

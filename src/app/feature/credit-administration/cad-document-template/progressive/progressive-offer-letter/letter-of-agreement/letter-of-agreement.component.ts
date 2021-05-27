import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-agreement',
  templateUrl: './letter-of-agreement.component.html',
  styleUrls: ['./letter-of-agreement.component.scss']
})
export class LetterOfAgreementComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }

  onSubmit():void{

  }
}

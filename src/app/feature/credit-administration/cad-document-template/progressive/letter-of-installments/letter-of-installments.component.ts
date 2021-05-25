import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-installments',
  templateUrl: './letter-of-installments.component.html',
  styleUrls: ['./letter-of-installments.component.scss']
})
export class LetterOfInstallmentsComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }

  onSumbit():void{

  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-hire-purchase-deed',
  templateUrl: './hire-purchase-deed.component.html',
  styleUrls: ['./hire-purchase-deed.component.scss']
})
export class HirePurchaseDeedComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }

  onSubmit():void{

  }
}

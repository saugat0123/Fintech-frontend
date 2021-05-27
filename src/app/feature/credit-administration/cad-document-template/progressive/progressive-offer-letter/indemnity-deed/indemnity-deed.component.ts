import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';


@Component({
  selector: 'app-indemnity-deed',
  templateUrl: './indemnity-deed.component.html',
  styleUrls: ['./indemnity-deed.component.scss']
})
export class IndemnityDeedComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }

  onSubmit():void{

  }
}

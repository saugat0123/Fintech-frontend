import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-promissory-note-guarantor',
  templateUrl: './promissory-note-guarantor.component.html',
  styleUrls: ['./promissory-note-guarantor.component.scss']
})
export class PromissoryNoteGuarantorComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }


  onSubmit():void{

  }

}

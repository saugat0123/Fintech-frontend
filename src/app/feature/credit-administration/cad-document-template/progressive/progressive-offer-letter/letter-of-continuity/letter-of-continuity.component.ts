import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-letter-of-continuity',
  templateUrl: './letter-of-continuity.component.html',
  styleUrls: ['./letter-of-continuity.component.scss']
})
export class LetterOfContinuityComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({

    })
  }
  onSubmit():void{

  }
}

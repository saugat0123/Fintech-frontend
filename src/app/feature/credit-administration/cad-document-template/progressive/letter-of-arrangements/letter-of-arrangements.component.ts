import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-letter-of-arrangements',
  templateUrl: './letter-of-arrangements.component.html',
  styleUrls: ['./letter-of-arrangements.component.scss']
})
export class LetterOfArrangementsComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form=this.formBuilder.group({
      date:[undefined],
      chaluPuji:[undefined],
      singnature:[undefined],
      signaturePersonName:[undefined]
    })
  }

  onSubmit():void{

  }
}

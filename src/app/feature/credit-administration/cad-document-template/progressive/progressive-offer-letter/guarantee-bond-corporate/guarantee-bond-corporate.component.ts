import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';


@Component({
  selector: 'app-guarantee-bond-corporate',
  templateUrl: './guarantee-bond-corporate.component.html',
  styleUrls: ['./guarantee-bond-corporate.component.scss']
})
export class GuaranteeBondCorporateComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {

    this.form=this.formBuilder.group({
      districtName:[undefined],
      municipalityName:[undefined],
      wadNo:[undefined],
      branchName:[undefined],
      registerCompanyName:[undefined],
      date:[undefined],
      ltdNo:[undefined],
      registerDistrict:[undefined],
      regsiterMunicipality:[undefined],
      registerWadNo:[undefined],
      sewaKendra:[undefined],
      certificateNo:[undefined],
      registerDate:[undefined],
      guaranterName:[undefined],
      grandParentName:[undefined],
      grandChildName:[undefined],
      childName:[undefined],


    })
  }


  onSumbit():void{
  //  statements
  }



}

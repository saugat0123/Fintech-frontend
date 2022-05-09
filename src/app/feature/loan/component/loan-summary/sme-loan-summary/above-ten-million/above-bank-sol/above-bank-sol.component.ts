import { Component, OnInit } from '@angular/core';
import {CoreCapitalService} from '../../../../../../admin/service/core-capital.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-bank-sol',
  templateUrl: './above-bank-sol.component.html',
  styleUrls: ['./above-bank-sol.component.scss']
})
export class AboveBankSolComponent implements OnInit {

  nrpValue:any;
  asOnDate: any;

  constructor(
      private coreCapitalService: CoreCapitalService
  ) { }

  ngOnInit() {
    this.coreCapitalService.getActiveBaseRate().subscribe(rs=>{
      if(!ObjectUtil.isEmpty(rs.detail)) {
      this.nrpValue = rs.detail.rate;
      this.asOnDate = rs.detail.createdAt;
      }
    })
  }

}

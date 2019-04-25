import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {User} from '../../../module/admin/modal/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user:User=new User();

  constructor(private commonService:CommonService) { }

  ngOnInit() {
   this.commonService.getByAll('v1/user/authenticated').subscribe(
       (response:any) => {
         this.user=response.detail;
         console.log(response.detail);
       }
   )
  }

}

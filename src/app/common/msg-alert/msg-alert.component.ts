import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
declare var $;
@Component({
  selector: 'app-msg-alert',
  templateUrl: './msg-alert.component.html',
  styleUrls: ['./msg-alert.component.css']
})
export class MsgAlertComponent implements OnInit{
 count = 0


globalMsg: string;
  flag:string

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    
    this.dataService.currentMsg.subscribe(message => this.globalMsg = message);
   this.dataService.currentAlertFlag.subscribe(flagStatus => this.flag = flagStatus);
   $(".alert-custom").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert-custom").slideUp(500);
     });   
 
   
  }

  closeAlert(){
    $(".alert-custom").slideUp();
   
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {RouteConst} from '../../../feature/credit-administration/model/RouteConst';

@Component({
  selector: 'app-cad-data',
  templateUrl: './cad-data.component.html',
  styleUrls: ['./cad-data.component.scss']
})
export class CadDataComponent implements OnInit {
  @Input() customerApproveCountDto;

  offerRouteConst = RouteConst;

  constructor() { }

  ngOnInit() {
  }

}

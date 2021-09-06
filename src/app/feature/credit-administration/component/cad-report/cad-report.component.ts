import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditAdministrationService} from '../../service/credit-administration.service';

@Component({
  selector: 'app-cad-report',
  templateUrl: './cad-report.component.html',
  styleUrls: ['./cad-report.component.scss']
})
export class CadReportComponent implements OnInit {
  list = [];

  constructor(public modalService: NgbActiveModal, private service: CreditAdministrationService) {
  }

  ngOnInit() {
    alert('opend')
    this.service.getUserStatForCadAdmin().subscribe((res: any) => {
      this.list = res.detail;
    }
  );
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-disbursement-modal',
  templateUrl: './disbursement-modal.component.html',
  styleUrls: ['./disbursement-modal.component.scss']
})
export class DisbursementModalComponent implements OnInit {
  @Input()
  id: number;
  @Input() displayHistory: boolean;
  @Input() fromScc: boolean;
  cadData: CustomerApprovedLoanCadDocumentation;
  spinner = false;

  constructor(private service: CreditAdministrationService, public ngbModalService: NgbActiveModal) {
  }

  ngOnInit() {
    this.spinner = true;
    this.service.detail(this.id).subscribe((res: any) => {
      this.cadData = res.detail;
      this.spinner = false;
    });
  }

}

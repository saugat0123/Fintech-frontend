import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-vehicle-delivery-purchase-order-letter-print',
  templateUrl: './vehicle-delivery-purchase-order-letter-print.component.html',
  styleUrls: ['./vehicle-delivery-purchase-order-letter-print.component.scss']
})
export class VehicleDeliveryPurchaseOrderLetterPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() isIndividual;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}

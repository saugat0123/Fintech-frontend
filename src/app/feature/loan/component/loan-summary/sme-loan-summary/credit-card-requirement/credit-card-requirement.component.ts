import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-credit-card-requirement",
  templateUrl: "./credit-card-requirement.component.html",
  styleUrls: ["./credit-card-requirement.component.scss"],
})
export class CreditCardRequirementComponent implements OnInit {
  isCreditCardRequired;
  @Input() isRetailDetailView: boolean;

  constructor() {}

  ngOnInit() {}
}

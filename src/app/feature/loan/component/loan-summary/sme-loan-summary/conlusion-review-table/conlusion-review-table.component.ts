import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-conlusion-review-table",
  templateUrl: "./conlusion-review-table.component.html",
  styleUrls: ["./conlusion-review-table.component.scss"],
})
export class ConlusionReviewTableComponent implements OnInit {
  @Input()
  isUsedForAboveTenMillion: boolean;
  constructor() {}

  ngOnInit() {}
}

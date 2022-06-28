import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-release-info",
  templateUrl: "./release-info.component.html",
  styleUrls: ["./release-info.component.scss"],
})
export class ReleaseInfoComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onUpdateNewChanges() {
    window.location.reload();
    this.activeModal.close();
  }
}

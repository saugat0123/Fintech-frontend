import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-release-info",
  templateUrl: "./release-info.component.html",
  styleUrls: ["./release-info.component.scss"],
})
export class ReleaseInfoComponent implements OnInit {
  @Output() emitService = new EventEmitter<any>();
  remind = false;
  time = 5;
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onUpdateNewChanges() {
    window.location.reload();
    this.activeModal.close();
    this.emitService.emit(false);
  }

  reminder() {
    this.remind = true;
    const interval = setInterval(() => {
      this.time--;
      if (this.time === 0) {
        clearInterval(interval);
        this.emitService.emit(true);
        this.activeModal.close();
      }
    }, 1000);
  }
}

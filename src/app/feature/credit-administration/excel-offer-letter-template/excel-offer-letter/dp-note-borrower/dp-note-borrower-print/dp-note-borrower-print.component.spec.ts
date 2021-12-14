import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DpNoteBorrowerPrintComponent } from './dp-note-borrower-print.component';

describe('DpNoteBorrowerPrintComponent', () => {
  let component: DpNoteBorrowerPrintComponent;
  let fixture: ComponentFixture<DpNoteBorrowerPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DpNoteBorrowerPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpNoteBorrowerPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementModalComponent } from './disbursement-modal.component';

describe('DisbursementModalComponent', () => {
  let component: DisbursementModalComponent;
  let fixture: ComponentFixture<DisbursementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

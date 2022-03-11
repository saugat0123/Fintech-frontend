import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveModeOfDisbursementComponent } from './above-mode-of-disbursement.component';

describe('AboveModeOfDisbursementComponent', () => {
  let component: AboveModeOfDisbursementComponent;
  let fixture: ComponentFixture<AboveModeOfDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveModeOfDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveModeOfDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeesCommissionComponent } from './fees-commission.component';

describe('FeesCommissionComponent', () => {
  let component: FeesCommissionComponent;
  let fixture: ComponentFixture<FeesCommissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

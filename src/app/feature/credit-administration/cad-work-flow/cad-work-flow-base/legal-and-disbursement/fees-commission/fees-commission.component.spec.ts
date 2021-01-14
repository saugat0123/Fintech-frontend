import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCommissionComponent } from './fees-commission.component';

describe('FeesCommissionComponent', () => {
  let component: FeesCommissionComponent;
  let fixture: ComponentFixture<FeesCommissionComponent>;

  beforeEach(async(() => {
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

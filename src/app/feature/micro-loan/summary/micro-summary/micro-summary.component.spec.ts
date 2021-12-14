import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroSummaryComponent } from './micro-summary.component';

describe('MicroSummaryComponent', () => {
  let component: MicroSummaryComponent;
  let fixture: ComponentFixture<MicroSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

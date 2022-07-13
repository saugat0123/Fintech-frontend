import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroSummaryComponent } from './micro-summary.component';

describe('MicroSummaryComponent', () => {
  let component: MicroSummaryComponent;
  let fixture: ComponentFixture<MicroSummaryComponent>;

  beforeEach(async(() => {
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

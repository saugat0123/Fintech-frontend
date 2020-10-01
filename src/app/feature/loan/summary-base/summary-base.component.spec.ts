import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryBaseComponent } from './summary-base.component';

describe('SummaryBaseComponent', () => {
  let component: SummaryBaseComponent;
  let fixture: ComponentFixture<SummaryBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

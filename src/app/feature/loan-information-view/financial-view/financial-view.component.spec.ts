import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialViewComponent } from './financial-view.component';

describe('FinancialViewComponent', () => {
  let component: FinancialViewComponent;
  let fixture: ComponentFixture<FinancialViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

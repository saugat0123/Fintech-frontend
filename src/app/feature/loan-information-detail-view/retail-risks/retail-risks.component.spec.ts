import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailRisksComponent } from './retail-risks.component';

describe('RetailRisksComponent', () => {
  let component: RetailRisksComponent;
  let fixture: ComponentFixture<RetailRisksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailRisksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

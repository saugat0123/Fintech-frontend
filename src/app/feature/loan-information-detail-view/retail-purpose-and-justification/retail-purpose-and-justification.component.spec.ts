import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailPurposeAndJustificationComponent } from './retail-purpose-and-justification.component';

describe('RetailPurposeAndJustificationComponent', () => {
  let component: RetailPurposeAndJustificationComponent;
  let fixture: ComponentFixture<RetailPurposeAndJustificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailPurposeAndJustificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailPurposeAndJustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

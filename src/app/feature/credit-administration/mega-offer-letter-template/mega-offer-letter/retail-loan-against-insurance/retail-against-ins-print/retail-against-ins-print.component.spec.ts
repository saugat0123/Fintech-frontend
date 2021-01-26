import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailAgainstInsPrintComponent } from './retail-against-ins-print.component';

describe('RetailAgainstInsPrintComponent', () => {
  let component: RetailAgainstInsPrintComponent;
  let fixture: ComponentFixture<RetailAgainstInsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailAgainstInsPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailAgainstInsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

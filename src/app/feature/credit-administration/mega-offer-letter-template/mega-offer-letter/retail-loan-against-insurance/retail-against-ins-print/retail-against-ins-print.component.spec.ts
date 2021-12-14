import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailAgainstInsPrintComponent } from './retail-against-ins-print.component';

describe('RetailAgainstInsPrintComponent', () => {
  let component: RetailAgainstInsPrintComponent;
  let fixture: ComponentFixture<RetailAgainstInsPrintComponent>;

  beforeEach(waitForAsync(() => {
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

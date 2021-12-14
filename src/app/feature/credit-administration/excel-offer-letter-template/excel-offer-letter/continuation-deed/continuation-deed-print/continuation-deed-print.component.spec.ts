import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContinuationDeedPrintComponent } from './continuation-deed-print.component';

describe('ContinuationDeedPrintComponent', () => {
  let component: ContinuationDeedPrintComponent;
  let fixture: ComponentFixture<ContinuationDeedPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinuationDeedPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinuationDeedPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

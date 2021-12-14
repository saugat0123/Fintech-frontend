import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {IndemnityDeedPrintComponent} from './indemnity-deed-print.component';

describe('IndemnityDeedPrintComponent', () => {
  let component: IndemnityDeedPrintComponent;
  let fixture: ComponentFixture<IndemnityDeedPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IndemnityDeedPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndemnityDeedPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

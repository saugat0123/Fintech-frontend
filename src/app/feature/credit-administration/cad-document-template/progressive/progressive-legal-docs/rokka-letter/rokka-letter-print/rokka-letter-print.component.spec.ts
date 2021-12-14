import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RokkaLetterPrintComponent } from './rokka-letter-print.component';

describe('RokkaLetterPrintComponent', () => {
  let component: RokkaLetterPrintComponent;
  let fixture: ComponentFixture<RokkaLetterPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RokkaLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RokkaLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

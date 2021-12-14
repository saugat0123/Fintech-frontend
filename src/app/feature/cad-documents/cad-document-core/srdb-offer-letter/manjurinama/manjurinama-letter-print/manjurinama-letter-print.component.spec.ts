import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManjurinamaLetterPrintComponent } from './manjurinama-letter-print.component';

describe('ManjurinamaLetterPrintComponent', () => {
  let component: ManjurinamaLetterPrintComponent;
  let fixture: ComponentFixture<ManjurinamaLetterPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

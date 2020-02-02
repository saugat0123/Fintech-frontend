import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaLetterPrintComponent } from './manjurinama-letter-print.component';

describe('ManjurinamaLetterPrintComponent', () => {
  let component: ManjurinamaLetterPrintComponent;
  let fixture: ComponentFixture<ManjurinamaLetterPrintComponent>;

  beforeEach(async(() => {
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

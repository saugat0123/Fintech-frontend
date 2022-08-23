import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfSetOffProprietorshipComponent } from './letter-of-set-off-proprietorship.component';

describe('LetterOfSetOffProprietorshipComponent', () => {
  let component: LetterOfSetOffProprietorshipComponent;
  let fixture: ComponentFixture<LetterOfSetOffProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfSetOffProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfSetOffProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

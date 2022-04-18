import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfHypothecationProprietorshipComponent } from './letter-of-hypothecation-proprietorship.component';

describe('LetterOfHypothecationProprietorshipComponent', () => {
  let component: LetterOfHypothecationProprietorshipComponent;
  let fixture: ComponentFixture<LetterOfHypothecationProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfHypothecationProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfHypothecationProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

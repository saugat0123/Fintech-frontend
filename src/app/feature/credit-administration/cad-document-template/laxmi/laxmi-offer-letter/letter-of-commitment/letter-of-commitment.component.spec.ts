import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfCommitmentComponent } from './letter-of-commitment.component';

describe('LetterOfCommitmentComponent', () => {
  let component: LetterOfCommitmentComponent;
  let fixture: ComponentFixture<LetterOfCommitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfCommitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

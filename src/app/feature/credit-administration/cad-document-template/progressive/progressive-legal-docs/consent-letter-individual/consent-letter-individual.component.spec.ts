import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsentLetterIndividualComponent } from './consent-letter-individual.component';

describe('ConsentLetterIndividualComponent', () => {
  let component: ConsentLetterIndividualComponent;
  let fixture: ComponentFixture<ConsentLetterIndividualComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityCompanyComponent } from './letter-of-continuity-company.component';

describe('LetterOfContinuityCompanyComponent', () => {
  let component: LetterOfContinuityCompanyComponent;
  let fixture: ComponentFixture<LetterOfContinuityCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

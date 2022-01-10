import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfHypothecationCompanyComponent } from './letter-of-hypothecation-company.component';

describe('LetterOfHypothecationCompanyComponent', () => {
  let component: LetterOfHypothecationCompanyComponent;
  let fixture: ComponentFixture<LetterOfHypothecationCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfHypothecationCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfHypothecationCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

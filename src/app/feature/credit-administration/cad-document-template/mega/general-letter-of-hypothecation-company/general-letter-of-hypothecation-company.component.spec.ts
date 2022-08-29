import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfHypothecationCompanyComponent } from './general-letter-of-hypothecation-company.component';

describe('GeneralLetterOfHypothecationCompanyComponent', () => {
  let component: GeneralLetterOfHypothecationCompanyComponent;
  let fixture: ComponentFixture<GeneralLetterOfHypothecationCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfHypothecationCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfHypothecationCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

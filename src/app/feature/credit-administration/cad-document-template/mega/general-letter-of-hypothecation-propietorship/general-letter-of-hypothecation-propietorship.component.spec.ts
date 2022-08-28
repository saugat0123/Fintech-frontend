import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfHypothecationPropietorshipComponent } from './general-letter-of-hypothecation-propietorship.component';

describe('GeneralLetterOfHypothecationPropietorshipComponent', () => {
  let component: GeneralLetterOfHypothecationPropietorshipComponent;
  let fixture: ComponentFixture<GeneralLetterOfHypothecationPropietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfHypothecationPropietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfHypothecationPropietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalGuaranteePersonalBothComponent } from './personal-guarantee-personal-both.component';

describe('PersonalGuaranteePersonalBothComponent', () => {
  let component: PersonalGuaranteePersonalBothComponent;
  let fixture: ComponentFixture<PersonalGuaranteePersonalBothComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePersonalBothComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePersonalBothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

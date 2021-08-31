import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteePrintComponent } from './personal-guarantee-print.component';

describe('PersonalGuaranteePrintComponent', () => {
  let component: PersonalGuaranteePrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

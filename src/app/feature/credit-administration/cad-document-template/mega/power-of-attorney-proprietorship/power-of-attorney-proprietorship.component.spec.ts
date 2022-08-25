import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerOfAttorneyProprietorshipComponent } from './power-of-attorney-proprietorship.component';

describe('PowerOfAttorneyProprietorshipComponent', () => {
  let component: PowerOfAttorneyProprietorshipComponent;
  let fixture: ComponentFixture<PowerOfAttorneyProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerOfAttorneyProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerOfAttorneyProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

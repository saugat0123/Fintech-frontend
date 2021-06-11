import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentSecurityComponent } from './apartment-security.component';

describe('ApartmentSecurityComponent', () => {
  let component: ApartmentSecurityComponent;
  let fixture: ComponentFixture<ApartmentSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMunicipalityComponent } from './add-municipality.component';

describe('AddMunicipalityComponent', () => {
  let component: AddMunicipalityComponent;
  let fixture: ComponentFixture<AddMunicipalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMunicipalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMunicipalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

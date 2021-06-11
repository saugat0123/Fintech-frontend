import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAndMachinerySecurityComponent } from './plant-and-machinery-security.component';

describe('PlantAndMachinerySecurityComponent', () => {
  let component: PlantAndMachinerySecurityComponent;
  let fixture: ComponentFixture<PlantAndMachinerySecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantAndMachinerySecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantAndMachinerySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

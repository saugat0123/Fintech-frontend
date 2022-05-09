import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMachineryAdderComponent } from './plant-machinery-adder.component';

describe('PlantMachineryAdderComponent', () => {
  let component: PlantMachineryAdderComponent;
  let fixture: ComponentFixture<PlantMachineryAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantMachineryAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMachineryAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

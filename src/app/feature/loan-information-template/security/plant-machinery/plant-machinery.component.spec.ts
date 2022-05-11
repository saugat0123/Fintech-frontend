import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMachineryComponent } from './plant-machinery.component';

describe('PlantMachineryComponent', () => {
  let component: PlantMachineryComponent;
  let fixture: ComponentFixture<PlantMachineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantMachineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

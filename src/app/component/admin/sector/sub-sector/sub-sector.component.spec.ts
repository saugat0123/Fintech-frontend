import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectorComponent } from './sub-sector.component';

describe('SubSectorComponent', () => {
  let component: SubSectorComponent;
  let fixture: ComponentFixture<SubSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

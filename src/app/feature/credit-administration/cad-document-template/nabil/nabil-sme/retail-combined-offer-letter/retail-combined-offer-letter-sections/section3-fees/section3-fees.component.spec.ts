import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section3FeesComponent } from './section3-fees.component';

describe('Section3FeesComponent', () => {
  let component: Section3FeesComponent;
  let fixture: ComponentFixture<Section3FeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section3FeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section3FeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

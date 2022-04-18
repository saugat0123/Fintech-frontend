import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section16AndSection17Component } from './section16-and-section17.component';

describe('Section16AndSection17Component', () => {
  let component: Section16AndSection17Component;
  let fixture: ComponentFixture<Section16AndSection17Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section16AndSection17Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section16AndSection17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section19ToSection22Component } from './section19-to-section22.component';

describe('Section19ToSection22Component', () => {
  let component: Section19ToSection22Component;
  let fixture: ComponentFixture<Section19ToSection22Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section19ToSection22Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section19ToSection22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

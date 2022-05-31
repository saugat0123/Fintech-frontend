import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section9OtherClauseComponent } from './section9-other-clause.component';

describe('Section9OtherClauseComponent', () => {
  let component: Section9OtherClauseComponent;
  let fixture: ComponentFixture<Section9OtherClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section9OtherClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section9OtherClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

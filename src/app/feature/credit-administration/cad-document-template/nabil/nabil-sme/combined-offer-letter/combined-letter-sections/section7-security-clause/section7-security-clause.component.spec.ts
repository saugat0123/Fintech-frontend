import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section7SecurityClauseComponent } from './section7-security-clause.component';

describe('Section7SecurityClauseComponent', () => {
  let component: Section7SecurityClauseComponent;
  let fixture: ComponentFixture<Section7SecurityClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section7SecurityClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section7SecurityClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

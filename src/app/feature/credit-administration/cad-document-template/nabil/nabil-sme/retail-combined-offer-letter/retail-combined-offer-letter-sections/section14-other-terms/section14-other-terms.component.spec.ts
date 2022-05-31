import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section14OtherTermsComponent } from './section14-other-terms.component';

describe('Section14OtherTermsComponent', () => {
  let component: Section14OtherTermsComponent;
  let fixture: ComponentFixture<Section14OtherTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section14OtherTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section14OtherTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveBusinessRelatedInformationComponent } from './above-business-related-information.component';

describe('AboveBusinessRelatedInformationComponent', () => {
  let component: AboveBusinessRelatedInformationComponent;
  let fixture: ComponentFixture<AboveBusinessRelatedInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveBusinessRelatedInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveBusinessRelatedInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

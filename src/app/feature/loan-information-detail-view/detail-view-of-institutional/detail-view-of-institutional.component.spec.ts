import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewOfInstitutionalComponent } from './detail-view-of-institutional.component';

describe('DetailViewOfInstitutionalComponent', () => {
  let component: DetailViewOfInstitutionalComponent;
  let fixture: ComponentFixture<DetailViewOfInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailViewOfInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewOfInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

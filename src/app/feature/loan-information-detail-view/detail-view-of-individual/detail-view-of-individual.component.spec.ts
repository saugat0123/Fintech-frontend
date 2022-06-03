import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewOfIndividualComponent } from './detail-view-of-individual.component';

describe('DetailViewOfIndividualComponent', () => {
  let component: DetailViewOfIndividualComponent;
  let fixture: ComponentFixture<DetailViewOfIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailViewOfIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewOfIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

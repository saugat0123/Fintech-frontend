import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryAggrementProprietorshipComponent } from './supplementary-aggrement-proprietorship.component';

describe('SupplementaryAggrementProprietorshipComponent', () => {
  let component: SupplementaryAggrementProprietorshipComponent;
  let fixture: ComponentFixture<SupplementaryAggrementProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplementaryAggrementProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplementaryAggrementProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoBankingRelationshipComponent } from './upto-banking-relationship.component';

describe('UptoBankingRelationshipComponent', () => {
  let component: UptoBankingRelationshipComponent;
  let fixture: ComponentFixture<UptoBankingRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoBankingRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoBankingRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

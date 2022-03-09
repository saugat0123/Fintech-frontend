import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingRelationshipComponent } from './banking-relationship.component';

describe('BankingRelationshipComponent', () => {
  let component: BankingRelationshipComponent;
  let fixture: ComponentFixture<BankingRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

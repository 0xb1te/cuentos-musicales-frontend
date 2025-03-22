import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorySummaryComponent } from './story-summary.component';

describe('StorySummaryComponent', () => {
  let component: StorySummaryComponent;
  let fixture: ComponentFixture<StorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

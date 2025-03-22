import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCreateComponent } from './story-create.component';

describe('StoryCreateComponent', () => {
  let component: StoryCreateComponent;
  let fixture: ComponentFixture<StoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ArrowRotationService } from '../../services/arrow-rotation.service';
import { Observable } from 'rxjs';
import { ToggleService } from '../../services/toggle.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
  providers: [ArrowRotationService],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isArrowRotated = false;

  @Output() arrowRotated = new EventEmitter<boolean>();

  constructor(private toggleService: ToggleService) {}

  toggleArrowRotation() {
    const newState = this.isArrowRotated = !this.isArrowRotated;
    this.arrowRotated.emit(newState);
  }

  togglePersonalDataVisibility(visible: boolean, resetTexts: boolean = false) {
    this.toggleService.setNameVisibility(visible);

    if (resetTexts) {
      this.toggleService.resetTexts();
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleService } from '../../services/toggle.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private toggleSubscription: Subscription;
  mbValue: string = 'auto';
  isEnableData: boolean = false;
  isNameVisible: boolean = true;

  constructor(private toggleService: ToggleService) {
    this.toggleSubscription = this.toggleService.nameVisible$.subscribe(visible => {
      this.isNameVisible = visible;
    });
  }

  ngOnDestroy() {
    this.toggleSubscription.unsubscribe();
  }
}

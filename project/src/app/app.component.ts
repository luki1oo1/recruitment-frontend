import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HeaderComponent, MainComponent, FooterComponent]
})
export class AppComponent {
  title = 'project';

  arrowRotationState!: boolean;

  onArrowRotated(newState: boolean) {
    this.arrowRotationState = newState;
  }
}

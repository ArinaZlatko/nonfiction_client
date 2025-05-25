import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TokenService } from './auth/token.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, NavbarComponent, FooterComponent],
})
export class AppComponent {
  constructor(private tokenService: TokenService) {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      this.tokenService.scheduleRefresh(token);
    }
  }
}

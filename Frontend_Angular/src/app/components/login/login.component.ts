import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Subscribe to auth service errors
    this.authService.errors$.subscribe(error => {
      this.error = error;
    });
  }

  /**
   * Initialize login form with validation
   */
  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  /**
   * Get form controls for easy access in template
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const loginObservable = this.authService.login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      );

      loginObservable.subscribe(
        (response) => {
          if (response.success) {
            this.authService.handleLoginSuccess(response);
            this.router.navigate(['/dashboard']);
          } else {
            this.error = response.message || 'Login failed';
            this.loading = false;
          }
        },
        (error) => {
          this.authService.handleLoginError(error);
          this.loading = false;
        }
      );
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  /**
   * Navigate to register page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

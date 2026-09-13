import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();

  private currentUser = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUser.asObservable();

  private errors = new BehaviorSubject<any>(null);
  public errors$ = this.errors.asObservable();

  constructor(private apiService: ApiService) {
    // Check if user is already logged in
    if (this.apiService.isAuthenticated()) {
      this.isLoggedIn.next(true);
      const user = this.apiService.getUserData();
      this.currentUser.next(user);
    }
  }

  // ==================== VALIDATION METHODS ====================

  /**
   * Validate email format
   */
  validateEmail(email: string): { valid: boolean; message?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { valid: false, message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
  }

  /**
   * Validate phone number (10 digits)
   */
  validatePhone(phone: string): { valid: boolean; message?: string } {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      return { valid: false, message: 'Phone number is required' };
    }
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: 'Phone number must be exactly 10 digits' };
    }
    return { valid: true };
  }

  /**
   * Validate password strength
   * Requirements:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character (@$!%*?&)
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/[@$!%*?&]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    }

    return { valid: true };
  }

  /**
   * Validate password match
   */
  validatePasswordMatch(password: string, confirmPassword: string): { valid: boolean; message?: string } {
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true };
  }

  /**
   * Validate username
   */
  validateUsername(username: string): { valid: boolean; message?: string } {
    if (!username) {
      return { valid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
      return { valid: false, message: 'Username must be at least 3 characters long' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true };
  }

  /**
   * Validate full name
   */
  validateFullName(fullName: string): { valid: boolean; message?: string } {
    if (!fullName) {
      return { valid: false, message: 'Full name is required' };
    }
    if (fullName.trim().length < 3) {
      return { valid: false, message: 'Full name must be at least 3 characters long' };
    }
    return { valid: true };
  }

  // ==================== REGISTRATION ====================

  /**
   * Register new user with validation
   */
  register(formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    full_name: string;
  }): Observable<any> {
    // Validate all fields
    const usernameValidation = this.validateUsername(formData.username);
    if (!usernameValidation.valid) {
      this.errors.next(usernameValidation.message);
      throw new Error(usernameValidation.message);
    }

    const emailValidation = this.validateEmail(formData.email);
    if (!emailValidation.valid) {
      this.errors.next(emailValidation.message);
      throw new Error(emailValidation.message);
    }

    const passwordValidation = this.validatePassword(formData.password);
    if (!passwordValidation.valid) {
      this.errors.next(passwordValidation.message);
      throw new Error(passwordValidation.message);
    }

    const passwordMatchValidation = this.validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!passwordMatchValidation.valid) {
      this.errors.next(passwordMatchValidation.message);
      throw new Error(passwordMatchValidation.message);
    }

    const phoneValidation = this.validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      this.errors.next(phoneValidation.message);
      throw new Error(phoneValidation.message);
    }

    const nameValidation = this.validateFullName(formData.full_name);
    if (!nameValidation.valid) {
      this.errors.next(nameValidation.message);
      throw new Error(nameValidation.message);
    }

    // Clear errors if all validations pass
    this.errors.next(null);

    return this.apiService.register(formData);
  }

  // ==================== LOGIN ====================

  /**
   * Login user with validation
   */
  login(email: string, password: string): Observable<any> {
    // Validate email
    const emailValidation = this.validateEmail(email);
    if (!emailValidation.valid) {
      this.errors.next(emailValidation.message);
      throw new Error(emailValidation.message);
    }

    // Validate password not empty
    if (!password) {
      this.errors.next('Password is required');
      throw new Error('Password is required');
    }

    // Clear errors if validations pass
    this.errors.next(null);

    return this.apiService.login(email, password);
  }

  /**
   * Handle successful login
   */
  handleLoginSuccess(response: any): void {
    if (response.success && response.data && response.data.token) {
      this.apiService.setAuthToken(response.data.token);
      this.apiService.setUserData(response.data.user);
      this.isLoggedIn.next(true);
      this.currentUser.next(response.data.user);
      this.errors.next(null);
    }
  }

  /**
   * Handle login error
   */
  handleLoginError(error: any): void {
    let errorMessage = 'Login failed';

    if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 404) {
      errorMessage = 'User not found';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    this.errors.next(errorMessage);
  }

  // ==================== LOGOUT ====================

  /**
   * Logout user
   */
  logout(): void {
    this.apiService.logout();
    this.isLoggedIn.next(false);
    this.currentUser.next(null);
    this.errors.next(null);
  }

  // ==================== GETTERS ====================

  /**
   * Get current logged-in user
   */
  getCurrentUser(): any {
    return this.currentUser.value;
  }

  /**
   * Get current error message
   */
  getCurrentError(): any {
    return this.errors.value;
  }

  /**
   * Check if user is logged in
   */
  isUserLoggedIn(): boolean {
    return this.isLoggedIn.value;
  }
}

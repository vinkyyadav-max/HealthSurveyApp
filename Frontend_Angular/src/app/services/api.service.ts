import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  private authToken = new BehaviorSubject<string | null>(null);
  public authToken$ = this.authToken.asObservable();

  constructor(private http: HttpClient) {
    // Load token from localStorage on initialization
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authToken.next(token);
    }
  }

  // Set authorization header
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register new user
   */
  register(data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    full_name: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, data);
  }

  /**
   * Login user
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, {
      email,
      password
    });
  }

  /**
   * Set auth token after successful login
   */
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authToken.next(token);
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.authToken.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Store user data
   */
  setUserData(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ==================== SURVEY ENDPOINTS ====================

  /**
   * Create new survey
   */
  createSurvey(surveyData: {
    name: string;
    gender: string;
    mobile_number: string;
    email?: string;
    address?: string;
    district_id: number;
    health_issue_id?: number;
    remarks?: string;
    family_members_count?: number;
    survey_date?: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/createSurvey.php`,
      surveyData,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get all surveys with filtering
   */
  getSurveys(params: {
    district_id?: number;
    health_issue_id?: number;
    from_date?: string;
    to_date?: string;
    page?: number;
  }): Observable<any> {
    let queryParams = '';
    if (params.district_id) queryParams += `&district_id=${params.district_id}`;
    if (params.health_issue_id) queryParams += `&health_issue_id=${params.health_issue_id}`;
    if (params.from_date) queryParams += `&from_date=${params.from_date}`;
    if (params.to_date) queryParams += `&to_date=${params.to_date}`;
    if (params.page) queryParams += `&page=${params.page}`;

    return this.http.get(
      `${this.apiUrl}/getSurveys.php?${queryParams}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update survey
   */
  updateSurvey(surveyData: {
    survey_id: number;
    name: string;
    gender: string;
    mobile_number: string;
    email?: string;
    address?: string;
    district_id: number;
    health_issue_id?: number;
    remarks?: string;
    family_members_count?: number;
  }): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/updateSurvey.php`,
      surveyData,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Delete survey (soft delete)
   */
  deleteSurvey(survey_id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/deleteSurvey.php`,
      {
        headers: this.getHeaders(),
        body: { survey_id }
      }
    );
  }
}

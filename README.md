# Health Survey Application

A comprehensive health survey management system built with PHP backend and modern frontend technologies.

## Project Overview

The Health Survey Application is designed to manage health surveys, track patient information, and maintain health records across different districts. It provides role-based access control and comprehensive CRUD operations for survey management.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access Control**: Admin, Doctor, Staff, and Viewer roles
- **Survey Management**: Create, read, update, and delete surveys
- **District Management**: Organize surveys by districts
- **Health Issues Tracking**: Track various health issues and conditions
- **Follow-up Management**: Schedule and track survey follow-ups
- **Activity Logging**: Monitor all user activities
- **Pagination**: Efficient data retrieval with pagination
- **Advanced Filtering**: Filter surveys by district, health issue, and date range

## Project Structure

```
HealthSurveyApp/
├── Database/
│   └── schema.sql                 # MySQL database schema
├── Backend_PHP/
│   ├── config/
│   │   └── database.php          # Database configuration and helper functions
│   └── api/
│       ├── register.php          # User registration endpoint
│       ├── login.php             # User login endpoint
│       ├── createSurvey.php      # Create new survey
│       ├── getSurveys.php        # Get surveys with filtering
│       ├── updateSurvey.php      # Update survey information
│       └── deleteSurvey.php      # Delete survey (soft delete)
└── README.md                      # This file
```

## Technologies Used

- **Backend**: PHP 7.0+
- **Database**: MySQL 5.7+
- **API**: RESTful API
- **Security**: Password hashing with bcrypt

## Database Schema

### Tables

1. **users** - User account management
2. **districts** - District information
3. **health_issues** - Health issue master data
4. **surveys** - Survey records
5. **followups** - Follow-up tracking

## API Endpoints

### Authentication
- `POST /api/register.php` - User registration
- `POST /api/login.php` - User login

### Survey Management
- `POST /api/createSurvey.php` - Create new survey
- `GET /api/getSurveys.php` - Get all surveys with filtering
- `PUT /api/updateSurvey.php` - Update survey details
- `DELETE /api/deleteSurvey.php` - Delete survey

## Installation

### Prerequisites
- PHP 7.0 or higher
- MySQL 5.7 or higher
- Apache or Nginx web server

### Setup Steps

1. **Create Database**
```bash
mysql -u root -p < Database/schema.sql
```

2. **Configure Database Connection**
Edit `Backend_PHP/config/database.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', 'your_password');
define('DB_NAME', 'health_survey_db');
```

3. **Place Files on Web Server**
Copy the `Backend_PHP` folder to your web server's document root.

4. **Start Web Server**
```bash
php -S localhost:8000
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass@123",
    "phone": "9876543210",
    "full_name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Create Survey
```bash
curl -X POST http://localhost:8000/api/createSurvey.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "gender": "Male",
    "mobile_number": "9876543210",
    "email": "rajesh@example.com",
    "district_id": 1,
    "health_issue_id": 1,
    "created_by": 1
  }'
```

### Get Surveys
```bash
curl http://localhost:8000/api/getSurveys.php?district_id=1&page=1
```

### Update Survey
```bash
curl -X PUT http://localhost:8000/api/updateSurvey.php \
  -H "Content-Type: application/json" \
  -d '{
    "survey_id": 1,
    "name": "Updated Name",
    "gender": "Male",
    "mobile_number": "9876543210",
    "district_id": 1
  }'
```

### Delete Survey
```bash
curl -X DELETE http://localhost:8000/api/deleteSurvey.php \
  -H "Content-Type: application/json" \
  -d '{
    "survey_id": 1
  }'
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Phone Number
- Must be exactly 10 digits

### Email
- Must be valid email format

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Considerations

- Passwords are hashed using bcrypt
- SQL injection prevention with real_escape_string
- CORS headers configured for cross-origin requests
- Input validation for all endpoints
- Soft delete for surveys (data preservation)

## Future Enhancements

- JWT token authentication
- Advanced filtering and reporting
- Email notifications
- File uploads for survey documents
- Mobile application
- Real-time analytics dashboard
- Multi-language support

## Support

For issues or questions, please create an issue in the repository.

## License

This project is open-source and available under the MIT License.

## Contributors

- Vinky Yadav

---

Last Updated: 2026-09-13

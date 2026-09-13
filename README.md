# Health Survey Application 🏥

A complete Android application for conducting health surveys with role-based access control, Firebase backend, PHP-MySQL server, and comprehensive reporting features.

## Features ✨

### 1. **Authentication System**
- User Registration (Sign Up)
- User Login with role-based access
- Forgot Password functionality
- Email & Phone validation
- Strong password requirements

### 2. **Dashboard**
- Two main sections:
  - **Create Survey** - Add new health surveys
  - **Create Master** - Manage users and roles

### 3. **Survey Form**
- Auto-filled survey date
- Personal Details:
  - Name, Gender, Mobile, Email, Address
  - District (Dropdown)
- Health Issues (Dropdown):
  - BP (Blood Pressure)
  - Asthma
  - Diabetes (Sugar)
  - Arthritis
  - Other conditions
- Remarks field
- Family Members count
- Real-time database sync

### 4. **Role Management**
- Admin - Full access
- Doctor - View, Insert, Edit, Delete
- Staff - View, Insert, Edit
- Viewer - View only

### 5. **User Profile**
- Change Password
- Upload/Change Profile Picture
- Edit Profile Details

### 6. **Follow-up System**
- Track survey follow-ups
- View follow-up history
- Reminder notifications

### 7. **Reports & Downloads**
- View all surveys
- Filter by date, district, health issues
- Export to Excel
- Export to PDF
- Download reports locally

## Tech Stack 🛠️

- **Frontend:** Android (Java)
- **Backend:** PHP 7.4+
- **Database:** MySQL 5.7+
- **Cloud:** Firebase
- **API Communication:** Retrofit
- **Reports:** Apache POI, iText

## Quick Start

1. Clone the repository
2. Follow setup guide in Documentation folder
3. Configure Firebase & PHP Backend
4. Build and run Android app

## Support & Documentation

Check the `Documentation/` folder for detailed setup guides and API documentation.

## License

MIT License

## Author

Vinky Yadav (@vinkyyadav-max)

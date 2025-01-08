# Diaspora Mapping System

The **Diaspora Mapping System** is a web application designed to connect diaspora communities, facilitate investment participation, and provide geographic visualization of diaspora members worldwide. This project offers user authentication, profile management, address tracking, investment features, and admin reporting capabilities.

## Features

### 1. User Authentication

- **Sign Up/Log In**: Users can create accounts or log in securely.
- **Role-Based Access**: Different permissions for members and admins.

### 2. Personal and Family Information Management

- **Profile Management**: Users can add and update personal details, including name, date of birth, and nationality.
- **Family Information**: Users can store family details, such as names, relationships, and contact information.

### 3. Address Management

- **Add/Edit Addresses**: Users can input and manage their current and permanent addresses.
- **Geographic Mapping**: Users’ locations are displayed on a global map.

### 4. Investment Participation

- **Browse Projects**: Diaspora members can view available investment opportunities.
- **Join Projects**: Users can sign up for projects, provide investment details, and upload proof of investment.
- **Track Investments**: Users can monitor the status of their investments.

### 5. Investment Project Management (Admin)

- **Project Creation**: Admins can add new investment projects and update progress.
- **Monitor Participation**: Admins can track users involved in specific projects.

### 6. Reporting and Dashboards

- **Admin Dashboard**: Displays statistics on users, investments, and project performance.

### 7. Geographic Mapping

- **Map Diaspora Locations**: Visualize user locations on a global map.

## Technologies Used

### Frontend

- **React.js**: For building the user interface.
- **Tailwind CSS**: For responsive and modern styling.

### Backend

- **Node.js**: For server-side scripting.
- **Express.js**: For handling API requests and routing.
- **JWT (JSON Web Tokens)**: For secure authentication.

### Database

- **MongoDB**: For storing user profiles, family information, addresses, and investment data.

### Additional Tools

- **Mapbox/Google Maps API**: For geographic mapping.
- **Chart.js**: For generating reports and visualizations.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/diaspora-mapping-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd diaspora-mapping-system
   ```

3. Install dependencies for both frontend and backend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Configure environment variables:

   - Create a `.env` file in the backend directory with the following:
     ```env
     MONGO_URI=your-mongodb-uri
     JWT_SECRET=your-secret-key
     ```

5. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

6. Start the frontend server:

   ```bash
   cd frontend
   npm start
   ```

7. Access the application at `http://localhost:5173`.

## Usage

### User Side

- Sign up or log in to the system.
- Update your profile and add family information.
- Add current and permanent addresses.
- View available investment projects and participate.
- Track your investments.

### Admin Side

- Log in with admin credentials.
- Create and manage investment projects.
- Monitor user participation.
- Access the admin dashboard for reports and statistics.


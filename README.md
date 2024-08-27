# Crowdfund Application

This is a React-based frontend application for a crowdfunding platform where innovators can create projects and donors can contribute to them.

## Features

- **Innovator Dashboard:** Create and manage projects.
- **Donor Dashboard:** Browse and contribute to active projects.
- **Authentication:** Secure login and registration.
- **Responsive Design:** User-friendly interface across devices.

## Tech Stack

- **React:** Frontend framework for building user interfaces.
- **Bootstrap:** CSS framework for responsive design.
- **Axios:** HTTP client for API requests.
- **React Router:** For routing and navigation.
- **Redux:** (Optional) State management for large-scale applications.

## Installation

1. **Clone the repository:**

   `git clone https://github.com/your-username/crowdfund-frontend.git`
   
   `cd crowdfund-frontend`

2. **Install dependencies:**

   `npm install`

3. **Start the development server:**

   `npm start`

## Deployment

The application can be deployed to AWS S3 for static hosting. Use the following command to sync the build folder with your S3 bucket:

`aws s3 sync build/ s3://your-s3-bucket-name --delete`

## API Integration

- The application connects to a Spring Boot backend for handling requests.
- Ensure the backend API is running and accessible.

## Environment Variables

- Create a `.env` file in the root directory.
- Set the API base URL:

   `REACT_APP_API_URL=http://your-backend-api-url`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
# Book Review Application Frontend

This is the frontend part of the Book Review Application, built with React, TypeScript, and Material-UI.

## Features

- User Authentication (Register, Login, Logout)
- Book Management (Browse, Search, Filter)
- Review System (Rate and Review Books)
- User Profiles (View Past Reviews)
- Admin Dashboard (Manage Books and Users)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review/frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── App.tsx        # Main application component
  ├── index.tsx      # Application entry point
  └── reportWebVitals.ts  # Performance monitoring
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Dependencies

- React 18
- TypeScript
- Material-UI
- React Router
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
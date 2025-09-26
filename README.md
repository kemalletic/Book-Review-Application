# Book Review Application

A full-stack application for reviewing and discovering books.

## Deployment Guide (GitHub Education Pack)

### Prerequisites
1. GitHub Student Developer Pack (https://education.github.com/pack)
2. GitHub repository for your project
3. GitHub Codespaces access (included in GitHub Education Pack)

### Backend Deployment (GitHub Codespaces)

1. Enable GitHub Codespaces in your repository
2. Create a new Codespace:
   - Go to your repository
   - Click "Code" > "Codespaces" > "Create codespace on main"
3. In the Codespace terminal:
   ```bash
   cd backend
   mvn clean package
   ```
4. Set up environment variables in GitHub repository:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     ```
     DATABASE_URL
     DATABASE_USERNAME
     DATABASE_PASSWORD
     JWT_SECRET
     ```

### Frontend Deployment (GitHub Pages)

1. Enable GitHub Pages in your repository:
   - Go to Settings > Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
2. Set up environment variables:
   - Go to Settings > Secrets and variables > Actions
   - Add `REACT_APP_API_URL` secret with your backend URL
3. Deploy the frontend:
   ```bash
   cd frontend
   npm run deploy
   ```

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. Backend workflow (`.github/workflows/backend.yml`):
   - Builds the Spring Boot application
   - Runs tests
   - Creates deployment artifacts

2. Frontend workflow (`.github/workflows/frontend.yml`):
   - Builds the React application
   - Deploys to GitHub Pages

### Environment Variables

#### Backend
- `DATABASE_URL`: PostgreSQL connection URL
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 8080)
- `CORS_ORIGINS`: Allowed CORS origins

#### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Development Setup

1. Clone the repository
2. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb bookreview
   ```
3. Configure environment variables
4. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
5. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Testing

Run backend tests:
```bash
cd backend
mvn test
```

Run frontend tests:
```bash
cd frontend
npm test
``` 
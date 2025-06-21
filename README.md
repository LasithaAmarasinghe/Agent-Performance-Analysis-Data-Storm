# Agent Performance Analysis

A full-stack web application for analyzing and predicting insurance agent performance using machine learning.

## Features

- Real-time agent performance predictions
- Interactive data visualizations
- Performance distribution analysis
- Modern, responsive UI built with Material-UI
- RESTful API backend with FastAPI

## Tech Stack

### Frontend
- React 19
- Material-UI (MUI) v7
- Chart.js for data visualization
- React Router for navigation
- Axios for API communication

### Backend
- Python
- FastAPI
- Pandas
- Scikit-learn
- NumPy

## Prerequisites

- Node.js (v14 or later)
- Python 3.7+
- npm or yarn
- pip

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Set up the frontend:
```bash
cd frontend
npm install
```

3. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```
The backend will be available at http://127.0.0.1:8000

2. Start the frontend development server:
```bash
cd frontend
npm start
```
The frontend will be available at http://localhost:3000

## Project Structure

```
.
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   │   └── theme.js     # Material-UI theme configuration
│   └── package.json     # Frontend dependencies
│
└── backend/              # Python backend application
    ├── main.py          # FastAPI application entry point
    └── train.py         # Machine learning model training
```

## Available Scripts

In the frontend directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Acknowledgments

- Create React App for the frontend boilerplate
- Material-UI for the component library
- FastAPI for the backend framework
- Chart.js for data visualization 

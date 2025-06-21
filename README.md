# Agent Performance Analysis

A full-stack web application for analyzing and predicting insurance agent performance using machine learning algorithms and interactive data visualizations.

## Methodology

1. **Data Preprocessing:**  
   - Selected relevant performance features such as new policy count, net income, conversion rates, and others.
   - Normalized the data to ensure uniformity and scalability, preparing it for machine learning models.

2. **K-means Clustering:**  
   - Applied K-means clustering to categorize agents into performance levels (High, Medium, Low) based on their individual performance metrics.

3. **PCA (Principal Component Analysis) Analysis:**  
   - Performed PCA to reduce the dimensionality of the dataset, improving computational efficiency.
   - Identified key performance indicators (KPIs) that contributed the most to clustering, facilitating better decision-making.

4. **Cluster Ranking:**  
   - Calculated composite scores for each cluster by assigning weighted importance to key performance features.
   - Ranked the agents by their performance level (High, Medium, Low) based on the cluster scores.

## Features

- **Real-time Agent Performance Predictions:**  
   Predict the performance level of agents based on the latest data.

- **Interactive Data Visualizations:**  
   Dynamic and interactive charts displaying agent performance trends, conversion rates, and other key metrics.

- **Performance Distribution Analysis:**  
   Visualize and analyze the distribution of agents across different performance levels (High, Medium, Low).

- **Modern, Responsive UI:**  
   A sleek and user-friendly interface built using Material-UI, designed for both desktop and mobile devices.

- **RESTful API Backend:**  
   A Python-based backend using FastAPI to handle requests and serve predictions.

## 🎥 Demo

Here’s a quick demo of the **Agent Performance Analysis Dashboard**:

[![▶️ Watch the demo](https://github.com/user-attachments/assets/34283af6-2ade-48b5-a2c0-504957d5de3a)](https://vimeo.com/1095185875/1dcc9a8790?share=copy)

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

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from collections import Counter
import uvicorn

# Load data
df = pd.read_csv('database.csv')
df = df.drop_duplicates(subset='agent_code', keep='first')
data_by_id = df.set_index('agent_code').to_dict(orient='index')

app = FastAPI()

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/performance/{agent_id}")
def get_performance(agent_id: str):
    if agent_id in data_by_id:
        return {
            "agent_code": agent_id,
            "prediction": data_by_id[agent_id]['prediction'],
            "performance_level": data_by_id[agent_id]['performance_level'],
            "recommendations": eval(data_by_id[agent_id]['recommendations'])
        }
    raise HTTPException(status_code=404, detail="Agent not found")

@app.get("/performance-distribution")
def get_performance_distribution():
    if 'performance_level' not in df.columns:
        raise HTTPException(status_code=400, detail="Performance level data is missing")

    # Get the distribution of performance levels
    performance_counts = Counter(df['performance_level'])
    return {"performance_distribution": dict(performance_counts)}

@app.get("/prediction-distribution")
def get_prediction_distribution():
    if 'prediction' not in df.columns:
        raise HTTPException(status_code=400, detail="Prediction data is missing")
    
    # Get the distribution of predictions (1 or 0)
    prediction_counts = Counter(df['prediction'])
    return {"prediction_distribution": dict(prediction_counts)}


# Entry point
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

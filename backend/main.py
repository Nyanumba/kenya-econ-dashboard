from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
import models
from worldbank import get_indicator_data, INDICATORS
from schemas import IndicatorResponse, DashboardSummary

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kenya Economic Dashboard API",
    description="Fetches and serves Kenya economic indicators from the World Bank API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Kenya Economic Dashboard API", "status": "running"}


@app.get("/api/indicators", summary="List available indicators")
def list_indicators():
    return [
        {"code": code, "name": meta["name"], "unit": meta["unit"]}
        for code, meta in INDICATORS.items()
    ]


@app.get("/api/indicators/{indicator_code}", response_model=IndicatorResponse)
def get_indicator(
    indicator_code: str,
    start_year: int = Query(default=2000, ge=1960, le=2024),
    end_year: int = Query(default=2023, ge=1960, le=2024),
    db: Session = Depends(get_db),
):
    if indicator_code not in INDICATORS:
        raise HTTPException(
            status_code=404,
            detail=f"Indicator '{indicator_code}' not found. Use /api/indicators to see available codes.",
        )
    if start_year > end_year:
        raise HTTPException(status_code=400, detail="start_year must be <= end_year")

    try:
        data = get_indicator_data(db, indicator_code, start_year, end_year)
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"World Bank API error: {str(e)}")


@app.get("/api/dashboard", response_model=DashboardSummary)
def get_dashboard(
    start_year: int = Query(default=2000, ge=1960, le=2024),
    end_year: int = Query(default=2023, ge=1960, le=2024),
    db: Session = Depends(get_db),
):
    """Returns all three indicators in one call — used by the React dashboard."""
    try:
        gdp = get_indicator_data(db, "NY.GDP.MKTP.KD.ZG", start_year, end_year)
        inflation = get_indicator_data(db, "FP.CPI.TOTL.ZG", start_year, end_year)
        unemployment = get_indicator_data(db, "SL.UEM.TOTL.ZS", start_year, end_year)
        return {
            "gdp_growth": gdp,
            "inflation": inflation,
            "unemployment": unemployment,
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"World Bank API error: {str(e)}")


@app.get("/api/health")
def health():
    return {"status": "ok"}
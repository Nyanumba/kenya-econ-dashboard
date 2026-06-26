from pydantic import BaseModel
from typing import List, Optional


class DataPoint(BaseModel):
    year: int
    value: Optional[float]

    class Config:
        from_attributes = True


class IndicatorResponse(BaseModel):
    code: str
    name: str
    unit: str
    data: List[DataPoint]
    latest_value: Optional[float]
    latest_year: Optional[int]
    change_from_prev: Optional[float]


class DashboardSummary(BaseModel):
    gdp_growth: IndicatorResponse
    inflation: IndicatorResponse
    unemployment: IndicatorResponse
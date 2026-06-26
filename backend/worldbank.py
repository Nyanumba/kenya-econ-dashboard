import requests
import pandas as pd
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from models import IndicatorCache
from sqlalchemy.dialects.postgresql import insert

WORLD_BANK_BASE = "https://api.worldbank.org/v2"
COUNTRY_CODE = "KE"

INDICATORS = {
    "NY.GDP.MKTP.KD.ZG": {
        "name": "GDP growth",
        "unit": "Annual %",
    },
    "FP.CPI.TOTL.ZG": {
        "name": "Inflation (CPI)",
        "unit": "Annual %",
    },
    "SL.UEM.TOTL.ZS": {
        "name": "Unemployment rate",
        "unit": "% of total labor force",
    },
}


def fetch_from_worldbank(indicator_code: str, start_year: int = 2000, end_year: int = 2023) -> List[Dict]:
    url = (
        f"{WORLD_BANK_BASE}/country/{COUNTRY_CODE}/indicator/{indicator_code}"
        f"?format=json&date={start_year}:{end_year}&per_page=100"
    )
    response = requests.get(url, timeout=15)
    response.raise_for_status()

    data = response.json()
    if not data or len(data) < 2:
        return []

    records = data[1] or []
    return [
        {"year": int(r["date"]), "value": r["value"]}
        for r in records
        if r.get("date")
    ]


def upsert_to_cache(db: Session, indicator_code: str, records: List[Dict]):
    indicator_name = INDICATORS[indicator_code]["name"]
    for record in records:
        stmt = (
            insert(IndicatorCache)
            .values(
                indicator_code=indicator_code,
                indicator_name=indicator_name,
                year=record["year"],
                value=record["value"],
            )
            .on_conflict_do_update(
                constraint="uq_indicator_year",
                set_={"value": record["value"]},
            )
        )
        db.execute(stmt)
    db.commit()


def get_indicator_data(
    db: Session,
    indicator_code: str,
    start_year: int = 2000,
    end_year: int = 2023,
) -> Dict:
    # Fetch live from World Bank
    raw = fetch_from_worldbank(indicator_code, start_year, end_year)

    # Cache in PostgreSQL
    if raw:
        upsert_to_cache(db, indicator_code, raw)

    # Build clean dataframe
    df = pd.DataFrame(raw, columns=["year", "value"])
    df = df.dropna(subset=["value"])
    df = df.sort_values("year")

    data_points = df.to_dict(orient="records")

    latest_value = None
    latest_year = None
    change_from_prev = None

    if len(df) >= 1:
        latest = df.iloc[-1]
        latest_value = round(float(latest["value"]), 2)
        latest_year = int(latest["year"])

    if len(df) >= 2:
        prev_value = float(df.iloc[-2]["value"])
        if prev_value != 0:
            change_from_prev = round(latest_value - prev_value, 2)

    return {
        "code": indicator_code,
        "name": INDICATORS[indicator_code]["name"],
        "unit": INDICATORS[indicator_code]["unit"],
        "data": [{"year": int(d["year"]), "value": round(float(d["value"]), 2) if d["value"] is not None else None} for d in data_points],
        "latest_value": latest_value,
        "latest_year": latest_year,
        "change_from_prev": change_from_prev,
    }
from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from database import Base


class IndicatorCache(Base):
    __tablename__ = "indicator_cache"

    id = Column(Integer, primary_key=True, index=True)
    indicator_code = Column(String, nullable=False)
    indicator_name = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    value = Column(Float, nullable=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("indicator_code", "year", name="uq_indicator_year"),
    )

from pydantic import BaseModel
from enum import Enum


class DifficultyLevel(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class InterviewRequest(BaseModel):
    job_description: str
    difficulty: DifficultyLevel
    num_questions: int = 5  # Default to 5 questions if not provided


class AnswerRequest(BaseModel):
    session_id: str
    answer: str

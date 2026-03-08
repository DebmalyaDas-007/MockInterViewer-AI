from fastapi import APIRouter
from app.controllers.interview_controller import (
    start_interview_controller,
    submit_answer_controller
)
from app.controllers.evaluation_controller import evaluate_interview_controller
from app.schemas.interview_schema import (
    InterviewRequest,
    AnswerRequest
)

router=APIRouter()

@router.post("/start")
def start_interview_route(data: InterviewRequest):
    return start_interview_controller(data)

@router.post("/answer")
def submit_answer_route(data: AnswerRequest):
    return submit_answer_controller(data)

@router.get("/evaluate/{session_id}")
def evaluate_interview_route(session_id: str):
    return evaluate_interview_controller(session_id)
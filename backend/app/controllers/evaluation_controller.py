from app.services.evaluation_service import evaluate_interview


def evaluate_interview_controller(session_id):

    evaluation = evaluate_interview(session_id)

    return {
        "status": "finished",
        "evaluation": evaluation
    }
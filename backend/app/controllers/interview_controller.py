import uuid
from app.services.interview_service import start_interview,submit_answer

def start_interview_controller(data):
    session_id=str(uuid.uuid4())
    question=start_interview(
    session_id,
    data.job_description,
    data.difficulty,
    data.num_questions
)
    return{
        "session_id":session_id,
        "question":question
    }
    
    
def submit_answer_controller(data):
    question=submit_answer(
        data.session_id,
        data.answer
    )
    return{
        "question":question
    }
    
    
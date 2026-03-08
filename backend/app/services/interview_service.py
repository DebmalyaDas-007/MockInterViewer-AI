from app.ai.chains import question_chain, first_question_chain, intro_question_chain
from app.core.redis_client import redis_client
import json


def start_interview(session_id, job_description, difficulty, num_questions):

    session_data = {
        "job_description": job_description,
        "difficulty": difficulty,
        "stage": "intro",
        "history": [],
        "num_questions": num_questions
    }

    # generate intro question
    res = intro_question_chain.invoke({
        "job_description": job_description
    })

    question = res.content

    # store intro question
    session_data["history"].append({
        "question": question,
        "answer": None
    })

    # save session to Redis
    redis_client.set(session_id, json.dumps(session_data), ex=3600)

    return question


def submit_answer(session_id, answer):

    data = redis_client.get(session_id)

    if not data:
        raise ValueError("Session not found")

    session = json.loads(data)

    last_entry = session["history"][-1]
    last_entry["answer"] = answer

    # Check if interview finished
    if len(session["history"]) >= session["num_questions"] + 1:
        redis_client.set(session_id, json.dumps(session))
        return "Interview complete."

    if session["stage"] == "intro":

        session["stage"] = "technical"

        res = first_question_chain.invoke({
            "job_description": session["job_description"],
            "difficulty": session["difficulty"]
        })

    else:

        res = question_chain.invoke({
            "job_description": session["job_description"],
            "previous_question": last_entry["question"],
            "previous_answer": answer,
            "difficulty": session["difficulty"]
        })

    question = res.content

    session["history"].append({
        "question": question,
        "answer": None
    })

    # save updated session
    redis_client.set(session_id, json.dumps(session), ex=3600)

    return question
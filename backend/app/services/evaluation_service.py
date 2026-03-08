import json
from app.ai.chains import evaluation_chain
from app.core.redis_client import redis_client


def evaluate_interview(session_id):

    data = redis_client.get(session_id)

    if not data:
        raise ValueError("Session not found")

    session = json.loads(data)

    history = session["history"]

    history_text = ""

    for item in history:
        history_text += f"Question: {item['question']}\n"
        history_text += f"Answer: {item['answer']}\n\n"

    res = evaluation_chain.invoke({
        "history": history_text
    })

    try:
        evaluation = json.loads(res.content)
    except json.JSONDecodeError:
        evaluation = {
        "error": "Invalid JSON from model",
        "raw_response": res.content
        }
    session["evaluation"] = evaluation
    redis_client.set(session_id, json.dumps(session), ex=3600)

    return evaluation
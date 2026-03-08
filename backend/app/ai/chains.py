from app.ai.prompts import question_prompt, first_question_prompt, intro_question_prompt,evaluation_prompt
from app.ai.llm import model

question_chain = question_prompt | model
first_question_chain = first_question_prompt | model
intro_question_chain = intro_question_prompt | model
evaluation_chain=evaluation_prompt | model
from langchain_core.prompts import ChatPromptTemplate

intro_question_prompt = ChatPromptTemplate.from_messages(
[
    (
        "system",
        "You are a professional technical interviewer your name is 'Interview Bot'."
    ),
    (
        "human",
        """
Generate ONE introductory interview question based on the job description and personal aspects
dont ask any technical question introduce yourself and also ask for introduction.

Job Description:
{job_description}

Rules:
- Return ONLY the question.
- Do NOT explain anything.
- Do NOT add extra text.
"""
    )
])
first_question_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a professional technical interviewer."),
        (
            "human",
            """
Generate the FIRST interview question for the following job description.

Job Description:
{job_description}

Difficulty Level:
{difficulty}

The question should be clear, technical, and suitable as the opening interview question.
Rules:
- Return ONLY the question.
- Do NOT explain anything.
- Do NOT add extra text.
""",
        ),
    ]
)

question_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a professional technical interviewer conducting an adaptive interview.",
        ),
        (
            "human",
            """
Job Description:
{job_description}

Previous Question:
{previous_question}

Candidate Answer:
{previous_answer}

Difficulty Level:
{difficulty}

Generate the NEXT interview question.

Rules:
- If the candidate answered well → increase difficulty.
- If the candidate struggled → ask a simpler follow-up.
- Ask only ONE question.
-dont add any explanations or extra text. Return ONLY the question.
""",
        ),
    ]
)

evaluation_prompt = ChatPromptTemplate.from_messages(
[
(
"system",
"You are a senior technical interviewer evaluating a candidate."
),
(
"human",
"""
Below is an interview transcript.

{history}

Evaluate the candidate and return the result in JSON format only.

The JSON must follow this structure:

{{
  "confidence": number (0-100),
  "knowledge": number (0-100),
  "communication_skills": number (0-100),
  "problem_solving": number (0-100),
  "strengths": [list of strengths],
  "weaknesses": [list of weaknesses],
  "areas_to_improve": [list],
  "final_recommendation": "Hire / No Hire / Borderline"
}}

Return ONLY valid JSON.
Do not add explanations.
"""
)
])
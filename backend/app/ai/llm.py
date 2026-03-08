from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from dotenv import load_dotenv
import os
load_dotenv()


llm=HuggingFaceEndpoint(
   repo_id="Qwen/Qwen2.5-72B-Instruct",   
   task="text-generation",
   huggingfacehub_api_token=os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN"),
   temperature=1.7
)
model=ChatHuggingFace(llm=llm)

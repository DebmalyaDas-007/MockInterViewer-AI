import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const startInterview = (data:any) =>
  API.post("/interview/start", data);

export const submitAnswer = (data:any) =>
  API.post("/interview/answer", data);

export const getEvaluation = (sessionId:string) =>
  API.get(`/interview/evaluate/${sessionId}`);
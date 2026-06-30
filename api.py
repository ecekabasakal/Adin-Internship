from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pipeline import graph
from chat import answer_question
from pydantic import BaseModel

app = FastAPI(title="Reklam Anomali Analiz API")


@app.get("/")
def home():
    return JSONResponse(
        content={"mesaj": "API çalışıyor. Analiz için /analyze adresine istek atın."},
        media_type="application/json; charset=utf-8"
    )


@app.get("/analyze")
def analyze():
    result = graph.invoke({"campaigns": [], "anomalies": [], "report": ""})
    return JSONResponse(
        content={
            "anomalies": result["anomalies"],
            "report": result["report"]
        },
        media_type="application/json; charset=utf-8"
    )
   


class SoruModeli(BaseModel):
    soru: str


@app.post("/ask")
def ask(istek: SoruModeli):
    cevap = answer_question(istek.soru)
    return JSONResponse(
        content={"cevap": cevap},
        media_type="application/json; charset=utf-8"
    )
import csv
from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:7b", temperature=0)


def data_to_text(file_path="data.csv"):
    rows = []
    with open(file_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(str(row))
    return "\n".join(rows)


def answer_question(question):
    data = data_to_text()

    prompt = f"""Sen ADIN adlı bir reklam analiz asistanısın.
Aşağıda reklam kampanyalarının verileri var. Kullanıcının sorusunu bu verilere göre yanıtla.
Sayıları değiştirme, uydurma. Yalnızca Türkçe yanıt ver.
Doğrudan, akıcı cümlelerle yanıt ver. Başlık veya etiket ekleme. Tek kelimeyle değil, neden öyle olduğunu da içeren 2-4 cümlelik doğal bir paragraf yaz.

Kampanya verileri:
{data}

Kullanıcının sorusu: {question}"""

    response = llm.invoke(prompt)
    text = response.content.strip()

    for label in ["Yanıt:", "Yanit:", "Açıklama:", "Aciklama:", "Cevap:"]:
        text = text.replace(label, "").strip()

    return text
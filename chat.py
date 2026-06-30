import csv
from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:7b", temperature=0)


def veriyi_metne_cevir(dosya_adi="data.csv"):
    satirlar = []
    with open(dosya_adi, newline="", encoding="utf-8") as f:
        okuyucu = csv.DictReader(f)
        for satir in okuyucu:
            satirlar.append(str(satir))
    return "\n".join(satirlar)


def soruya_cevap_ver(soru):
    veri = veriyi_metne_cevir()

    prompt = f"""Sen ADIN adlı bir reklam analiz asistanısın.
Aşağıda reklam kampanyalarının verileri var. Kullanıcının sorusunu bu verilere göre yanıtla.
Sayıları değiştirme, uydurma. Yalnızca Türkçe yanıt ver. Kısa ve net ol.

Kampanya verileri:
{veri}

Kullanıcının sorusu: {soru}

Yanıt:"""

    response = llm.invoke(prompt)
    return response.content
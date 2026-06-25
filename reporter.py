from langchain_ollama import ChatOllama

llm = ChatOllama(model="qwen2.5:7b", temperature=0)
def generate_report(anomalies):
    if not anomalies:
        return "Tüm kampanyalar normal aralıkta. Anomali tespit edilmedi."

    bulgular = ""
    for a in anomalies:
        bulgular += f"\n- {a['campaign']}: " + ", ".join(a["reasons"])

    prompt = f"""Sen bir dijital reklam analiz asistanısın.
Aşağıda, sistem tarafından tespit edilmiş anormal kampanyalar ve sebepleri var.
Bu bulguları, pazarlama ekibine yönelik kısa ve net bir Türkçe rapor haline getir.
Sayıları değiştirme, yeni sayı uydurma. Yalnızca Türkçe yaz.

Tespit edilen anomaliler:{bulgular}

Rapor:"""

    response = llm.invoke(prompt)
    return response.content

if __name__ == "__main__":
    from anomaly import read_data, find_anomalies

    campaigns = read_data("data.csv")
    anomalies = find_anomalies(campaigns)

    report = generate_report(anomalies)

    print("\n KAMPANYA ANALİZ RAPORU \n")
    print(report)
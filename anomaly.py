import csv

def read_data(file_path):
    campaigns = []
    with open(file_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            campaigns.append(row)
    return campaigns


def find_anomalies(campaigns):
    anomalies = []
    for c in campaigns:
        ctr = float(c["ctr"])
        cpc = float(c["cpc"])
        reasons = []

        if ctr < 0.5:
            reasons.append(f"CTR çok düşük (%{ctr})")
        if ctr > 4.0:
            reasons.append(f"CTR alışılmadık derecede yüksek (%{ctr})")
        if cpc > 8.0:
            reasons.append(f"CPC çok yüksek ({cpc} TL)")

        if reasons:
            anomalies.append({
                "campaign": c["campaign"],
                "reasons": reasons
            })
    return anomalies


if __name__ == "__main__":
    campaigns = read_data("data.csv")
    anomalies = find_anomalies(campaigns)

    print(f"Toplam {len(campaigns)} kampanya okundu.")
    print(f"{len(anomalies)} anomali bulundu:\n")

    for a in anomalies:
        print(f"- {a['campaign']}")
        for reason in a["reasons"]:
            print(f"    • {reason}")
from typing import TypedDict, List
from anomaly import read_data, find_anomalies
from reporter import generate_report


class PipelineState(TypedDict):
    campaigns: List[dict]
    anomalies: List[dict]
    report: str
def anomaly_node(state: PipelineState) -> PipelineState:
    campaigns = read_data("data.csv")
    anomalies = find_anomalies(campaigns)
    state["campaigns"] = campaigns
    state["anomalies"] = anomalies
    return state


def report_node(state: PipelineState) -> PipelineState:
    report = generate_report(state["anomalies"])
    state["report"] = report
    return state
from langgraph.graph import StateGraph, START, END

builder = StateGraph(PipelineState)

builder.add_node("anomaly", anomaly_node)
builder.add_node("report", report_node)

builder.add_edge(START, "anomaly")
builder.add_edge("anomaly", "report")
builder.add_edge("report", END)

graph = builder.compile()


if __name__ == "__main__":
    result = graph.invoke({"campaigns": [], "anomalies": [], "report": ""})

    print("\n=== KAMPANYA ANALİZ RAPORU (LangGraph) ===\n")
    print(result["report"])
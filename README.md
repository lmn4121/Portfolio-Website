# Project Portfolio

Collection of projects by **Landon Nguyen** — Data Science | AI Engineering.

## Portfolio website

This repository hosts a static portfolio site (Next.js) on the default branch, including a floating **Ask Landon’s twin** chat widget.

```bash
npm install
cp .env.example .env.local   # optional; defaults to the live Render twin
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build && npm start`.

Deployable on Vercel (root directory). Resume PDF is served from `/Landon_Nguyen_Resume.pdf`.

### Digital twin widget

The widget talks to the live twin on Render: [https://digital-twin-69dv.onrender.com](https://digital-twin-69dv.onrender.com).

That host is the Gradio app from the [`Digital-Twin`](https://github.com/lmn4121/Project-Portfolio/tree/Digital-Twin) branch (`app.py` / `twin.py`). The browser calls Gradio’s public API (`POST /gradio_api/call/respond`, SSE on the returned `event_id`). CORS on Render already reflects Vercel origins, so no OpenAI keys belong in this frontend.

| Vercel env | Required | Notes |
|------------|----------|--------|
| `NEXT_PUBLIC_TWIN_API_URL` | no | Defaults to `https://digital-twin-69dv.onrender.com`. Set this if the twin URL changes. |
| `NEXT_PUBLIC_TWIN_API_MODE` | no | `gradio` (live) or `fastapi` (optional `twin-api` host). Auto-detected from `GET /health`. |
| `TWIN_API_URL` | no | Server rewrite target for `/twin-proxy/*` if you ever need a same-origin proxy. |

To use the same-origin proxy instead of a direct browser call, set `NEXT_PUBLIC_TWIN_API_URL=/twin-proxy`.

If Render CORS is later restricted, allow the Vercel origin(s) on the twin host (`PORTFOLIO_ORIGINS` for the FastAPI `twin-api`, or Gradio’s allowed origins).

## About

I’m a data science student at **The University of Texas at Arlington** in the Dual-Track program (**B.S. Data Science** with a Biology concentration and Mathematics minor; **M.S. Applied Statistics and Data Science**, expected **December 2027**; GPA **3.9**).

I have about **6 years** of programming experience and **2 years** applying statistical, data mining, and machine learning methods to research and data-driven problems. I’m especially interested in combining **AI engineering** with data science to build intelligent and autonomous systems.

**Core toolkit (from resume):** Python, SQL, R, SAS; NumPy/Pandas/scikit-learn; TensorFlow/Keras and PyTorch; LLMs, RAG, and agent tooling.

**Resume:** [Landon_Nguyen_Resume.pdf](./Landon_Nguyen_Resume.pdf)  
(Contact details are in the PDF.)

## How this repo is organized

The portfolio site lives on **main**. Each project lives on its **own branch** with its own README focused on techniques and results. Browse a branch to see the full write-up and code.

## Projects

### [Capstone-Project](https://github.com/lmn4121/Project-Portfolio/tree/Capstone-Project) — Infant Mortality Prediction & Explainable AI App
Two-semester undergraduate capstone (**DATA-4381 & DATA-4382: Capstone**): predict infant mortality rate (IMR) for districts in India’s Empowered Action Group states using Annual Health Survey indicators.

**Techniques:** EDA (leakage, multicollinearity, missingness), state-wise imputation, robust scaling, forward selection + agglomerative clustering/PCA (643 → 50 → 14 features), linear and tree-based benchmarks (AdaBoost with linear base estimators, Random Forest, XGBoost), final **ANN**, SHAP explainability, Streamlit deployment with an AI agent for interpretation.

**Results:** Final ANN **test R² 0.87** and **test RMSE 5.1** (training R² 0.86, RMSE 5.1).

### [Kaggle-Project](https://github.com/lmn4121/Project-Portfolio/tree/Kaggle-Project) — Metastatic Cancer Diagnosis
WiDS Datathon 2024 Challenge 1: binary classification of whether a patient received a metastatic cancer diagnosis within 90 days of screening.

**Techniques:** Feature filtering, mode imputation, one-hot encoding, simple neural net, AdaBoost, and gradient boosting with GridSearchCV.

**Results:** Kaggle test set **ROC AUC**: private **0.789**, public **0.798** (gradient boosting ensemble). Held-out split: test ROC AUC 0.791, validation ROC AUC 0.802, validation accuracy ~81%.

### [Data4380-Computer-Vision](https://github.com/lmn4121/Project-Portfolio/tree/Data4380-Computer-Vision) — Chest X-Ray Classification
**DATA-4380: Data Problems** Computer Vision assignment: classify chest X-rays as **COVID-19**, **Normal**, or **Viral Pneumonia** ([Kaggle dataset](https://www.kaggle.com/datasets/pranavraikokte/covid19-image-dataset)).

**Techniques:** TensorFlow/Keras; CLAHE and augmentation; ANN, CNN, and frozen VGG16 baselines; final fine-tuned **DenseNet201** with class weights.

**Results:** Final model **test macro F1 0.83** (validation macro F1 0.92; written report). Branch also includes the course report and presentation PDFs.

### [Digital-Twin](https://github.com/lmn4121/Project-Portfolio/tree/Digital-Twin) — AI Resume Digital Twin
Conversational digital twin that answers questions about background, skills, and experience using the resume plus a project knowledge base.

**Techniques:** LLM-assisted semantic chunking into ChromaDB (`ingest.py`); OpenAI Agents SDK twin with RAG, email capture, and unknown-question tools (`twin.py`); Gradio streaming chat UI (`app.py`).

**Results:** End-to-end twin chatbot with retrieval-grounded answers and tools to record leads / unanswered questions instead of inventing replies. Branch includes `requirements.txt` and a prebuilt `twin_db/` vector store.

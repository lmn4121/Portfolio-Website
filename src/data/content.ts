export const site = {
  name: "Landon Nguyen",
  title: "Data Science | AI Engineering",
  email: "lmnguyen420@gmail.com",
  location: "Little Elm, TX",
  github: "https://github.com/lmn4121/Project-Portfolio",
  resumePath: "/Landon_Nguyen_Resume.pdf",
  summary:
    "Data science student with 6 years of programming experience and 2 years applying statistics and machine learning to research problems. Builds and deploys ML and LLM applications, from explainable neural networks to RAG systems and AI agents.",
};

export const education = {
  school: "The University of Texas at Arlington",
  location: "Arlington, TX",
  expected: "December 2027",
  program:
    "Dual-Track M.S. Applied Statistics and Data Science | B.S. Data Science | Biology Concentration | Minor in Mathematics",
  gpa: "3.9",
  currentCoursework: [
    "Statistical Analysis with SAS",
    "Linear Algebra and Statistics with R",
  ],
  upcomingCoursework: [
    "Advanced Regression Analysis",
    "Machine Learning Applications",
    "Data Mining with Information Visualization",
  ],
  selfStudy: [
    "LLM Engineering (RAG, QLoRA, Hugging Face)",
    "Agentic AI (OpenAI Agents SDK, CrewAI, LangGraph, MCP, Guardrails)",
  ],
  plannedStudy: [
    "AI in Production (AWS Bedrock, Terraform, CI/CD, LangFuse)",
    "Azure Databricks, PySpark, Delta Lake",
  ],
  certifications: [
    "IBM Machine Learning with Python",
    "IBM Machine Learning Methodology",
    "PyTorch for Deep Learning",
  ],
};

export const skills = [
  {
    label: "Languages",
    items: ["Python", "SQL", "R", "SAS"],
  },
  {
    label: "Data Science",
    items: [
      "NumPy",
      "Pandas",
      "SciPy",
      "scikit-learn",
      "imbalanced-learn",
      "Statsmodels",
      "Matplotlib",
      "Seaborn",
      "Tableau",
    ],
  },
  {
    label: "Machine Learning",
    items: [
      "Regression",
      "Classification",
      "Ensemble Methods",
      "Dimensionality Reduction",
      "Feature Selection",
      "Imbalance Handling",
    ],
  },
  {
    label: "Deep Learning & AI",
    items: [
      "TensorFlow/Keras",
      "PyTorch",
      "OpenAI APIs",
      "Transfer Learning",
      "SHAP",
      "LLMs",
      "OpenAI Agents SDK",
      "RAG",
    ],
  },
  {
    label: "Mathematics & Statistics",
    items: [
      "Hypothesis Testing",
      "Multivariate Statistics",
      "Nonparametric Tests",
      "Linear Algebra",
    ],
  },
  {
    label: "Tools & Deployment",
    items: [
      "Git/GitHub",
      "Jupyter",
      "SQLite",
      "ChromaDB",
      "Streamlit",
      "Gradio",
      "Render",
      "Claude",
      "Cursor",
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  branch: string;
  branchUrl: string;
  techniques: string;
  result: string;
  bullets: string[];
};

export const projects: Project[] = [
  {
    id: "digital-twin",
    title: "AI Resume Digital Twin",
    subtitle: "LLM & Agentic AI — Independent Project",
    branch: "Digital-Twin",
    branchUrl:
      "https://github.com/lmn4121/Project-Portfolio/tree/Digital-Twin",
    techniques:
      "LLM-assisted semantic chunking into ChromaDB; RAG with the OpenAI Agents SDK; email-capture and unanswered-question-logging tools; Gradio streaming chat UI hosted on Render.",
    result:
      "Try it on this site via Ask Landon’s twin: retrieval-grounded answers, with tools that record leads and unanswered questions (it records gaps instead of hallucinating).",
    bullets: [
      "Built an agentic chatbot that answers recruiter questions about my background using retrieval-augmented generation (RAG) with the OpenAI Agents SDK over LLM-assisted semantic chunks stored in ChromaDB.",
      "Added tools for email capture and unanswered-question logging so the agent records gaps instead of hallucinating.",
      "Deployed the Gradio app on Render and embedded it on this site as a native chat widget; the OpenAI key stays server-side on Render, so no API keys reach the browser.",
    ],
  },
  {
    id: "capstone",
    title: "Infant Mortality Prediction & Explainable AI App",
    subtitle: "DATA-4381 & DATA-4382: Capstone · Team project with Alex Nguyen",
    branch: "Capstone-Project",
    branchUrl:
      "https://github.com/lmn4121/Project-Portfolio/tree/Capstone-Project",
    techniques:
      "EDA (leakage, multicollinearity, missingness), state-wise imputation, robust scaling, forward selection + agglomerative clustering/PCA (643 → 50 → 14 features), linear and tree-based benchmarks (AdaBoost with linear base estimators, Random Forest, XGBoost), final ANN, SHAP explainability, Streamlit deployment with an AI agent for interpretation.",
    result:
      "Final ANN test R² 0.87 and test RMSE 5.1 (training R² 0.86, RMSE 5.1). Test R² for the benchmarks: AdaBoost-linear 0.84, Random Forest 0.71 (overfit; training R² 0.80).",
    bullets: [
      "Reduced 643 district-level features for India’s Empowered Action Group states to 14 via forward selection, clustering, and PCA to address scarce data and high dimensionality.",
      "Trained an artificial neural network (test R² = 0.87), benchmarked against linear and tree-based models.",
      "Deployed a Streamlit app that uses SHAP values from a district’s prediction to surface its top drivers, then an AI agent researches their impact and proposes interventions to reduce IMR.",
    ],
  },
  {
    id: "cv",
    title: "Chest X-Ray Classification",
    subtitle: "DATA-4380: Data Problems",
    branch: "Data4380-Computer-Vision",
    branchUrl:
      "https://github.com/lmn4121/Project-Portfolio/tree/Data4380-Computer-Vision",
    techniques:
      "TensorFlow/Keras; CLAHE contrast enhancement and augmentation; ANN, CNN, and frozen VGG16 baselines; final ImageNet-pretrained DenseNet201 fine-tuned with class weights.",
    result:
      "Final DenseNet201 test macro F1 0.83 (validation macro F1 0.92). Main failure mode: Normal vs. Viral Pneumonia.",
    bullets: [
      "Computer Vision assignment: three-class classification of chest X-rays as COVID-19, Normal, or Viral Pneumonia on a small Kaggle image dataset.",
      "Enhanced lung X-rays with CLAHE and augmentation; benchmarked ANN, CNN, and frozen VGG16 baselines.",
      "Fine-tuned DenseNet201 with class weights to diagnose COVID-19 or viral pneumonia (test macro F1 = 0.83).",
    ],
  },
  {
    id: "kaggle",
    title: "Metastatic Cancer Diagnosis",
    subtitle: "WiDS Datathon 2024 Challenge 1 (Kaggle)",
    branch: "Kaggle-Project",
    branchUrl:
      "https://github.com/lmn4121/Project-Portfolio/tree/Kaggle-Project",
    techniques:
      "Feature filtering, mode imputation, one-hot encoding, simple neural net, AdaBoost, and gradient boosting with GridSearchCV.",
    result:
      "Kaggle test set ROC AUC: private 0.789, public 0.798 (gradient boosting ensemble). Held-out split: test ROC AUC 0.791, validation ROC AUC 0.802, validation accuracy ~81%.",
    bullets: [
      "Binary classification of whether a patient received a metastatic cancer diagnosis within 90 days of screening.",
      "Compared a simple neural network, AdaBoost, and boosted gradient ensembles on patient location, age, and diagnosis features.",
    ],
  },
];

export const independentAi = [
  "Built agentic workflows with the OpenAI Agents SDK, including an automated email pipeline.",
  "Built a multimodal chatbot integrating LLMs, image generation, and text-to-speech to simulate interactive stories.",
];

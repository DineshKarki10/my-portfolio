export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: 'Customer Churn Prediction',
    description:
      'A machine learning model that predicts customer churn based on historical data, with a live Streamlit dashboard for drift monitoring.',
    tags: ['Python', 'Scikit-learn', 'Streamlit'],
    github: 'https://github.com/DineshKarki10/customer-churn-prediction',
    demo: 'https://customer-churn-prediction-gy3zhtgk3cb38cxqxgomej.streamlit.app/',
  },
  {
    title: 'Ecommerce ETL Pipeline',
    description:
      'Scheduled ETL pipeline that ingests raw CSV exports, validates schemas and loads cleaned star-schema tables into supabase.',
    tags: ['Python', 'Pandas', 'SQL', 'Airflow'],
    github: 'https://github.com/DineshKarki10/ecommerce-etl-pipeline',
  },
  {
    title: 'Neural Sentiment Analyzer',
    description:
      'A transformer-based classifier that labels customer reviews from scraped product data, with a live Streamlit dashboard for drift monitoring.',
    tags: ['Python', 'PyTorch', 'Transformers', 'Streamlit'],
    github: 'https://github.com/DineshKarki10/neural-sentiment-analyzer',
    demo: 'https://neural-sentiment-analyzer-282krtj2qzudfyyd5k8alk.streamlit.app/',
  },
];

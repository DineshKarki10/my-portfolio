export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: 'Neural Sentiment Analyzer',
    description:
      'A transformer-based classifier that labels customer reviews from scraped product data, with a live Streamlit dashboard for drift monitoring.',
    tags: ['Python', 'PyTorch', 'Transformers', 'Streamlit'],
    github: 'https://github.com/DineshKarki10/neural-sentiment-analyzer',
    demo: 'https://neural-sentiment-analyzer-282krtj2qzudfyyd5k8alk.streamlit.app/',
  },
  {
    title: 'ETL Pipeline for Retail Data',
    description:
      'Scheduled ETL pipeline that ingests raw CSV exports, validates schemas and loads cleaned star-schema tables into a Postgres warehouse.',
    tags: ['Python', 'Pandas', 'SQL', 'Airflow'],
    github: 'https://github.com/DineshKarki10/retail-etl-pipeline',
  },
  {
    title: 'CNN Image Classifier',
    description:
      'ResNet fine-tuning project for medical image classification, with Grad-CAM visualisations explaining each prediction.',
    tags: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
    github: 'https://github.com/DineshKarki10/cnn-image-classifier',
    demo: 'https://dineshkarki10.github.io/cnn-image-classifier',
  },
];

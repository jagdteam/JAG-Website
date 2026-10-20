---
company: "Veloprimo"
logo: "/assets/logos/veloprimo.png"
place: "Irvine, CA"
start: "July 2026"
end: "Oct. 2026"
order: 2
roles:
  [
    {
      "title": "AI/ML Engineer Intern",
      "start": "July 2026",
      "end": "Oct. 2026",
      "summary": "Image retrieval system that identifies bikes and bike components from user photos.",
      "stack":
        [
          "SigLIP2",
          "DINOv2",
          "Embeddings",
          "Image Retrieval",
          "AWS (SageMaker, ECS Fargate, S3, EC2)",
          "GitHub Actions",
        ],
      "bullets":
        [
          "Benchmarked DINOv2-small, DINOv2-base, and SigLIP2-base backbones on SageMaker against 49 real-world bike photos and selected SigLIP2, raising top-1 from 24.5% to 38.8% and top-5 from 51.0% to 75.5%.",
          "Containerized the SigLIP2 retrieval pipeline with Docker and deployed it to AWS staging (ECS Fargate, S3, EC2) via GitHub Actions CI/CD, ranking matches at 23ms per image on CPU for about $36/month.",
          "Caught data leakage in the team's benchmark, where test photos came from the catalog's own photo shoot, and rebuilt a clean 1,000+ photo test set across 7 brands.",
          "Designed a multi-view fusion layer that pools embeddings from every angle a user uploads into one prediction, raising top-1 accuracy from 48.5% to 73.8%.",
        ],
    },
  ]
---

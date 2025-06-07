# Social-Cluster-Avatar

**Multimodal clustering of social-network profiles & local avatar generation**

## Prerequisites

- **Node.js** v22.16.0  
- **Docker** v24 + Compose  
- **Git**

## Setup

1. **Clone repo**  
   `bash
   git clone https://github.com/your-org/social-cluster-avatar.git
   cd social-cluster-avatar`

2. **Download ONNX models**
   `mkdir -p models
   wget -O models/clip_text.onnx   https://example.com/models/clip_text.onnx
   wget -O models/clip_image.onnx  https://example.com/models/clip_image.onnx`

3 **Install Stable Diffusion WebUI (Automatic1111)**
  `docker run -d --gpus all --name sd-webui \
  -p 7860:7860 \
  -v "$(pwd)/models:/stable-diffusion-webui/models" \
  AUTOMATIC1111/stable-diffusion-webui:latest \
  --medvram --enable-insecure-extension-access`

4. **Configure environment**  
    cp .env.example .env

5. **Run**
    docker compose up -d
    npm install
    npm run build
    npm start


## API

`POST /vectorize`       → { textEmbedding[], imageEmbedding[], graphEmbedding[] }
`POST /cluster`         → { clustersCount, noiseFraction, silhouetteScore }
`POST /generate-avatar` → { avatarBase64 }

## License
MIT © Oleksii Tovschyk

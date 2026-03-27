// src/services/mlService.js
import { YouTubeAPI } from './youtubeAPI';

export class MLService {
  static API_BASE = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

  // Predict video performance
  static async predictPerformance(videoData) {
    const response = await fetch(`${this.API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: videoData.title,
        description: videoData.description,
        tags: videoData.tags,
        thumbnail_features: videoData.thumbnailFeatures,
        video_length: videoData.videoLength,
        posting_time: videoData.postingTime,
        channel_stats: videoData.channelStats
      })
    });
    return response.json();
  }

  // Analyze caption with BERT
  static async analyzeCaptionWithBERT(caption) {
    const response = await fetch(`${this.API_BASE}/analyze-caption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption })
    });
    return response.json();
  }

  // Get trending insights
  static async getTrendingInsights(category) {
    const trendingVideos = await YouTubeAPI.getTrendingVideos(category);
    
    const response = await fetch(`${this.API_BASE}/analyze-trends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: trendingVideos.items })
    });
    return response.json();
  }

  // Train model with new data
  static async trainModel(trainingData) {
    const response = await fetch(`${this.API_BASE}/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingData)
    });
    return response.json();
  }
}
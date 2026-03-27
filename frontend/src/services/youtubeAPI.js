// src/services/youtubeAPI.js
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export class YouTubeAPI {
  // Get channel statistics
  static async getChannelStats(channelId) {
    const response = await fetch(
      `${BASE_URL}/channels?part=statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    return response.json();
  }

  // Get video details
  static async getVideoDetails(videoId) {
    const response = await fetch(
      `${BASE_URL}/videos?part=statistics,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    return response.json();
  }

  // Get trending videos for training data
  static async getTrendingVideos(categoryId = '0', maxResults = 50) {
    const response = await fetch(
      `${BASE_URL}/videos?part=statistics,snippet&chart=mostPopular&regionCode=US&categoryId=${categoryId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    return response.json();
  }

  // Search videos by keyword
  static async searchVideos(query, maxResults = 50) {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    return response.json();
  }
}
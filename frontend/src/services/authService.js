// src/services/authService.js
export class AuthService {
  static CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  static SCOPES = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload';

  static async initializeGoogleAuth() {
    return new Promise((resolve) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES
        }).then(resolve);
      });
    });
  }

  static async signIn() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn();
    const profile = user.getBasicProfile();
    
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      avatar: profile.getImageUrl(),
      accessToken: user.getAuthResponse().access_token
    };
  }

  static async signOut() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  static isSignedIn() {
    return window.gapi?.auth2?.getAuthInstance()?.isSignedIn?.get() || false;
  }
}
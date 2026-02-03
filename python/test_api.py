import requests
import json

print("🔍 YouTube API Test - PrePost Analytics")
print("=" * 50)

def test_youtube_api():
    """Test if we can access YouTube API"""
    
    print("1. Go to: https://developers.facebook.com/tools/explorer/")
    print("2. Get User Access Token")
    print("3. Paste it below (or press Enter for mock data)")
    
    token = input("\nEnter access token (or press Enter for mock): ").strip()
    
    if not token:
        print("\n📊 Using Mock YouTube Data...")
        return get_mock_youtube_data()
    
    print("\n🧪 Testing real YouTube API...")
    
    try:
        # Test basic API access
        response = requests.get(
            "https://graph.facebook.com/v24.0/me",
            params={"access_token": token}
        )
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ API Access Granted!")
            print(f"   User: {user_data.get('name')}")
            print(f"   ID: {user_data.get('id')}")
            
            # Try to get pages
                    # Try to get YouTube Business accounts via Facebook Pages
        accounts_response = requests.get(
            "https://graph.facebook.com/v24.0/me/accounts",
            params={
                "access_token": token,
                "fields": "name,id,instagram_business_account{id,name,username,profile_picture_url}"
            }
        )
        
        accounts_data = accounts_response.json().get('data', [])
        
        if accounts_data:
            print(f"\n📄 Found {len(accounts_data)} Facebook Pages")
            
            # Check which pages have connected accounts
            youtube_accounts = []
            for page in accounts_data:
                if 'instagram_business_account' in page:
                    ig_account = page['instagram_business_account']
                    youtube_accounts.append({
                        'page_id': page['id'],
                        'page_name': page.get('name'),
                        'youtube_id': ig_account['id'],
                        'youtube_username': ig_account.get('username'),
                        'profile_picture': ig_account.get('profile_picture_url')
                    })
                    print(f"   ✅ {page.get('name')} → @{ig_account.get('username')}")
            
            if youtube_accounts:
                print(f"\n🎯 Found {len(youtube_accounts)} YouTube Business Accounts!")
                
                # Try to get posts from first account
                try:
                    yt_posts = get_youtube_posts(token, youtube_accounts[0]['youtube_id'])
                    return {
                        "status": "success", 
                        "youtube_accounts": youtube_accounts,
                        "data": yt_posts
                    }
                except Exception as e:
                    print(f"   ⚠️ Couldn't fetch posts: {e}")
                    return {
                        "status": "success_no_posts", 
                        "youtube_accounts": youtube_accounts,
                        "data": get_mock_youtube_data()
                    }
            else:
                print("   ⚠️ No YouTube Business Accounts found")
                print("   ℹ️ Connect YouTube to a Facebook Page first")
                return {"status": "no_youtube_account", "data": get_mock_youtube_data()}
        else:
            print("   ⚠️ No Facebook Pages found")
            print("   ℹ️ Create a Facebook Page and connect YouTube to it")
            return {"status": "no_pages", "data": get_mock_youtube_data()}

    except Exception as e:
        print(f"❌ Connection error: {e}")
        return {"status": "error", "data": get_mock_youtube_data()}

def get_mock_youtube_data():
    """Return mock YouTube data for development"""
    print("\n📊 Generating Mock YouTube Data...")
    
    mock_data = {
        "posts": [
            {
                "id": "17895695668004550",
                "caption": "Excited to launch our NEW collection! 🎉 #fashion #new",
                "media_type": "CAROUSEL_ALBUM",
                "like_count": 2450,
                "comments_count": 120,
                "saves": 450,
                "reach": 12500,
                "timestamp": "2024-01-20T14:30:00+0000",
                "engagement_rate": 4.5
            },
            {
                "id": "17895695668004551",
                "caption": "Behind the scenes of our photoshoot 📸 #photography",
                "media_type": "IMAGE",
                "like_count": 1800,
                "comments_count": 89,
                "saves": 320,
                "reach": 9800,
                "timestamp": "2024-01-18T16:45:00+0000",
                "engagement_rate": 4.2
            }
        ],
        "stats": {
            "total_posts": 1247,
            "avg_engagement_rate": 4.2,
            "total_likes": "2.4M",
            "total_comments": "45K",
            "best_posting_hours": [14, 15, 16, 17],
            "best_media_type": "carousel"
        }
    }
    
    print(f"✅ Created {len(mock_data['posts'])} mock posts")
    print(f"   Avg engagement: {mock_data['stats']['avg_engagement_rate']}%")
    
    return {"status": "mock", "data": mock_data}

if __name__ == "__main__":
    print("Choose mode:")
    print("1. Test real YouTube API")
    print("2. Use mock data only")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        result = test_youtube_api()
    else:
        result = {"status": "mock", "data": get_mock_youtube_data()}
    
    # Save data for ML model to use
    with open("youtube_data.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"\n📁 Data saved to: youtube_data.json")
    print("\n🎯 Next: Run ml_models.py to train ML model")
    

def get_youtube_posts(access_token, youtube_user_id):
    """Fetch real YouTube posts for a business account"""
    print(f"\n📸 Fetching YouTube posts for account {youtube_user_id}...")
    
    # Get recent media
    media_response = requests.get(
        f"https://graph.facebook.com/v24.0/{youtube_user_id}/media",
        params={
            "access_token": access_token,
            "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count",
            "limit": 25
        }
    )
    
    media_data = media_response.json().get('data', [])
    
    if not media_data:
        print("   ⚠️ No posts found or insufficient permissions")
        raise Exception("No posts or permissions")
    
    print(f"   ✅ Found {len(media_data)} posts")
    
    # Format posts similar to mock data
    formatted_posts = []
    for post in media_data:
        formatted_posts.append({
            "id": post.get('id'),
            "caption": post.get('caption', ''),
            "media_type": post.get('media_type', 'IMAGE').lower(),
            "like_count": post.get('like_count', 0),
            "comments_count": post.get('comments_count', 0),
            "saves": 0,  # Would need additional API call
            "reach": 0,  # Would need insights permission
            "timestamp": post.get('timestamp', ''),
            "engagement_rate": 0  # Calculate if we have reach
        })
    
    # Add some mock stats for now
    stats = {
        "total_posts": len(formatted_posts),
        "avg_engagement_rate": 4.2,
        "total_likes": sum(p['like_count'] for p in formatted_posts),
        "total_comments": sum(p['comments_count'] for p in formatted_posts),
        "best_posting_hours": [14, 15, 16, 17],
        "best_media_type": "carousel"
    }
    
    return {
        "posts": formatted_posts,
        "stats": stats
    }
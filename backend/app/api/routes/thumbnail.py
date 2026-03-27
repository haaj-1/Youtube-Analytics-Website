from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List
import base64
from io import BytesIO
from PIL import Image
import numpy as np
from app.services.prediction_service import PredictionService
import sys

router = APIRouter()
prediction_service = PredictionService()

@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify route is working"""
    return {"status": "ok", "message": "Thumbnail route is working"}

@router.post("/compare-with-prediction")
async def compare_thumbnails_with_prediction(
    thumbnails: List[UploadFile] = File(...),
    title: str = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    subscriber_count: int = Form(...),
    duration_seconds: int = Form(...)
):
    """Compare multiple thumbnails by running full predictions for each"""
    print(f"\n{'='*50}", file=sys.stderr, flush=True)
    print(f"THUMBNAIL COMPARISON WITH PREDICTION", file=sys.stderr, flush=True)
    print(f"Number of thumbnails: {len(thumbnails)}", file=sys.stderr, flush=True)
    print(f"Title: {title}", file=sys.stderr, flush=True)
    print(f"{'='*50}\n", file=sys.stderr, flush=True)
    
    try:
        if len(thumbnails) < 2:
            raise HTTPException(status_code=400, detail="Please upload at least 2 thumbnails")
        
        if len(thumbnails) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 thumbnails allowed")
        
        prediction_service.load_models()
        
        results = []
        
        for idx, thumbnail in enumerate(thumbnails):
            # Read image
            contents = await thumbnail.read()
            img = Image.open(BytesIO(contents)).convert('RGB')
            
            # Convert to base64 for processing
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffered.getvalue()).decode()}"
            
            # Run full prediction with this thumbnail
            prediction = prediction_service.predict_performance(
                title=title,
                description=description,
                thumbnail_url=img_base64,
                category_id=category_id,
                subscriber_count=subscriber_count,
                duration_seconds=duration_seconds
            )
            
            # Extract CNN features for additional metrics
            features = prediction_service.extract_thumbnail_features(img_base64)
            
            # Calculate visual quality metrics
            img_array = np.array(img)
            brightness = float(np.mean(img_array))
            contrast = float(np.std(img_array))
            
            # CNN-based metrics
            feature_activation = float(np.mean(np.abs(features)))
            feature_diversity = float(np.std(features))
            
            results.append({
                'thumbnail_id': idx + 1,
                'filename': thumbnail.filename,
                'predicted_views': prediction['predicted_views'],
                'confidence_score': prediction['confidence_score'],
                'recommendations': prediction.get('recommendations', []),
                'image_data': img_base64,
                'cnn_activation': round(min(100, (feature_activation / 0.5) * 100), 2),
                'cnn_diversity': round(min(100, (feature_diversity / 0.3) * 100), 2),
                'brightness': round(brightness, 2),
                'contrast': round(contrast, 2)
            })
        
        # Sort by predicted views (best performing first)
        results.sort(key=lambda x: x['predicted_views'], reverse=True)
        
        # Add rankings and performance comparison
        best_views = results[0]['predicted_views']
        for rank, result in enumerate(results, 1):
            result['rank'] = rank
            
            # Calculate performance difference from best
            if rank == 1:
                result['performance_vs_best'] = "Best performer"
                result['views_difference'] = 0
            else:
                diff = best_views - result['predicted_views']
                diff_percent = (diff / best_views) * 100
                result['performance_vs_best'] = f"{diff_percent:.1f}% fewer views"
                result['views_difference'] = diff
        
        return {
            'success': True,
            'thumbnails': results,
            'best_thumbnail': results[0]['thumbnail_id'],
            'analysis': {
                'best_predicted_views': results[0]['predicted_views'],
                'worst_predicted_views': results[-1]['predicted_views'],
                'views_difference': results[0]['predicted_views'] - results[-1]['predicted_views'],
                'recommendation': f"Thumbnail #{results[0]['thumbnail_id']} is predicted to get {_format_number(results[0]['predicted_views'] - results[-1]['predicted_views'])} more views than the worst performer"
            }
        }
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Error processing thumbnails: {str(e)}")

def _format_number(num):
    """Format number with K/M suffix"""
    if num >= 1000000:
        return f"{num/1000000:.1f}M"
    if num >= 1000:
        return f"{num/1000:.1f}K"
    return str(int(num))
async def compare_thumbnails(thumbnails: List[UploadFile] = File(...)):
    """Compare multiple thumbnails and predict which will perform best"""
    print(f"\n{'='*50}", file=sys.stderr, flush=True)
    print(f"THUMBNAIL COMPARE ENDPOINT CALLED", file=sys.stderr, flush=True)
    print(f"Number of thumbnails: {len(thumbnails)}", file=sys.stderr, flush=True)
    print(f"{'='*50}\n", file=sys.stderr, flush=True)
    
    try:
        if len(thumbnails) < 2:
            raise HTTPException(status_code=400, detail="Please upload at least 2 thumbnails")
        
        if len(thumbnails) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 thumbnails allowed")
        
        prediction_service.load_models()
        
        results = []
        all_features = []
        
        for idx, thumbnail in enumerate(thumbnails):
            # Read image
            contents = await thumbnail.read()
            img = Image.open(BytesIO(contents)).convert('RGB')
            
            # Convert to base64 for processing
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffered.getvalue()).decode()}"
            
            # Extract features using CNN
            features = prediction_service.extract_thumbnail_features(img_base64)
            all_features.append(features)
            
            # Calculate image quality metrics
            img_array = np.array(img)
            
            # Visual appeal metrics
            brightness = np.mean(img_array)
            contrast = np.std(img_array)
            color_variance = np.var(img_array, axis=(0, 1)).mean()
            
            # Feature-based metrics
            feature_magnitude = float(np.linalg.norm(features))
            feature_variance = float(np.var(features))
            feature_sparsity = float(np.sum(np.abs(features) > 0.1) / len(features))
            
            results.append({
                'thumbnail_id': idx + 1,
                'filename': thumbnail.filename,
                'features': features,
                'brightness': float(brightness),
                'contrast': float(contrast),
                'color_variance': float(color_variance),
                'feature_magnitude': feature_magnitude,
                'feature_variance': feature_variance,
                'feature_sparsity': feature_sparsity,
                'image_data': img_base64
            })
        
        # Calculate relative CTR scores based on multiple factors
        all_features_array = np.array(all_features)
        
        # Use CNN features to predict relative performance
        # The CNN was trained to extract features that correlate with video views
        # Higher feature activation in certain dimensions indicates better performance
        for result in results:
            features = result['features']
            
            # === CNN-BASED METRICS (70% of score) ===
            # These use your trained ResNet18 CNN model
            
            # 1. Feature Activation Strength (25%)
            # Strong activations in CNN features indicate visually compelling elements
            # The CNN learned which visual patterns correlate with high-performing videos
            feature_activation = float(np.mean(np.abs(features)))
            activation_score = min(100, (feature_activation / 0.5) * 100)
            
            # 2. Feature Diversity (20%)
            # Diverse features indicate rich visual content (faces, text, objects, colors)
            # The CNN's 512 dimensions capture different visual aspects
            feature_diversity = float(np.std(features))
            diversity_score = min(100, (feature_diversity / 0.3) * 100)
            
            # 3. Distinctiveness vs Other Thumbnails (25%)
            # How unique this thumbnail is compared to others
            # Unique thumbnails stand out in YouTube search/recommendations
            feature_distances = [np.linalg.norm(features - other) 
                               for other in all_features if not np.array_equal(features, other)]
            if feature_distances:
                distinctiveness = np.mean(feature_distances)
                distinctiveness_score = min(100, (distinctiveness / 3.0) * 100)
            else:
                distinctiveness_score = 50
            
            # === BASIC IMAGE METRICS (30% of score) ===
            # These complement CNN features with simple visual quality checks
            
            # 4. Contrast (15%)
            # High contrast makes thumbnails pop in feeds
            contrast_score = min(100, result['contrast'] / 80 * 100)
            
            # 5. Color Richness (15%)
            # Colorful thumbnails attract more attention
            color_score = min(100, result['color_variance'] / 5000 * 100)
            
            # === FINAL CTR SCORE ===
            # Weighted combination emphasizing CNN-learned features
            ctr_score = (
                activation_score * 0.25 +      # CNN: Feature strength
                diversity_score * 0.20 +       # CNN: Feature diversity  
                distinctiveness_score * 0.25 + # CNN: Uniqueness
                contrast_score * 0.15 +        # Basic: Contrast
                color_score * 0.15             # Basic: Color richness
            )
            
            result['ctr_score'] = round(max(0, min(100, ctr_score)), 2)
            result['activation_score'] = round(activation_score, 2)
            result['diversity_score'] = round(diversity_score, 2)
            result['distinctiveness_score'] = round(distinctiveness_score, 2)
            result['contrast_score'] = round(contrast_score, 2)
            result['color_score'] = round(color_score, 2)
            
            # Brightness for display only (not used in scoring)
            result['brightness_score'] = round((result['brightness'] - 50) / 205 * 100, 2)
            
            # Remove raw features from response
            del result['features']
        
        # Sort by CTR score
        results.sort(key=lambda x: x['ctr_score'], reverse=True)
        
        # Add rankings and recommendations
        for rank, result in enumerate(results, 1):
            result['rank'] = rank
            result['recommendation'] = _get_recommendation(rank, len(results), result)
        
        return {
            'success': True,
            'thumbnails': results,
            'best_thumbnail': results[0]['thumbnail_id'],
            'analysis': _generate_analysis(results)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Error processing thumbnails: {str(e)}")

def _get_recommendation(rank: int, total: int, result: dict) -> str:
    """Generate recommendation based on ranking and metrics"""
    if rank == 1:
        strengths = []
        if result['contrast_score'] > 70:
            strengths.append("excellent contrast")
        if result['color_score'] > 70:
            strengths.append("vibrant colors")
        if result['distinctiveness_score'] > 70:
            strengths.append("unique visual appeal")
        
        if strengths:
            return f"Best choice - {', '.join(strengths[:2])}"
        return "Best choice - Highest predicted CTR"
    
    elif rank == 2:
        return "Strong alternative - Good performance expected"
    
    elif rank == total:
        weaknesses = []
        if result['contrast_score'] < 40:
            weaknesses.append("low contrast")
        if result['color_score'] < 40:
            weaknesses.append("limited color range")
        
        if weaknesses:
            return f"Consider improving: {', '.join(weaknesses[:2])}"
        return "Consider redesigning for better CTR"
    
    else:
        return "Moderate performance expected"

def _generate_analysis(results: List[dict]) -> dict:
    """Generate overall analysis"""
    scores = [r['ctr_score'] for r in results]
    
    return {
        'average_score': round(np.mean(scores), 2),
        'score_range': round(max(scores) - min(scores), 2),
        'recommendation': "Significant difference detected" if max(scores) - min(scores) > 20 
                         else "Thumbnails are relatively similar in quality"
    }


@router.post("/compare")
async def compare_thumbnails(thumbnails: List[UploadFile] = File(...)):
    """Compare multiple thumbnails using CNN features only (legacy endpoint)"""
    print(f"\n{'='*50}", file=sys.stderr, flush=True)
    print(f"THUMBNAIL COMPARE ENDPOINT CALLED", file=sys.stderr, flush=True)
    print(f"Number of thumbnails: {len(thumbnails)}", file=sys.stderr, flush=True)
    print(f"{'='*50}\n", file=sys.stderr, flush=True)
    
    try:
        if len(thumbnails) < 2:
            raise HTTPException(status_code=400, detail="Please upload at least 2 thumbnails")
        
        if len(thumbnails) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 thumbnails allowed")
        
        prediction_service.load_models()
        
        results = []
        all_features = []
        
        for idx, thumbnail in enumerate(thumbnails):
            # Read image
            contents = await thumbnail.read()
            img = Image.open(BytesIO(contents)).convert('RGB')
            
            # Convert to base64 for processing
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffered.getvalue()).decode()}"
            
            # Extract features using CNN
            features = prediction_service.extract_thumbnail_features(img_base64)
            all_features.append(features)
            
            # Calculate image quality metrics
            img_array = np.array(img)
            
            # Visual appeal metrics
            brightness = np.mean(img_array)
            contrast = np.std(img_array)
            color_variance = np.var(img_array, axis=(0, 1)).mean()
            
            # Feature-based metrics
            feature_magnitude = float(np.linalg.norm(features))
            feature_variance = float(np.var(features))
            feature_sparsity = float(np.sum(np.abs(features) > 0.1) / len(features))
            
            results.append({
                'thumbnail_id': idx + 1,
                'filename': thumbnail.filename,
                'features': features,
                'brightness': float(brightness),
                'contrast': float(contrast),
                'color_variance': float(color_variance),
                'feature_magnitude': feature_magnitude,
                'feature_variance': feature_variance,
                'feature_sparsity': feature_sparsity,
                'image_data': img_base64
            })
        
        # Calculate relative CTR scores based on multiple factors
        all_features_array = np.array(all_features)
        
        # Use CNN features to predict relative performance
        # The CNN was trained to extract features that correlate with video views
        # Higher feature activation in certain dimensions indicates better performance
        for result in results:
            features = result['features']
            
            # === CNN-BASED METRICS (70% of score) ===
            # These use your trained ResNet18 CNN model
            
            # 1. Feature Activation Strength (25%)
            # Strong activations in CNN features indicate visually compelling elements
            # The CNN learned which visual patterns correlate with high-performing videos
            feature_activation = float(np.mean(np.abs(features)))
            activation_score = min(100, (feature_activation / 0.5) * 100)
            
            # 2. Feature Diversity (20%)
            # Diverse features indicate rich visual content (faces, text, objects, colors)
            # The CNN's 512 dimensions capture different visual aspects
            feature_diversity = float(np.std(features))
            diversity_score = min(100, (feature_diversity / 0.3) * 100)
            
            # 3. Distinctiveness vs Other Thumbnails (25%)
            # How unique this thumbnail is compared to others
            # Unique thumbnails stand out in YouTube search/recommendations
            feature_distances = [np.linalg.norm(features - other) 
                               for other in all_features if not np.array_equal(features, other)]
            if feature_distances:
                distinctiveness = np.mean(feature_distances)
                distinctiveness_score = min(100, (distinctiveness / 3.0) * 100)
            else:
                distinctiveness_score = 50
            
            # === BASIC IMAGE METRICS (30% of score) ===
            # These complement CNN features with simple visual quality checks
            
            # 4. Contrast (15%)
            # High contrast makes thumbnails pop in feeds
            contrast_score = min(100, result['contrast'] / 80 * 100)
            
            # 5. Color Richness (15%)
            # Colorful thumbnails attract more attention
            color_score = min(100, result['color_variance'] / 5000 * 100)
            
            # === FINAL CTR SCORE ===
            # Weighted combination emphasizing CNN-learned features
            ctr_score = (
                activation_score * 0.25 +      # CNN: Feature strength
                diversity_score * 0.20 +       # CNN: Feature diversity  
                distinctiveness_score * 0.25 + # CNN: Uniqueness
                contrast_score * 0.15 +        # Basic: Contrast
                color_score * 0.15             # Basic: Color richness
            )
            
            result['ctr_score'] = round(max(0, min(100, ctr_score)), 2)
            result['activation_score'] = round(activation_score, 2)
            result['diversity_score'] = round(diversity_score, 2)
            result['distinctiveness_score'] = round(distinctiveness_score, 2)
            result['contrast_score'] = round(contrast_score, 2)
            result['color_score'] = round(color_score, 2)
            
            # Brightness for display only (not used in scoring)
            result['brightness_score'] = round((result['brightness'] - 50) / 205 * 100, 2)
            
            # Remove raw features from response
            del result['features']
        
        # Sort by CTR score
        results.sort(key=lambda x: x['ctr_score'], reverse=True)
        
        # Add rankings and recommendations
        for rank, result in enumerate(results, 1):
            result['rank'] = rank
            result['recommendation'] = _get_recommendation(rank, len(results), result)
        
        return {
            'success': True,
            'thumbnails': results,
            'best_thumbnail': results[0]['thumbnail_id'],
            'analysis': _generate_analysis(results)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Error processing thumbnails: {str(e)}")

def _get_recommendation(rank: int, total: int, result: dict) -> str:
    """Generate recommendation based on ranking and metrics"""
    if rank == 1:
        strengths = []
        if result['contrast_score'] > 70:
            strengths.append("excellent contrast")
        if result['color_score'] > 70:
            strengths.append("vibrant colors")
        if result['distinctiveness_score'] > 70:
            strengths.append("unique visual appeal")
        
        if strengths:
            return f"Best choice - {', '.join(strengths[:2])}"
        return "Best choice - Highest predicted CTR"
    
    elif rank == 2:
        return "Strong alternative - Good performance expected"
    
    elif rank == total:
        weaknesses = []
        if result['contrast_score'] < 40:
            weaknesses.append("low contrast")
        if result['color_score'] < 40:
            weaknesses.append("limited color range")
        
        if weaknesses:
            return f"Consider improving: {', '.join(weaknesses[:2])}"
        return "Consider redesigning for better CTR"
    
    else:
        return "Moderate performance expected"

def _generate_analysis(results: List[dict]) -> dict:
    """Generate overall analysis"""
    scores = [r['ctr_score'] for r in results]
    
    return {
        'average_score': round(np.mean(scores), 2),
        'score_range': round(max(scores) - min(scores), 2),
        'recommendation': "Significant difference detected" if max(scores) - min(scores) > 20 
                         else "Thumbnails are relatively similar in quality"
    }

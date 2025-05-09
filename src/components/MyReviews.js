// src/components/MyReviews.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { AuthContext } from '../contexts/AuthContext'

const meals = {
  1: {
    name: 'Moroccan Spiced Harissa Chicken',
    image: 'https://assets.cookfood.net/product_921_6564.jpg ',
  },
  2: {
    name: 'Creamy Chicken with Mushrooms & Bacon',
    image: 'https://assets.cookfood.net/product_2283_6259.jpg ',
  },
  3: {
    name: 'Coq au Vin',
    image: 'https://assets.cookfood.net/product_588_6243.jpg ',
  },
  4: {
    name: 'Chicken, Pea & Bacon Risotto',
    image: 'https://assets.cookfood.net/product_2050_5229.jpg ',
  },
  5: {
    name: 'Chicken & Portobello Mushroom Pie',
    image: 'https://assets.cookfood.net/product_1692_6810.jpg ',
  },
  6: {
    name: 'Spring Chicken & Asparagus Pie',
    image: 'https://assets.cookfood.net/product_1764_6815.jpg ',
  }
}

// Helper to render stars based on rating
const renderStars = (ratingValue) => {
  const fullStars = '★'.repeat(parseInt(ratingValue))
  const emptyStars = '☆'.repeat(10 - parseInt(ratingValue))
  return `${fullStars}${emptyStars}`
}

const MyReviews = () => {
  const navigate = useNavigate()
  const { user } = React.useContext(AuthContext)
  const [ratings, setRatings] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUserRatings = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('meal_ratings')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Could not load ratings:', error.message)
        setLoading(false)
        return
      }

      setRatings(data || [])
      setLoading(false)
    }

    fetchUserRatings()
  }, [user])

  if (loading) return <div>Loading your reviews...</div>
  if (!user) return <div>You must be logged in to view your memories</div>

  if (ratings.length === 0) {
    return (
      <div className="no-ratings">
        <h2>You haven't rated any meals yet.</h2>
        <button className="rate-meals-button" onClick={() => navigate('/rate')}>
          Rate a meal to create a memory
        </button>
      </div>
    )
  }

  return (
    <div className="my-reviews-page">
      <h2>Your Meal Memories</h2>

      <div className="review-list">
        {ratings.map((review, index) => {
          const mealData = meals[review.meal_id]
          const mealName = mealData?.name || `Unknown Meal ${review.meal_id}`
          const starCount = renderStars(review.rating)

          return (
            <div key={index} className="review-card">
              <h3>{mealName}</h3>
              <p><strong>Rating:</strong> {review.rating}/10 — {starCount}</p>

              {/* Date */}
              {review.created_at && (
                <p><em>Rated on: {new Date(review.created_at).toLocaleDateString()}</em></p>
              )}

              {/* Critique */}
              {review.critique && (
                <p><strong>Critique:</strong> {review.critique}</p>
              )}

              {/* Suggested sides */}
              {review.suggested_side_dishes && (
                <p><strong>Suggested Sides:</strong> {review.suggested_side_dishes}</p>
              )}

              {/* Uploaded image */}
              {review.image_url && (
  <div className="uploaded-image">
    <p><strong>Image:</strong> {review.image_type || ''}</p>
    <img
      src={review.image_url}
      alt={`Your experience with ${mealName}`}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '1rem auto',
        borderRadius: '8px'
      }}
    />
  </div>
)}

              {/* Button group */}
              <div className="review-card-buttons">
                <button
                  className="rate-meals-button"
                  onClick={() => navigate(`/rate/${review.meal_id}`)}
                >
                  Edit Review
                </button>

                <button
                  className="rate-meals-button"
                  onClick={() => {
                    const url = window.location.href
                    const tweetText = `I rated ${mealName} ${review.rating}/10 — ${starCount} on COOK Meals Rankings`
                    const fullTweet = encodeURIComponent(tweetText)
                    const finalUrl = encodeURIComponent(url)

                    window.open(`https://twitter.com/intent/tweet?text= ${fullTweet}&url=${finalUrl}`, '_blank')
                  }}
                >
                  Share on Twitter/X
                </button>
              </div>

              <hr style={{ margin: '2rem 0' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyReviews
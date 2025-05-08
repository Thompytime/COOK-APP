import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const RateMealForm = () => {
  const navigate = useNavigate()
  const { id: mealId } = useParams()

  // Form state
  const [rating, setRating] = React.useState(5)
  const [critique, setCritique] = React.useState('')
  const [sideDishes, setSideDishes] = React.useState('')
  const [image, setImage] = React.useState(null)
  const [preview, setPreview] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  // Define meals inside component
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

  // Log meals object once
  React.useEffect(() => {
    console.log('Available meals:', meals)
  }) // ⚠️ No dependency array → runs once

  // Parse ID
  const numericMealId = parseInt(mealId)
  const meal = meals[numericMealId]

  if (!meal) {
    console.warn(`Meal with ID ${numericMealId} not found`)
    return (
      <div className="rate-meal-form">
        <h2>Oops! Meal not found.</h2>
        <p>We couldn't find the meal you're trying to rate</p>

        <pre style={{ marginTop: '1rem' }}>
          Available meal IDs: {Object.keys(meals).join(', ')}
        </pre>

        <button onClick={() => navigate('/rate')}>
          Go back to all meals
        </button>
      </div>
    )
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      alert("You must be logged in to rate a meal")
      return
    }

    let imageUrl = null

    if (image) {
      setUploading(true)
      const fileExt = image.name.split('.').pop()
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
      const filePath = `ratings/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, image)

      if (uploadError) {
        alert("Could not upload image")
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('meal-images').getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    const { error } = await supabase
      .from('meal_ratings')
      .insert({
        user_id: userId,
        meal_id: numericMealId,
        rating: parseInt(rating),
        critique,
        suggested_side_dishes: sideDishes,
        image_url: imageUrl
      })

    setUploading(false)

    if (error) {
      alert("Could not save your rating")
      console.error(error.message)
      return
    }

    alert("Your rating has been saved!")
    navigate('/rate')
  }

  return (
    <div className="rate-meal-form">
      <h2>{meal.name}</h2>
      <img src={meal.image} alt={meal.name} className="meal-image" />

      {/* Rating form */}
      <form onSubmit={handleSubmit} className="rating-form">
        <label>
          Rating out of 10:
          <input
            type="number"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>

        <label>
          Critique or Comments:
          <textarea
            rows="4"
            placeholder="What did you think? Any suggestions?"
            value={critique}
            onChange={(e) => setCritique(e.target.value)}
          />
        </label>

        <label>
          Suggested Side Dishes:
          <input
            type="text"
            placeholder="What sides go well with this meal?"
            value={sideDishes}
            onChange={(e) => setSideDishes(e.target.value)}
          />
        </label>

        <label>
          Upload an image of your meal or setting:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
        )}

        <div className="social-share-buttons">
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit Rating'}
          </button>
          <button type="button" onClick={() => navigate('/rate')}>
            Cancel
          </button>
        </div>
      </form>

      <div className="share-section">
        <button onClick={() => {
          const url = window.location.href
          const text = `I rated ${meal.name} ★★★★★ on COOK Meals Rankings`
          window.open(`https://twitter.com/intent/tweet?url= ${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        }}>
          Share on Twitter/X
        </button>
      </div>
    </div>
  )
}

export default RateMealForm
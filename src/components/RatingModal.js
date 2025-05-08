import React, { useState } from 'react'
import './RatingModal.css'

const RatingModal = ({ isOpen, onClose, mealName }) => {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [sides, setSides] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Later we'll send this data to Supabase
    alert(`Rating for ${mealName} submitted!`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>Rate: {mealName}</h2>

        <form onSubmit={handleSubmit} className="rating-form">
          <label>
            Rate out of 10:
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
            Review or comments:
            <textarea
              rows="4"
              placeholder="What did you think? Any suggestions?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </label>

          <label>
            Suggested side dishes:
            <input
              type="text"
              placeholder="What goes well with this meal?"
              value={sides}
              onChange={(e) => setSides(e.target.value)}
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
            <button type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?text=I just rated ${mealName} ★★★★★ on COOK Meals Rankings`, '_blank')}>
              Share on Twitter/X
            </button>

            <button type="button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https://my-cook-app.vercel.app/rate/${Math.random()}`, '_blank')}>
              Share on Facebook
            </button>

            <button type="button" onClick={() => window.location.href = `whatsapp://send?text=I just rated ${mealName} ★★★★★ on COOK Meals Rankings https://my-cook-app.vercel.app/rate/${Math.random()}`}>
              Share on WhatsApp
            </button>

            <button type="button" onClick={() => window.open(`https://www.instagram.com`, '_blank')}>
              Share on Instagram
            </button>
          </div>

          <button type="submit">Submit Rating</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default RatingModal
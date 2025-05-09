// src/components/Leaderboard.js
import React from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'

const meals = {
  1: { name: 'Moroccan Spiced Harissa Chicken' },
  2: { name: 'Creamy Chicken with Mushrooms & Bacon' },
  3: { name: 'Coq au Vin' },
  4: { name: 'Chicken, Pea & Bacon Risotto' },
  5: { name: 'Chicken & Portobello Mushroom Pie' },
  6: { name: 'Spring Chicken & Asparagus Pie' }
}

const Leaderboard = () => {
  const { user } = React.useContext(AuthContext)
  const [userRatings, setUserRatings] = React.useState({})
  const [globalRatings, setGlobalRatings] = React.useState({})
  const [loadingUser, setLoadingUser] = React.useState(true)
  const [loadingGlobal, setLoadingGlobal] = React.useState(true)

  // Load Personal Ratings (only for current user)
  React.useEffect(() => {
    const fetchUserRatings = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('meal_ratings')
        .select('meal_id, rating')
        .eq('user_id', user.id)

      if (error) {
        console.error("Could not load personal ratings:", error.message)
        setLoadingUser(false)
        return
      }

      const summary = {}

      data.forEach(r => {
        if (!summary[r.meal_id]) {
          summary[r.meal_id] = { count: 0, total: 0, average: 0 }
        }

        summary[r.meal_id].count += 1
        summary[r.meal_id].total += r.rating
        summary[r.meal_id].average = (summary[r.meal_id].total / summary[r.meal_id].count).toFixed(1)
      })

      setUserRatings(summary)
      setLoadingUser(false)
    }

    fetchUserRatings()
  }, [user])

  // Load Global Ratings (for all users)
  React.useEffect(() => {
    const fetchGlobalRatings = async () => {
      const { data, error } = await supabase
        .from('meal_ratings')
        .select('meal_id, rating') // ⚠️ No filter here – gets ALL ratings
      // ↑↑↑ This is key – no .eq('user_id', ...) ↑↑↑

      if (error) {
        console.error("Could not load global ratings:", error.message)
        setLoadingGlobal(false)
        return
      }

      const summary = {}

      data.forEach(r => {
        if (!summary[r.meal_id]) {
          summary[r.meal_id] = { count: 0, total: 0, average: 0 }
        }

        summary[r.meal_id].count += 1
        summary[r.meal_id].total += r.rating
        summary[r.meal_id].average = (summary[r.meal_id].total / summary[r.meal_id].count).toFixed(1)
      })

      setGlobalRatings(summary)
      setLoadingGlobal(false)
    }

    fetchGlobalRatings()
  }, [])

  const formatList = (ratings) => {
    return Object.entries(ratings)
      .map(([id, data]) => ({
        id,
        name: meals[id]?.name || `Meal #${id}`,
        average: data.average,
        count: data.count
      }))
      .sort((a, b) => b.average - a.average)
  }

  const userRankings = formatList(userRatings)
  const globalRankings = formatList(globalRatings)

  if (loadingUser || loadingGlobal) return <div>Loading...</div>

  return (
    <div className="leaderboard-page">
      <h2>🏆 Meal Rankings</h2>

      {/* YOUR PERSONAL RANKINGS */}
      {user && (
        <>
          <div className="personal-leaderboard">
            <h3>👤 Your Personal Rankings</h3>
            {userRankings.length > 0 ? (
              <ol>
                {userRankings.map((meal, index) => (
                  <li key={`user-${index}`}>
                    <strong>{meal.name}</strong> — {meal.average}/10 ({meal.count} ratings)
                  </li>
                ))}
              </ol>
            ) : (
              <p>You haven't rated any meals yet.</p>
            )}
          </div>

          <hr style={{ margin: '2rem 0' }} />
        </>
      )}

      {/* GLOBAL LEADERBOARD */}
      <div className="global-leaderboard">
        <h3>🌐 Global Meal Rankings</h3>
        {globalRankings.length > 0 ? (
          <ol>
            {globalRankings.map((meal, index) => (
              <li key={`global-${index}`}>
                <strong>{meal.name}</strong> — {meal.average}/10 ({meal.count} ratings)
              </li>
            ))}
          </ol>
        ) : (
          <p>No ratings found. Be the first to rate a meal!</p>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
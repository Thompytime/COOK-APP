// src/components/RateMeals.js
import React from 'react'
import { useNavigate } from 'react-router-dom'

const meals = [
  {
    id: 1,
    name: 'Moroccan Spiced Harissa Chicken',
    image: 'https://assets.cookfood.net/product_921_6564.jpg',
    link: 'https://www.cookfood.net/products/moroccan-spiced-harissa-chicken',
  },
  {
    id: 2,
    name: 'Creamy Chicken with Mushrooms & Bacon',
    image: 'https://assets.cookfood.net/product_2283_6259.jpg',
    link: 'https://www.cookfood.net/products/chicken-mushrooms-bacon',
  },
  {
    id: 3,
    name: 'Coq au Vin',
    image: 'https://assets.cookfood.net/product_588_6243.jpg',
    link: 'https://www.cookfood.net/products/coq-au-vin',
  },
  {
    id: 4,
    name: 'Chicken, Pea & Bacon Risotto',
    image: 'https://assets.cookfood.net/product_2050_5229.jpg',
    link: 'https://www.cookfood.net/products/chicken-pea-bacon-risotto',
  },
  {
    id: 5,
    name: 'Chicken & Portobello Mushroom Pie',
    image: 'https://assets.cookfood.net/product_1692_6810.jpg',
    link: 'https://www.cookfood.net/products/chicken-portobello-mushroom-pie',
  },
  {
    id: 6,
    name: 'Spring Chicken & Asparagus Pie',
    image: 'https://assets.cookfood.net/product_1764_6815.jpg',
    link: 'https://www.cookfood.net/products/chicken-asparagus-pie',
  }
]

const RateMeals = () => {
  const navigate = useNavigate()

  return (
    <div className="rate-meals">
      <h2>Rate Our Meals</h2>
      <p>Select a meal below to rate it, write a critique, suggest sides, or upload photos.</p>

      <div className="meal-list">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <h3>
              <a href={meal.link} target="_blank" rel="noopener noreferrer">
                {meal.name}
              </a>
            </h3>
            <img src={meal.image} alt={meal.name} className="meal-image" />
            
            {/* Button uses Link for proper routing */}
            <button
              onClick={() => navigate(`/rate/${meal.id}`)}
              className="rate-this-meal-button"
            >
              Rate This Meal
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RateMeals
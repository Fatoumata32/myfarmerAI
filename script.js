// Constants
const API_KEY = 'AIzaSyCl3k7eaod1vFRVfAhRMHrbeWcmcS1FTBQ';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// DOM Elements
const form = document.getElementById('recommendationForm');
const loader = document.getElementById('loader');
const results = document.getElementById('results');
const errorMessage = document.getElementById('errorMessage');
const recommendationsContainer = document.getElementById('recommendationsContainer');

// Helper Functions
function showLoader() {
    loader.classList.add('show');
    results.classList.remove('show');
    errorMessage.classList.remove('show');
}

function hideLoader() {
    loader.classList.remove('show');
}

function showError(message) {
    errorMessage.classList.add('show');
    document.getElementById('errorText').textContent = message;
    hideLoader();
}

function cleanGeminiResponse(text) {
    // Remove markdown formatting and clean up the text
    return text
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '')    // Remove italic markdown
        .replace(/#{1,6} /g, '') // Remove headers
        .replace(/\n\s*\n/g, '\n') // Remove extra newlines
        .trim();
}

function displayRecommendations(recommendations) {
    const { plants, fertilizers, tips } = recommendations;
    recommendationsContainer.innerHTML = `
        <div class="recommendation-card">
            <h4><i class="fas fa-seedling"></i> Recommended Plants</h4>
            <p>${plants}</p>
        </div>
        <div class="recommendation-card">
            <h4><i class="fas fa-flask"></i> Fertilizer Recommendations</h4>
            <p>${fertilizers}</p>
        </div>
        <div class="recommendation-card">
            <h4><i class="fas fa-lightbulb"></i> Cultivation Tips</h4>
            <p>${tips}</p>
        </div>
    `;
    results.classList.add('show');
    hideLoader();
}

async function getRecommendations(data) {
    const prompt = `
        Based on the following conditions:
        Location: ${data.location}
        Soil Type: ${data.soilType}
        Weather: ${data.climate}
        Temperature: ${data.temperature}°C

        Please provide three sections:
        1. Suitable plants to grow in these conditions
        2. Recommended fertilizers for these plants
        3. Specific cultivation tips considering the weather and temperature

        Format the response in plain text without any markdown formatting or special characters.
    `;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const result = await response.json();
        const generatedText = result.candidates[0].content.parts[0].text;

        // Split and clean the text
        const sections = generatedText.split(/\d\./).filter(Boolean);
        const recommendations = {
            plants: cleanGeminiResponse(sections[0] || ''),
            fertilizers: cleanGeminiResponse(sections[1] || ''),
            tips: cleanGeminiResponse(sections[2] || '')
        };

        displayRecommendations(recommendations);
    } catch (error) {
        showError(error.message || 'An error occurred while fetching recommendations');
    }
}

// Form Submit Handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        location: document.getElementById('location').value,
        soilType: document.getElementById('soilType').value,
        climate: document.getElementById('climate').value,
        temperature: document.getElementById('temperature').value
    };

    showLoader();
    await getRecommendations(formData);
});

// Temperature Input Validation
const temperatureInput = document.getElementById('temperature');
temperatureInput.addEventListener('input', (e) => {
    let value = e.target.value;
    if (value > 60) e.target.value = 60;  // Max temperature
    if (value < -40) e.target.value = -40; // Min temperature
});

// Example for handling the "Start Growing Smarter" button click
document.addEventListener("DOMContentLoaded", () => {
  const ctaButton = document.querySelector(".cta-button");

  ctaButton.addEventListener("click", () => {
    alert("Welcome to smarter farming with MyFarmerAI!");
  });
});

document.querySelector('.myfarmerai-cta-button-link').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    document.querySelector('#recommendationForm').scrollIntoView({ behavior: 'smooth' });
});

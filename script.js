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

const displayRecommendations = (recommendations) => {
    // Destructure recommendations with default empty values
    const { plants = "No plant recommendations available.", fertilizers = "No fertilizer recommendations available.", tips = "No cultivation tips available." } = recommendations;

    // Function to format items into a list
    const formatAsList = (items) => {
        if (!items) return "<ul><li>No items available.</li></ul>"; // Fallback for empty items
        const itemArray = items.split(',').map(item => item.trim()).filter(item => item);
        return itemArray.length ? `<ul>${itemArray.map(item => `<li>${item}</li>`).join('')}</ul>` : "<ul><li>No items available.</li></ul>";
    };

    // Populate the specific sections
    document.getElementById('plantsList').innerHTML = formatAsList(plants);
    document.getElementById('fertilizersList').innerHTML = formatAsList(fertilizers);
    document.getElementById('tipsContent').innerHTML = tips || "No cultivation tips available.";

    results.classList.add('show');
    hideLoader();
};

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
temperatureInput
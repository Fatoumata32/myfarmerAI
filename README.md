# myfarmerAI

Table of Contents
Prerequisites
Installation Instructions
Running Locally
Deploying to Production
Challenges and Solutions
Credits
Prerequisites
To run this project, ensure you have the following:

A modern web browser (Google Chrome, Firefox, etc.)
Text Editor (e.g., VSCode, Sublime Text) for editing the code (optional).
API Key: This project uses a Google Gemini API key for generating farming recommendations. You'll need to replace the existing key with your own. You can obtain a key from Google Cloud Platform.
Installation Instructions
1. Clone the Repository:
To get started, clone the myfarmerAI repository:

bash
Copy code
git clone https://github.com/Fatoumata32/myfarmerAI.git
2. Navigate to the Project Directory:
Go to the project folder:

bash
Copy code
cd myfarmerAI
3. Update API Key:
The project currently uses a Google Gemini API to generate content. Replace the existing API key with your own key:

javascript
Copy code
const API_KEY = 'YOUR_NEW_API_KEY';
Find the API key in the JavaScript file under the Constants section:

javascript
Copy code
const API_KEY = 'AIzaSyCl3k7eaod1vFRVfAhRMHrbeWcmcS1FTBQ';  // Replace with your key
4. Open the Project Files:
Since this project is built using HTML, CSS, and JavaScript, you don't need to install any additional libraries. Simply open the index.html file in your browser to view the website.

Running Locally
To run the application locally on your computer:

Open the HTML file:

Navigate to the myfarmerAI folder.
Open the index.html file directly in your browser (e.g., Chrome, Firefox).
The website will load locally on your machine.
Interact with the form:

Use the form on the website to input details like location, soil type, climate, and temperature.
The form sends these details to the Google Gemini API, and you’ll receive recommendations based on the input.

Challenges and Solutions
1. Challenge: Handling API Requests
During development, handling API requests and managing the API responses efficiently was a challenge.

Solution: We used JavaScript's fetch function to make asynchronous requests to the API and handle the responses. The API key was securely added to the request, and error handling was implemented to provide useful feedback to the user.

2. Challenge: Formatting API Responses
The API responses sometimes included markdown formatting, which made it difficult to display the content cleanly.

Solution: A helper function was created (cleanGeminiResponse) to clean up the text and remove unwanted markdown formatting.

Credits
Google Gemini API – For generating content based on user input. (API Documentation)
HTML5, CSS, and JavaScript – Core technologies for building the website.
cloudflare.com – For custom fonts used in the project. 

Deployment Summary
Setup Web Servers:

Installed and configured Nginx on both 6295-web-01 and 6295-web-02.
Deployed the application files to /var/www/html on both servers.
Verified the application was running correctly by accessing the servers directly via their IPs.
Configure the Load Balancer:

Installed Nginx on the load balancer server (6295-lb-01).
Configured Nginx to distribute incoming traffic between 6295-web-01 and 6295-web-02 using a load-balancing setup.
Tested the load balancer to ensure traffic alternated between the two web servers.
Testing and Verification:

Verified load balancing by refreshing the load balancer's IP (http://54.209.7.237) and observing responses from both web servers.
Simulated server failure to confirm the load balancer redirected traffic to the available server.
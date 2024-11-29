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


git clone https://github.com/Fatoumata32/myfarmerAI.git
2. Navigate to the Project Directory:
Go to the project folder:


cd myfarmerAI
3. Update API Key:
The project currently uses a Google Gemini API to generate content. Replace the existing API key with your own key:

javascript

const API_KEY = 'YOUR_NEW_API_KEY';
Find the API key in the JavaScript file under the Constants section:

javascript

const API_KEY = 'AIzaSyCl3k7eaod1vFRVfAhRMHrbeWcmcS1FTBQ';  // Replace with your key
4. Open the Project Files:
Since this project is built using HTML, CSS, and JavaScript, you don't need to install any additional libraries. Simply open the index.html file in your browser to view the website.

==========Running Locally=============
To run the application locally on your computer:

-Open the HTML file:
-Navigate to the myfarmerAI folder.
-Open the index.html file directly in your browser (e.g., Chrome, Firefox).
-The website will load locally on your machine.

-Interact with the form:
Use the form on the website to input details like location, soil type, climate, and temperature.
The form sends these details to the Google Gemini API, and you’ll receive recommendations based on the input.

==========Challenges and Solutions========
1. Challenge: Handling API Requests
During development, handling API requests and managing the API responses efficiently was a challenge.

Solution: We used JavaScript's fetch function to make asynchronous requests to the API and handle the responses. The API key was securely added to the request, and error handling was implemented to provide useful feedback to the user.

2. Challenge: Formatting API Responses
The API responses sometimes included markdown formatting, which made it difficult to display the content cleanly.

Solution: A helper function was created (cleanGeminiResponse) to clean up the text and remove unwanted markdown formatting.

============Credits===========
Google Gemini API – For generating content based on user input. (API Documentation)
HTML5, CSS, and JavaScript – Core technologies for building the website.
cloudflare.com – For custom fonts used in the project. 

===========Deployment Summary===========
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

===============Detailed Deployment==============

How I Successfully Deployed my Application
Step 1: Initial Setup
Installed Nginx on All Servers
Used the following command on all servers (Web01, Web02, and Lb01):


sudo apt update
sudo apt install nginx
Transferred Application Files to Web Servers
Uploaded the myfarmerAI application files to the directory /var/www/myfarmerAI on Web01 and Web02 using scp:


scp -i C:\Users\LENOVO\.ssh\id_rsa -r C:\Users\LENOVO\Desktop\myfarmerAI\* ubuntu@<server-ip>:/var/www/myfarmerAI/
Set Up Permissions
Ensured the correct ownership and permissions for the /var/www/myfarmerAI directory:


sudo chown -R www-data:www-data /var/www/myfarmerAI
sudo chmod -R 755 /var/www/myfarmerAI
Step 2: Configuring Nginx on Web Servers
Configured Nginx on Each Web Server


-Edited the Nginx configuration file on Web01 and Web02 (/etc/nginx/sites-available/default) to serve the application:

nginx
Copy code
server {
    listen 80;
    root /var/www/myfarmerAI;
    index index.html;
    server_name _;
}
-Tested and Reloaded Nginx
Tested the configuration and restarted Nginx:


sudo nginx -t
sudo systemctl reload nginx
Verified Deployment
Opened the Web01 and Web02 IPs in the browser to ensure the application was accessible:

Web01: http://3.80.90.73
Web02: http://34.201.94.112
Step 3: Setting Up the Load Balancer
Configured Nginx on the Load Balancer (Lb01)
Edited /etc/nginx/nginx.conf to include a load balancing configuration:

nginx
Copy code
events {
    worker_connections 1024;
}

http {
    upstream myapp {
        server 3.80.90.73;  # Web01
        server 34.201.94.112;  # Web02
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://myapp;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
Tested and Reloaded Nginx on Lb01
Verified the configuration and reloaded Nginx:


sudo nginx -t
sudo systemctl reload nginx
Verified Load Balancer
Accessed the load balancer's IP to test traffic distribution between Web01 and Web02:

Load Balancer: http://54.227.74.244
Step 4: Load Balancer Testing
Stopped Nginx on one of the web servers (e.g., Web02) to verify the load balancer redirected traffic seamlessly to the other server:


sudo systemctl stop nginx
Reactivated Nginx afterward to restore full redundancy:


sudo systemctl start nginx

Outcome
The application is accessible online via the load balancer's IP (http://54.227.74.244).
The load balancer distributes traffic between Web01 and Web02, ensuring reliability and scalability.
Users experience seamless access regardless of the web server handling the request.
Let me know if you’d like me to assist with documenting or optimizing anything further! 
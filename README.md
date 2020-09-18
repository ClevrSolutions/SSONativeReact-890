## SSONativeReact
Custom widget for Mendix 8.9 and later to support SSO in a Native Mobile Mendix application.

## Features
in-app webbrowser with events for intercepting url changes and detecting page loads. Uses regex patterns to be able to detect specific urls.

## Installation
Install the widget's dependencies with npm install
Build the widget with npm run build
Copy the widget package file from the dist/1.0.0 folder to your Mendix' project /widgets folder

## Usage
Place the widget on a mobile page inside a DataView
Configure the widget with:
- Callback: Use an attribute from the configured DataView object which receives the callback url
- Set events for loading, errorhandling, and callback
- URLL: Fill the URL with the web url of the page that should initially be loaded
- Callback Regex include: use an optional regex pattern. The callback event will be triggered when the intercepted url matches this pattern 
- Callback Regex exclude: use an optional regex pattern. The callback event will be triggered when the intercepted url does not match this pattern 
- Onload Regex include: use an optional regex pattern. The On load event will be triggered when the loaded url matches this pattern 

##Typical scenario's
- SSO sign in using OAuth2. Set the initial URL to the starting point of an OAuth2 sign in flow (e.g. Azure). Intercept the callback from the Identity provider and trigger a nanoflow On callback event. Process the received callback url further in the application.
- SSO sign out using OAuth2. Set the initial URL to the starting point of an OAuth2 sign out flow (e.g. Azure). Trigger a nanoflow On load event when the loaded url indicates that the user has signed out. Execute further steps in your application to logout the user from your application.
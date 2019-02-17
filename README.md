# Restaurant Reviews

## Overview

This code covers Stage 1 of the Restaurant Reviews web application for the Mobile Web Specialist course from Udacity. It has the following features:

### v1.0

* A fully responsive layout
* Responsive images, both for sizing and art direction
* A restaurant listings page
* A restaurant info page
* Accessibility updates
* Service worker implementation to allow for viewing previously browsed pages while offline
* All other rubric requirements

### v2.0
* Application Data and Offline Use
* Responsive Design and Accessibility
* Performance

## How to View

### v1.0

1. Start up a simple HTTP server from this folder to serve up the site fileslocally. Python is a simple option for this. In a terminal window, check to see if you have Python already installed by running `python -V`. If you don't have Python already, head to Python's [website](https://www.python.org/) to download and install the software.

    If you have Python 2.x, start the server with `python -m SimpleHTTPServer 8000`. For Python 3.x, you can use `python3 -m http.server 8000`.

2. With your server running, visit the site: `http://localhost:8000` and explore some restaurants.

3. In Chrome you can open the Console, go to Application / Service Workers, and then check the Offline option to see offline behavior.

### v2.0

1. Clone this repo and the data server repo, which can be found in the mws-restaurant-stage-2-data-server repo.

2. Navigate to both folders in your Terminal editor of choice. 


    Use the command `node install` to install project dependencies require to build.

3. The data server can be started with the command 

    ```node server```
    
    and the application can be built with the command
    
    ```gulp``` or ```npm run start```
    
    which will start the build process for the application and automatically launch it in a browser window when it's complete.
    
    The application will utilize the ports __8080__ for the app itself and __1337__ for the API server.
    
    IndexedDB Promised Library by Jake Archibald can be found [here](https://github.com/jakearchibald/idb)
    
    Logic for the Database Promise object was used from Alexandro Perez's MWS Project Walkthrough [here](https://alexandroperez.github.io/mws-walkthrough/)
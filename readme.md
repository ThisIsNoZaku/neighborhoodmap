#Neighborhood Map


This is a single-page application to help find interesting locations in cities.

The app makes use of the Google Maps and Yelp apis to search and display locations. Front-end databinding is provided by the Knockoutjs library and the backend is a Python Flask sever.

##Usage

The application displays a Google map, with markers for locations while the sidebar displays a list of the names of the locations retrieved from the Yelp web API.

The button at the top of the list can filter the locations based on various categories.

Clicking on either a marker or name in the location list will center the map on that location and display additional information about it.

##Building and Running
###Included vm
This package contains a vagrant environment you can use.

Run
> vagrant up

to start and 
>vagrant ssh

to connect once ready.

###Build
The neighborhood map requires npm, python and pip to find dependencies.

With pip installed, all of the python library requirements can be installed from the requirements.txt file via
> pip install -r requirements.txt

The command
> npm install

will install the javascript project dependencies.

Processing the project files requires grunt. Grunt can be installed via the command:
> npm install -g grunt

Afterward, the command:
> grunt

in the root of the project directory will process resources.

###Run

After building, the built in Flask server can be started using
> python app.py

The app is then accessible at the address 'localhost:5000' in the browser.
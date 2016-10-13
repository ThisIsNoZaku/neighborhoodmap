Neighborhood Map
=

This is a single-page application to help find interesting locations in cities.

The app makes use of the Google Maps and Yelp apis to search and display locations.

Usage
-
The application displays a Google map, with markers for locations while the sidebar displays a list of the names of the locations.

The button at the top of the list can filter the locations based on various categories.

Clicking on either a marker or name in the location list will center the map on that location and display additional information about it.

Building and Running
-
The neighborhood map depends on grunt, npm and the Flask python framework.

All of the python library requirements can be installed from the requirements.txt file via
> pip install -r requirements.txt

The command
> npm install

will install the javascript project dependencies.

After installing the dependencies, the command
> grunt

in the root of the project directory will process resources.

After building, the built in Flask server can be started using
> export FLASK_APP=app.py
> flask run

On Windows, use 'set' instead of 'export'.
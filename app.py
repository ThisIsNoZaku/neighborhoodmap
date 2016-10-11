from flask import Flask, render_template, make_response, jsonify, request
from flask.json import JSONEncoder
from yelp.client import Client
from yelp.obj.business import Business, Category
from yelp.obj.coordinate import Coordinate
from yelp.obj.location import Location
from yelp.oauth1_authenticator import Oauth1Authenticator
from collections import namedtuple
app = Flask(__name__)


yelp_auth = Oauth1Authenticator(
consumer_key = "v7HXwgfkSVovvEXxadr9xQ",
consumer_secret = "foYKIb76HGFUFquB3eVouc3qnaA",
token = "bg7bPvhTJNreJUVww6jEuVZjxziDu7d1",
token_secret = "hxY74UgdGo5SvZBoD5ain8MMfOQ"
)


client = Client(yelp_auth)


@app.route("/data/categories.json")
def categories():
	return app.send_static_file("categories.json")


@app.route("/")
def index():
	return render_template("index.html")


@app.route("/yelp")
def search():
	params = {}
	request_args = request.args.lists()
	for param in request_args:
		params[param[0]] = param[1][0]
	lat = params.pop('latitude')
	lng = params.pop('longitude')
	search = client.search_by_coordinates(lat, lng, **params)
	businesses = []
	for business in search.businesses:
		b = {
			'name' : business.name,
			'display_phone' : business.display_phone,
			'image_url' : business.image_url,
			'location' : {
				'address' : business.location.address,
				'coordinate' : {
					'latitude' : business.location.coordinate.latitude,
					'longitude' : business.location.coordinate.longitude
				},
				'display_address' : business.location.display_address
			},
			'mobile_url' : business.mobile_url,
			'rating_img_url_large' : business.rating_img_url_large,
			'rating_img_url_small' : business.rating_img_url_small,
			'rating_img_url' : business.rating_img_url,
			'snippet_text' : business.snippet_text
		}
		businesses.append(b)

	return jsonify({'businesses' :businesses})

if __name__ == "__main__":
	app.run(debug=True)
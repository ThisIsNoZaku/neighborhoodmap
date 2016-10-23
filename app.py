from flask import Flask, render_template, make_response, jsonify, request
from flask.json import JSONEncoder
from yelp.client import Client
from yelp.obj.business import Business, Category
from yelp.obj.coordinate import Coordinate
from yelp.obj.location import Location
from yelp.oauth1_authenticator import Oauth1Authenticator
from collections import namedtuple
import io
import json

app = Flask(__name__)

# Reading credentials from json https://github.com/Yelp/yelp-python
with io.open('yelp_secret.json') as cred:
    creds = json.load(cred)
    yelp_auth = Oauth1Authenticator(**creds)
    client = Client(yelp_auth)


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
    # The objects returned by the Yelp client aren't serializable
    # by default
    for business in search.businesses:
        b = {
            'name': business.name,
            'id': business.id,
            'display_phone': business.display_phone,
            'image_url': business.image_url,
            'location': {
                'address': business.location.address,
                'coordinate': {
                    'latitude': business.location.coordinate.latitude,
                    'longitude': business.location.coordinate.longitude
                },
                'display_address': business.location.display_address
            },
            'mobile_url': business.mobile_url,
            'rating_img_url_large': business.rating_img_url_large,
            'rating_img_url_small': business.rating_img_url_small,
            'rating_img_url': business.rating_img_url,
            'snippet_text': business.snippet_text
        }
        businesses.append(b)

    return jsonify({'businesses': businesses})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

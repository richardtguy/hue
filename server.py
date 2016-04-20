#!flask/bin/python
# Really simple interface for Philips Hue lights
# By Richard Guy, based on Flask documentation at http://flask.pocoo.org/docs/0.10/quickstart
# v1.0, 6 March 2016

from flask import Flask, render_template
app = Flask(__name__)
app.config['DEBUG'] = False

@app.route('/')
def hue():
	return render_template('index.html')

if __name__ == '__main__':
    print "Starting development server..."
    app.run(host="0.0.0.0")
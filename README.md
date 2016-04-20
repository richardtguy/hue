# hue

hue is a really simple interface for Philips hue lights, developed for fun.

For information on the Philips hue API, see http://www.developers.meethue.com/philips-hue-api.  A developer account must be set up on the hue hub with the username `newdeveloper`.

A Python virtual environment including the flask web server framework should be installed in the app's home directory.

```

$ virtualenv flask
$ flask/bin/pip install flask

```

Executing `server.py` starts a development web server.  Request http://localhost:5000/ from a web browser to use the interface.

The first time the app is requested on a new browser it asks the user to input the local IP address for the hue hub (e.g. 192.168.1.1).

The interface is rendered dynamically using Javascript and styled using CSS.  The script queries the hue hub to identify how many lights are currently registered and provides controls for each to switch lights on/off, change brightness and colour temperature.

The app currently only allows setting of white colour temperature and brightness (not colour).

"""Sensor endpoint for request made with The Things Network webhooks

The api endpoint handles uplink messages from The Things Network (TNN). The data
payload is decoded and inserted into the database. See the following for more
information on TTN integration:
- https://www.thethingsindustries.com/docs/integrations/webhooks/creating-webhooks/.
- https://www.thethingsindustries.com/docs/the-things-stack/concepts/data-formats/.

TODO:
- Integrate downlinks to device to ack the data as successfully inserted into
the db and data can be cleared from local non-volatile storage. See
https://www.thethingsindustries.com/docs/integrations/webhooks/scheduling-downlinks/

Author: John Madden <jmadden173@pm.me>
"""

from flask import request
from flask_restful import Resource

from .util import process_measurement


class Measurement_Upink(Resource):
    def post(self):
        """Handlings uplink POST request from TTN
        
        Raises:
            ValueError if the header Content-Type is not application/json 
        """
        
        content_type = request.headers.get("Content-Type")
        
        # get uplink json 
        if content_type == "application/json":
            uplink_json = request.json
        else:
            raise ValueError("POST request must be application/json")
       
        # get payload 
        payload = uplink_json["uplink_message"]["frm_payload"]
        
        data_json = process_measurement(payload)

        # TODO: Add downlink messages to device 
        
        # return json of measurement
        return data_json
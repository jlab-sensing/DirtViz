from flask import request
from flask_restful import Resource, reqparse
from ..auth.auth import authenticate
from ..database.models.device import Device
from ..database.schemas.post_device import PostDeviceSchema

postDeviceSchema = PostDeviceSchema()

class Device(Resource):
  # restricts access to signed in users
  # affects all endpoints for Device
  # specifically for flask-restful
  method_decorators = [authenticate]

  def post(self, user):
    # {
    #  "device_name": 
    #  "device_second_name":
    # }
    device_data = postDeviceSchema.load(request.json)
    device_name = device_data["name"]
    
    # if Device.find_by_name(device_name):
    #   return {'msg': f"A device with name '{device_name}'
    #            already exists."}

    # new_device = Device(
    #   name = device_name,
    #   user_id = user.id,
    #     )


from flask import request
from flask_restful import Resource
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
    """Endpoint to return api key for new uploading device"""
    device_data = postDeviceSchema.load(request.json)
    device_name = device_data["name"]

    if Device.find_by_name(device_name):
      return {'msg': f"A device with name '{device_name}'
               already exists."}, 400

    new_device = Device(
      name = device_name,
      user_id = user.id,
        )
    new_device.save()
    return {'api_key': new_device.api_key}, 200


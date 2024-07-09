from . import ma
class PostDeviceSchema(ma.SQLAlchemySchema):
    """validates post request for device data"""
    name = ma.Str()

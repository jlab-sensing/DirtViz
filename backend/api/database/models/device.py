from ..models import db
import uuid

class Device(db.Model):
  """Table of devices"""
  __tablename__ = 'devices'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(255))
  api_key = db.column(db.String(255))
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
  user = db.relationship('User', back_populates="devices")


def __init__(self, device_name, user_id, device_key):
  self.name = device_name
  self.user_id = user_id
  self.key = device_key or uuid.uuid4().hex

def json(self):
  return {
    'device_name' : self.name,
    'device_key' : self.key, 
    'user_id' : self.user_id
  }

@classmethod
def find_by_name(cls, device_name):
  return cls.query.filter_by(name = device_name).first()

@classmethod
def find_by_api_key(cls, api_key):
  return cls.query.filter_by(api_key = api_key).first()

def save(self):
  db.session.add(self)
  db.session.commit()

def delete(self):
  db.session.delete(self)
  db.session.commit()


  
# device
# db.session().query('devices', "name=sensor1")
# device.json()
#  {
#  'device_name' : self.name,
#     'device_key' : self.key, 
#     'user_id' : self.user_id
# }
  
  



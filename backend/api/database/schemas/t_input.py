from . import *


class TInput(ma.SQLAlchemySchema):
    type = ma.String()
    cell = ma.String()
    ts = ma.TimeDelta(precision="microseconds")
    vwc = ma.Float()
    raw_vwc = ma.Float()
    temp = ma.Float()
    ec = ma.Float()

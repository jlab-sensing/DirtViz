from flask import request, jsonify
from flask_restful import Resource
import pandas as pd
from ..database.schemas.get_cell_data_schema import GetCellDataSchema
from ..database.models.power_data import PowerData
from ..database.models.teros_data import TEROSData

get_cell_data = GetCellDataSchema()


class Cell_Data(Resource):
    def get(self, cell_id=0):
        # {
        #     "ec": [
        #         "50.0000000000000000"
        #     ],
        #     "i": [],
        #     "p": [],
        #     "temp": [
        #         300.0
        #     ],
        #     "timestamp": [],
        #     "v": [],
        #     "vwc": [
        #         -7.383168300000001
        #     ]
        # }
        v_args = get_cell_data.load(request.args)
        teros_data = pd.DataFrame(
            TEROSData.get_teros_data_obj(
                cell_id, start_time=v_args["startTime"], end_time=v_args["endTime"]
            )
        )
        power_data = pd.DataFrame(
            PowerData.get_power_data_obj(
                cell_id, start_time=v_args["startTime"], end_time=v_args["endTime"]
            )
        )

        res = pd.merge(teros_data, power_data, on="timestamp", how="outer").fillna("")

        print("teros", teros_data, flush=True)
        print("power", power_data, flush=True)
        print("res", res, flush=True)
        return jsonify(res.to_dict(orient="records"))

    def post(self):
        pass

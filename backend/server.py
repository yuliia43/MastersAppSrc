# Import flask and datetime module for showing date and time
import time

import flask
from flask import Flask, jsonify, request
import datetime
from flask_cors import CORS
import logging
import os
from flask_sqlalchemy import SQLAlchemy

# from azure.storage.blob import BlobClient, BlobServiceClient, ResourceTypes, AccountSasPermissions, generate_account_sas


x = datetime.datetime.now()
  
# Initializing flask app
app = Flask(__name__)

CORS(app)

handler = logging.FileHandler("test.log")  # Create the file logger
app.logger.addHandler(handler)             # Add it to the built-in logger
app.logger.setLevel(logging.DEBUG)         # Set the log level to debug

base_name = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_name, 'test.db')
db = SQLAlchemy(app)


class JSONModelFile(db.Model):
    __tablename__ = 'JSONModelFile'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_name = db.Column(db.String(100), nullable=False)
    model_description = db.Column(db.String(300), nullable=False)
    link = db.Column(db.String(200), nullable=False)
    # training_models = db.relationship("TrainingModel", backref="JSONModelFile", lazy=True)


class TrainingModel(db.Model):
    __tablename__ = 'TrainingModel'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_name = db.Column(db.String(100), nullable=False)
    model_description = db.Column(db.String(300), nullable=False)
    json_model_file_id = db.Column(db.Integer, db.ForeignKey('JSONModelFile.id'))
    model_weights_path = db.Column(db.String(200))
    training_graphics_path = db.Column(db.String(200))
    training_metadata = db.Column(db.String(200))
    no_disease_precision = db.Column(db.Float())
    val_no_disease_precision = db.Column(db.Float())
    accuracy = db.Column(db.Float())
    val_accuracy = db.Column(db.Float())
    completeness = db.Column(db.Float(), default=0)

    json_model = db.relationship("JSONModelFile", backref="TrainingModel")
    classes = db.relationship('ModelClasses', backref="TrainingModel", lazy=True)



class ModelClasses(db.Model):
    __tablename__ = 'ModelClasses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    model_file_id = db.Column(db.Integer, db.ForeignKey('TrainingModel.id'))
    class_id = db.Column(db.Integer, nullable=False)
    class_value = db.Column(db.Integer, nullable=False)

with app.app_context():
    db.create_all()


class Model:
  def __init__(self, id, model_name, model_json, model_weights, model_graphics, accuracy, well_accuracy, tr_precision, val_precision):
    self.id = id
    self.model_name = model_name
    self.model_json = model_json
    self.model_weights = model_weights
    self.model_graphics = model_graphics
    self.accuracy = accuracy
    self.well_accuracy = well_accuracy
    self.tr_precision = tr_precision
    self.val_precision = val_precision
    def serialize(self):
        return {
            'id': self.id, 
            'model_name': self.model_name,
            'model_json': self.model_json,
            'model_weights': self.model_weights,
            'model_graphics': self.model_graphics,
            'accuracy': self.accuracy,
            'well_accuracy': self.well_accuracy,
            'tr_precision': self.tr_precision,
            'val_precision': self.val_precision
        }


m1 = Model(1, "Kytsiatko", "json", 60, 1, 100, 101, 102,103)
m2 = Model(2, "Kriatsiatko", "json", 3.5, 1, 100, 101, 102,103)
models_list = [m1.__dict__, m2.__dict__]

# files = [(f"meta_{mid}.json", "training-data"),
#          (f"model_{mid}.json", "jsons"),
#          (f"model_{mid}.h5", "weights"),
#          (f"model_train_graphics_{mid}.pdf", "training-data")]

# def save_model(file_path, container):
#     connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
#
#     # Create the BlobServiceClient object
#     blob_service_client = BlobServiceClient.from_connection_string(connect_str)
#
#     sas_token = generate_account_sas(
#                 blob_service_client.account_name,
#                 account_key=blob_service_client.credential.account_key,
#                 resource_types=ResourceTypes(object=True),
#                 permission=AccountSasPermissions(read=True, create=True, write=True),
#                 expiry=datetime.utcnow() + datetime.timedelta(hours=1)
#             )
#     sas_url = f"https://databricksstorageyul.blob.core.windows.net/{container}/{file_path}?{sas_token}"
#
#     client = BlobClient.from_blob_url(sas_url)
#
#     with open(file_path, mode="rb") as data:
#         client.upload_blob(data)


class Prediction:
  def __init__(self, id, disease, percentage):
    self.id = id
    self.desease = disease
    self.percentage = percentage  
  
# Route for seeing a data
@app.route('/')
def get_models():
    models_list = TrainingModel.query.all()
    dict_list = []
    for model in models_list:
        needed_dict = model.__dict__
        needed_dict.pop('_sa_instance_state')
        json_model = db.session.query(JSONModelFile).filter(JSONModelFile.id == model.json_model_file_id).one()
        json_model_dict = json_model.__dict__
        json_model_dict.pop('_sa_instance_state')
        needed_dict["json_model"] = json_model_dict
        dict_list.append(needed_dict)


    response = jsonify(dict_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/create', methods=['GET', 'POST'])
def createModel():
    if flask.request.method == 'GET':
        models_list = JSONModelFile.query.all()
        dict_list = []
        for model in models_list:
            needed_dict = model.__dict__
            needed_dict.pop('_sa_instance_state')
            dict_list.append(needed_dict)

        response = jsonify(dict_list)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        # name = request.form.get('model_name')
        # description = request.form.get('model_description')
        name="name"
        description="description"
        model_json_name = request.form.get('json_name')
        model_json_descr = request.form.get('json_description')

        # model_json_name = "name"
        # model_json_descr = "descr"

        app.logger.error(request.form)
        model_json = None
        model_weights = None
        # try:
        #     model_jsonF= request.files['model_json']
        #     model_weightsF = request.files['model_weights']
        #     model_json = name + '.json'
        #     model_weights = name + '.strange'
        #     model_jsonF.save(os.path.join(app.root_path, 'static', 'jsons', model_json))
        #     model_weightsF.save(os.path.join(app.root_path, 'static', 'jsons', model_weights))
        # except Exception as e:
        #     print(f"Couldn't upload file {e}")


        model_weightsF = request.files['model_weights_path']
        model_json = name + '.json'
        model_weights = name + '.h5'
        model_weightsF.save(os.path.join(app.root_path, 'static', 'jsons', model_weights))


        json_id = 3
        # request.files.get("json_model_id")
        app.logger.error(json_id)
        if request.files.get('json_model') is None:
            model_jsonF = request.files['json_model']
            model_jsonF.save(os.path.join(app.root_path, 'static', 'jsons', model_json))
            new_model_json = JSONModelFile(model_name=model_json_name, model_description=model_json_descr,
                                           link="link")

            try:
                db.session.add(new_model_json)
                db.session.commit()

                app.logger.error("json " + str(new_model_json))
            except Exception as e:
                app.logger.error(e)

            json_id = new_model_json.id

        new_model = TrainingModel(model_name=name, model_description=description,
                                  json_model_file_id=json_id,
                                  model_weights_path=model_weights, completeness=100)

        # id = db.Column(db.Integer, primary_key=True)
        # model_name = db.Column(db.String(100), nullable=False)
        # model_description = db.Column(db.String(300), nullable=False)
        # json_model_file_id = db.Column(db.Integer, db.ForeignKey('json_model.id'))
        # model_weights_path = db.Column(db.String(200))
        # training_graphics_path = db.Column(db.String(200))
        # training_metadata = db.Column(db.String(200))
        # no_disease_precision = db.Column(db.Float())
        # val_no_disease_precision = db.Column(db.Float())
        # accuracy = db.Column(db.Float())
        # val_accuracy = db.Column(db.Float())
        # completeness = db.Column(db.Float(), default=0)

        try:
            db.session.add(new_model)
            db.session.commit()

            app.logger.error("json " + str(new_model))
            return 'Done', 201
        except Exception as e:
            app.logger.error(e)
            return 'There was an issue adding the model'

        app.logger.error(request)
        m3 = Model(3, name, model_json, val_p, model_weights, 100, 101, 102,103)
        models_list.append(m3.__dict__)
        return 'Done', 201
  

@app.route('/predict/', methods=['POST'])
def predictModel():
    id = request.form.get('id')
    app.logger.error("post" + id)

    p1 = Prediction(1, "gryp", "50")
    p2 = Prediction(2, "covid", "40")
    p3 = Prediction(3, "Hvist_bolyt", "10")
    predictions = [p1.__dict__, p2.__dict__, p3.__dict__]

    classes = db.session.query(ModelClasses).filter(ModelClasses.model_file_id == id).order_by(ModelClasses.class_id).all()

    percentages = [33.99175, 0, 0,  24.49232,   8.360991,   15.184613,
      0,  7.9534119, 0,  9.6158526, 0,  3.4010615]

    predictions = []

    for i, disease in enumerate(classes):
        predictions.append({"id": i, "desease": disease.class_value, "percentage": percentages[i]})

    predictions.sort(key=lambda item: item["percentage"], reverse=True)

    response = jsonify(predictions)
    response.headers.add('Access-Control-Allow-Origin', '*')
    time.sleep(4)
    return response

@app.route('/predict/<id>', methods=['GET'])
def predict_model_from_id(id):

    app.logger.error("get" + str(request.args.get('id')))
    return {request.args.get('id')}

      
# Running app
if __name__ == '__main__':
    os.environ["FLASK_APP"] = "server.py"  # your python file name
    app.run(host="0.0.0.0", debug=True)
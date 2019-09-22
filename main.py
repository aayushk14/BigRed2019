import os
import pymongo
from flask import Flask, request, g, Response, jsonify, abort
import pymongo
app = Flask(__name__)
import json
from json import dumps, loads
from watson_developer_cloud import VisualRecognitionV3
import ibm_watson

service = ibm_watson.AssistantV2(iam_apikey='A2_DfSX1M7IFKssrwZMiySrp4KVeRYVCa5rCcUufdXOo',version='2019-02-28',url='https://gateway.watsonplatform.net/assistant/api')
session = service.create_session(assistant_id='b81e97e1-9d6f-4241-9893-10f10bfcd3b2').get_result()

visual_recognition = VisualRecognitionV3('2018-03-19',iam_apikey='ZO5-_DeB-CBGbTonbCy1IOfwAioq1mAn0m-Ccly3QSkh')
client = pymongo.MongoClient("mongodb+srv://cornell_hack:cornell@cluster0-cpodz.mongodb.net/test?retryWrites=true&w=majority")
db_name = client.cornell_DB
qnaCollection = db_name.qna

def db_util(qry):
    # client = pymongo.MongoClient("mongodb+srv://cornell_hack:cornell@cluster0-cpodz.mongodb.net/test?retryWrites=true&w=majority")
    # db_name = client.cornell_DB
    # qnaCollection = db_name.qna
    query = {"class": qry}
    question = qnaCollection.find_one(query)
    print("got response from mongo:",type(question))
    print("val check----:",question['questions'])
    return question['questions']
    #return Response(json.dumps(str(question['questions'])), status=200, mimetype='application/json')

@app.route("/api/v1/text/predict/", methods=["POST"])
def classify_text():
    params = request.get_json()
    chat_text = params.get('text')
    print("chat side:",chat_text,type(chat_text))
    bot_reply = service.message(assistant_id='b81e97e1-9d6f-4241-9893-10f10bfcd3b2',session_id=session['session_id'],input={'message_type': 'text','text': chat_text }).get_result()
    bot_reply = bot_reply['output']['generic'][0]['text']
    qnaCollection.insert_one({"questions":bot_reply,"answers":chat_text})
    #return Response(json.dumps(bot_reply), status=200, mimetype='application/json')
    return dumps(bot_reply)

@app.route("/api/v1/image/predict/", methods=["POST"])
def predict():
    params = request.get_json()
    image = params.get('image')
    image_ = './test.jpg'
    with open(image_, 'rb') as images_file:
        classes = visual_recognition.classify(
            images_file,
            threshold='0.6',
        classifier_ids='CasualityModel_222197479').get_result()
    #print(json.dumps(classes, indent=2))
    res = classes['images'][0]['classifiers'][0]['classes']
    if not res:
        print("others")
        topic = "others"
        #print(json.dumps(classes['images'][0]['classifiers'][0]['classes'][0]['class'], indent=2))
    else:
        print(json.dumps(res[0]['class'], indent=2))
        topic = res[0]['class']
    #return dumps(db_util(topic))
    return Response(json.dumps(db_util(topic)), status=200, mimetype='application/json')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

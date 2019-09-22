import json
from watson_developer_cloud import VisualRecognitionV3

visual_recognition = VisualRecognitionV3('2018-03-19',iam_apikey='ZO5-_DeB-CBGbTonbCy1IOfwAioq1mAn0m-Ccly3QSkh')

with open('./kitty.jpg', 'rb') as images_file:
    classes = visual_recognition.classify(
        images_file,
        threshold='0.6',
	classifier_ids='CasualityModel_222197479').get_result()
#print(json.dumps(classes, indent=2))
res = classes['images'][0]['classifiers'][0]['classes']
if not res:
	print("others")
	#print(json.dumps(classes['images'][0]['classifiers'][0]['classes'][0]['class'], indent=2))
else:
	print(json.dumps(res[0]['class'], indent=2))
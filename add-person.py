import json
import sys

#assert len(sys.argv)>1 , "not all arguments are specified"

with open("temp.json") as fs:
    person_form = json.load(fs)

#inputStr='{"Name-Details":"TestName","Degree":"Studying M.Sc. Robotics, Cognition, Intelligence","Consent-Approval":{"I agree":true}}'  
#person_form= json.loads(inputStr)

person= {
    "name": person_form["Name-Details"],
    "img": "lol",
    "job": person_form["Degree"]
}
print(person)

with open("people.json") as fs:

    data=json.load(fs)

    nameList = [item["name"] for item in data]

    assert not person["name"] in nameList, "The name is already in the List"
        
    data.append(person)


with open("people.json","w") as fs:
    json.dump(data,fs)
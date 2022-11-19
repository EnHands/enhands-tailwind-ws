import json
import sys

 
assert len(sys.argv)>3 , "not all arguments are specified"

person={"name": sys.argv[1],
        "img": sys.argv[2],
        "job": sys.argv[3]
        }

with open("people.json") as fs:

    data=json.load(fs)

    nameList = [item["name"] for item in data]

    assert not person["name"] in nameList, "The name is already in the List"
        
    data.append(person)


with open("people.json","w") as fs:
    json.dump(data,fs)
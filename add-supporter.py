import json
import sys
import re

#assert len(sys.argv)>1 , "not all arguments are specified"
def main():
    with open("temp.json", encoding="utf-8") as fs:
        supporter_form = json.load(fs)

    #inputStr='{"Name-Details":"TestName","Degree":"Studying M.Sc. Robotics, Cognition, Intelligence","Consent-Approval":{"I agree":true}}'  
    #person_form= json.loads(inputStr)

    extr = supporter_form["Profile-Picture"]

    pattern  = r"\((https:.*?)\)"
    match = re.search(pattern, extr)

    assert match is not None , "Profile Picture not specified"


    supporter= {
        "name": supporter_form["Name-Details"],
        "img": match.group(1),
        "tier": supporter_form["Tier"]
    }
    print(supporter)

    with open("supporter.json", encoding="utf-8") as fs:

        data=json.load(fs)

        nameList = [item["name"] for item in data]

        assert not supporter["name"] in nameList, "The name is already in the List"
            
        data.append(supporter)


    with open("supporter.json","w", encoding="utf-8") as fs:
        json.dump(data,fs,indent=4,ensure_ascii=False)

    filename= "New Supporter"
    print(filename)
    with open(filename,"w") as fs:
        fs.write(str(supporter["name"]))
    

    filename = "BranchName"
    with open(filename,"w") as fs:
        branch=str(supporter["name"])
        branch=branch.lower()
        branch=branch.replace(" ","-")
        fs.write(branch)

if __name__ == "__main__":
    main()

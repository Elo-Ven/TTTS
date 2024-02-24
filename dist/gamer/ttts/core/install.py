#from chardet.universaldetector import UniversalDetector
import os

print(" ____  ____  ____  ____ ")
print("(_  _)(_  _)(_  _)/ ___)")
print("  )(    )(    )(  \___ \\")
print(" (__)  (__)  (__) (____/")
print("  Twine Text To Speech")
print("")
print("")

print("Beginning installation...")
print("")

oldStr = "</head>"
newStr = "<script src='ttts/core/ttts.js'></script></head>"
source = "..\example.html"
output = "..\example-ttts.html"
ext1 = ".html"
ext2 = "-ttts.html"
gameDir = "../"

# Find available html files
directory = os.fsencode(gameDir)
files = []

for file in os.listdir(directory):
     filename = os.fsdecode(file)
     if filename.endswith(".html"): 
         files.append(filename)
         continue
     else:
         continue

#ask which file to use, unless there is only 1 html file
fileCount = len(files)
if fileCount > 1:
    for i, filename in enumerate(files):
        print(str(i+1)+". "+filename)
    print("Enter the number in the list of the file you want to mod:")
    fileKey = int(input("Number:"))
    srcName = files[fileKey-1]
elif fileCount == 1:
    srcName = files[0]
else:
    print("Enter the name of the main html file. This will often be mygame.html")
    srcName = input("The games html filename:")
    
#set the modded game filename
source = gameDir + srcName
output = source.replace(ext1, ext2)

#check if game file exists
print("")
print("Fetching game file...")
if os.path.isfile(source):
    print("Game file found:")
    print(source)
else:
    print("Couldn't find source game file:")
    print(source)
    print("")
    print("Installation failed...")
    quit()

#read the game file
f = open(source,"r",encoding='utf-8')
filedata = f.read()
f.close()

#append a script tag that will run TTTS when the game runs
print("")
print("Importing TTTS...")
newdata = filedata.replace(oldStr,newStr)

#save the modded version of the game to a new file and leave the main file intact
print("Saving modded game file...")
f = open(output,'w',encoding='utf-8')
f.write(newdata)
f.close()

#extra info
print("")
print("Installation complete...")
print("")
print("Open the game using this file: ")
print(output)
print("")

input("Press Enter to continue...")
quit()
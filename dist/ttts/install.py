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

oldStr = "</body>"
newStr = "<script src='ttts/ttts-config.js'></script></body>"
source = "..\example.html"
output = "..\example-mod.html"
ext1 = ".html"
ext2 = "-mod.html"

# f = open(source,"rb")
# detector = UniversalDetector()
# for line in f.readlines():
#     detector.feed(line)
#     if detector.done: break
# detector.close()
# print(detector.result)

directory_in_str = "../"

directory = os.fsencode(directory_in_str)
files = []

for file in os.listdir(directory):
     filename = os.fsdecode(file)
     if filename.endswith(".html"): 
         files.append(filename)
         continue
     else:
         continue
     
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
    

source = "..\\" + srcName
output = source.replace(ext1, ext2)

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


f = open(source,"r",encoding='utf-8')
filedata = f.read()
f.close()

print("")
print("Importing TTTS...")
newdata = filedata.replace(oldStr,newStr)

print("Saving modded game file...")
f = open(output,'w',encoding='utf-8')
f.write(newdata)
f.close()

print("")
print("Installation complete...")
print("")
print("Open the game using this file: ")
print(output)
print("")

input("Press Enter to continue...")
quit()
import urllib.request
data = urllib.request.urlopen("https://www.py4e.com/code3/mbox.txt").read()
for i in data:
    print(i)
    
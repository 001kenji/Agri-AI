import requests
import json

url = "https://4f61-35-230-37-10.ngrok-free.app/generate/"

payload = json.dumps({
  "prompt": "green car"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

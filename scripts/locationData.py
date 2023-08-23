import requests
import json
import csv

BASE_URL = "https://api.geoapify.com/v1/geocode/reverse"
API_KEY = "9af042e933394b75a204e8bfa1c87bc3"

errors = []

def reverse_geolocate(lat, lon):
    response = requests.get(f"{BASE_URL}?lat={lat}&lon={lon}&apiKey={API_KEY}")
    if response.status_code == 200:
        data = response.json()
       
        properties = data['features'][0]['properties']
        country = properties.get('country', '')
        state = properties.get('state', '')
        suburb = properties.get('suburb', '')
        town = properties.get('town', '')
        village = properties.get('village', '')
        city = properties.get('city', '')
        street = properties.get('street', '')
        number = properties.get('housenumber', '')
        neighbourhood = properties.get('neighbourhood', '')
        district = properties.get('district', '')
        postcode = properties.get('postcode', '')

        location = {
            'country': country,
            'state': state,
            'suburb': suburb or town or village or city,
            'street': street,
            'number': number,
            'neighbourhood': neighbourhood or district,
            'postcode': postcode or ''
        }

        return location

    else:
        global errors
        errors.append(f"{response.status_code}: {response.text}")
        print("Failed to reverse geolocate. Status code:", response.status_code)
        print("Error:", response.text)

def count_csv_lines():
    line_count = 0
    with open('listings.csv', 'r', newline='', encoding='utf8') as csvfile:
        csvreader = csv.reader(csvfile)
        for _ in csvreader:
            line_count += 1
    return line_count

def main():
    locations = []
    rowCount = count_csv_lines()

    with open('listings.csv', newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)
        count = 0

        for row in reader:
            room_id = row['id']
            latitude = row['latitude']
            longitude = row['longitude']

            location = reverse_geolocate(latitude, longitude)
            if location:
                print(location)
                location['room_id'] = room_id
                locations.append(location)

            count += 1
            print(f"{count}/{rowCount-1}")

    with open('locations.json', 'w') as jsonfile:
        json.dump(locations, jsonfile, indent=4)

    print("------------------Errors------------------")
    for error in errors:
        print(error)


if __name__ == "__main__":
    main()
import requests
import csv

# Replace 'your_spring_boot_app_url' with the base URL of your Spring Boot application
BASE_URL = 'https://localhost:8443/api/room/registerRoom'

csv_file = 'listings.csv'

JWT_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoidGFraXMiLCJpYXQiOjE2OTAyOTYwMzEsInJvbGVzIjoidGVuYW50IGluYWN0aXZlLWhvc3QifQ.kDjK-R3ZNSR4Wzra6PoV7jWul3mapWVjIUGYCDIVVDyakLansn3n4LaI4kEHRgFUUS-WlfMbxhlDIo2iN0moVHHaU_KaNxGSkVHl7S-C3YjD2he0KzSLv_dzOGCCuBlDRe2iOtDQLwyoMI7HY5cDPPFphCawfclhWefiI51s4tuBgFUd-k5Yc3xB-yFqRpS6h_nh3qu-Sm0GLrnAWq8XRQYy9gPyGmeu4V0ilQw_1DHWNpi6ofjQeB-8LqdYJH2mYz5HQdLzmypXgvjxvsO1bwon5VbU9SsJiVGG4Rl5GvReb4waJAnvnuclYMXUlbPx4hObiDQ2yWTfObnBSFizIw'

def extract_data_from_csv(file_path):
    data_list = []
    with open(file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            # Validate and convert double values to integers if possible
            try:
                numOfBeds = int(float(row['beds']))
                numOfBaths = int(float(row['bathrooms']))
                numOfBedrooms = int(float(row['bedrooms']))
                surfaceArea = 35
            except ValueError:
                # Skip the row with invalid values
                print("Skipping row with invalid values:", row)
                continue

            # Handle empty or missing description
            description = row['description'] if row['description'] else "No description available"

            data = {
                'nBeds': numOfBeds,
                'nBaths': numOfBaths,
                'nBedrooms': numOfBedrooms,
                'surfaceArea': surfaceArea,
                'description': description,
                'amenityIDs': []
                # Add other attributes as needed
            }
            data_list.append(data)
    return data_list

def add_rooms_to_backend(data_list):
    headers = {'Authorization': f'Bearer {JWT_TOKEN}'}
    for data in data_list:
        response = requests.post(BASE_URL, headers=headers, json=data, verify=False)
        if response.status_code == 200:
            print("Room added successfully:", response.json())
        else:
            print("Failed to add room. Status code:", response.status_code)
            print("Error: ", response.text)

if __name__ == "__main__":
    extracted_data = extract_data_from_csv(csv_file)
    add_rooms_to_backend(extracted_data)
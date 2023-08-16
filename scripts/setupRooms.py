import mysql.connector
import datetime
import csv
import re

current_date = datetime.datetime.now()
dates = [current_date + datetime.timedelta(days=x) for x in range(11)]

def disable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    connection.commit()

def enable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    connection.commit()

def delete_rooms(connection):
    print("-- Deleting Rooms --")

    cursor = connection.cursor()
    cursor.execute("DELETE FROM rooms")
    connection.commit()
    cursor.close()

def delete_availability(connection):
    print("-- Deleting Availability --")

    cursor = connection.cursor()
    cursor.execute("DELETE FROM availability")
    connection.commit()
    cursor.close()

def insert_listings(connection, csv_file):
    cursor = connection.cursor()
    print("-- Inserting Listings --")

    with open(csv_file, newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)
        count = 0

        for row in reader:
            room_id = row['id']
            accommodates = row['accommodates']
            address = row['street']
            city = row['city']
            country = row['country']
            description = row['description']
            extra_cost_per_tenant = re.search(r'\d+\.\d+', row['extra_people']).group()
            latitude = row['latitude']
            longitude = row['longitude']
            max_tenants = row['guests_included']
            minimum_stay = row['minimum_nights']
            name = row['name']
            neighborhood = row['neighbourhood_cleansed']
            neighborhood_overview = row['neighborhood_overview']
            notes = row['notes']
            num_of_baths = row['bathrooms'] if row['bathrooms'] else 0
            num_of_bedrooms = row['bedrooms'] if row['bedrooms'] else 0
            num_of_beds = row['beds'] if row['beds'] else 0
            price_per_night = re.search(r'\d+\.\d+', row['price']).group()
            rules = 'No rules'
            state = row['state']
            summary = row['summary']
            surface_area = row['square_feet'] if row['square_feet'] else 0
            transit_info = row['transit']
            zipcode = row['zipcode']

            # Foreign keys
            room_host_id = row['host_id']
            thumbnail = 'default-room'

            room_type = row['room_type']
            if room_type == 'Entire home/apt':
                room_type = 'Entire home'
            
            cursor.execute(f"SELECT room_type_id FROM room_types WHERE lower(name) LIKE LOWER('%{room_type}%');")
            result = cursor.fetchone()
            room_type_id = result[0]
            
            insert_query = """
                INSERT INTO rooms (
                    room_id, accommodates, address, city, country,
                    description, extra_cost_per_tenant, latitude,
                    longitude, max_tenants, minimum_stay, name,
                    neighborhood, neighborhood_overview, notes,
                    num_of_baths, num_of_bedrooms, num_of_beds,
                    price_per_night, rules, state, summary,
                    surface_area, transit_info, zipcode, room_host_id,
                    thumbnail_image_identifier, room_type_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """

            availability_query = "INSERT INTO availability (availability_id, room_id, date) VALUES (%s, %s, %s)"

            try:
                cursor.execute(insert_query, (
                    room_id, accommodates, address, city, country,
                    description, extra_cost_per_tenant, latitude,
                    longitude, max_tenants, minimum_stay, name,
                    neighborhood, neighborhood_overview, notes,
                    num_of_baths, num_of_bedrooms, num_of_beds,
                    price_per_night, rules, state, summary,
                    surface_area, transit_info, zipcode, room_host_id,
                    thumbnail, room_type_id
                ))

                for date in dates:
                    count += 1
                    cursor.execute(availability_query, (count, room_id, date))

                connection.commit()  # Commit the transaction after successful insertion
            except mysql.connector.Error as e:
                print(f"Error inserting room with id {room_id}: {e}")
                connection.rollback()  # Rollback the transaction if an error occurs


    connection.commit()
    cursor.close()

if __name__ == "__main__":
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='admin',
            password='1234',
            database='db_bookify'
        )
        disable_foreign_key_checks(connection)

        delete_availability(connection)
        delete_rooms(connection)


        connection.cursor().execute("SET AUTOCOMMIT = 0;")
        connection.cursor().execute("set global innodb_flush_log_at_trx_commit=2;")

        insert_listings(connection, 'listings.csv')
        enable_foreign_key_checks(connection)
        connection.close()

    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
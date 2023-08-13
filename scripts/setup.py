import mysql.connector
import csv
from datetime import datetime

guid = 0
usernames = set()

def disable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    connection.commit()

def enable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    connection.commit()

def check_user_exists(connection, user_id):
    cursor = connection.cursor()

    # Check if a user with the same user ID already exists
    query = "SELECT COUNT(*) FROM users WHERE app_user_id = %s"
    values = (user_id,)
    cursor.execute(query, values)
    result = cursor.fetchone()

    cursor.close()

    return result[0] > 0

def createUniqueUsername(connection, username):
    # Check if a user with the same user username already exists
    global usernames

    if username in usernames:
        global guid
        guid += 1
        return username + str(guid)
    else: 
        return username

def delete_users(connection):    
    cursor = connection.cursor()

    delete_query = "DELETE FROM users WHERE username <> 'admin'"
    cursor.execute(delete_query)
    connection.commit()

    cursor.close()

def delete_reviews(connection):
    cursor = connection.cursor()

    delete_query = "DELETE FROM reviews"
    cursor.execute(delete_query)
    connection.commit()

    cursor.close()

def insert_users_from_csv(connection, csv_file):
    cursor = connection.cursor()
    print("-- Inserting Review Users --")

    with open(csv_file, newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            id = row['reviewer_id']
            username = row['reviewer_name']

            if check_user_exists(connection, id): continue

            global usernames
            usernames.add(username)

            insert_query = "INSERT INTO users (app_user_id, username, password) VALUES (%s, %s, %s)"
            values = (id, createUniqueUsername(connection, username), '1234')

            try:
                cursor.execute(insert_query, values)
            except mysql.connector.Error as e:
                print(f"Error inserting user {username} with id {id}: {e}")
                connection.rollback()

    connection.commit()
    cursor.close()

def insert_host_users(connection):
    cursor = connection.cursor()
    print("-- Inserting Host Users --")

    with open('listings.csv', newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            id = row['host_id']
            username = row['host_name']

            if check_user_exists(connection, id): continue

            global usernames
            usernames.add(username)

            insert_query = "INSERT INTO users (app_user_id, username, password) VALUES (%s, %s, %s)"
            values = (id, createUniqueUsername(connection, username), '1234')

            try:
                cursor.execute(insert_query, values)
            except mysql.connector.Error as e:
                print(f"Error inserting user {username} with id {id}: {e}")
                connection.rollback()

    connection.commit()
    cursor.close()

def insert_listings(connection, csv_file):
    cursor = connection.cursor()
    print("-- Inserting Listings --")

    with open(csv_file, newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            room_id = row['id']
            accomodates = row['accommodates']
            address = row['street']
            city = row['city']
            country = row['country']
            description = row['description']
            extra_cost_per_tenant = row['extra_people']
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
            price_per_night = row['price']
            rules = 'No rules'
            state = row['state']
            summary = row['summary']
            surface_area = row['square_feet'] if row['square_feet'] else 0
            transit_info = row['transit']
            zipcode = row['zipcode']

            # Foreign keys
            room_host_id = row['host_id']
            thumbnail = 'default-room'
            #TODO: Add room type id

            insert_query = """
                INSERT INTO rooms (
                    room_id, accomodates, address, city, country,
                    description, extra_cost_per_tenant, latitude,
                    longitude, max_tenants, minimum_stay, name,
                    neighborhood, neighborhood_overview, notes,
                    num_of_baths, num_of_bedrooms, num_of_beds,
                    price_per_night, rules, state, summary,
                    surface_area, transit_info, zipcode, room_host_id,
                    thumbnail_image_identifier
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """ 

            try:
                cursor.execute(insert_query, (
                    room_id, accomodates, address, city, country,
                    description, extra_cost_per_tenant, latitude,
                    longitude, max_tenants, minimum_stay, name,
                    neighborhood, neighborhood_overview, notes,
                    num_of_baths, num_of_bedrooms, num_of_beds,
                    price_per_night, rules, state, summary,
                    surface_area, transit_info, zipcode, room_host_id,
                    thumbnail
                ))
            except mysql.connector.Error as e:
                print(f"Error inserting room with id {id}: {e}")
                connection.rollback()

    connection.commit()
    cursor.close()

def insert_reviews(connection, csv_file):
    cursor = connection.cursor()
    print("-- Inserting Reviews --")

    with open(csv_file, newline='', encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            review_id = row['id']
            comment = row['comments']
            stars = 4
            reviewer_app_user_id = row['reviewer_id']
            room_id = row['listing_id']
            rawDate = row['date']
            date = datetime.strptime(rawDate, '%Y-%m-%d').date()
            reviwer_visited_room = False

            insert_query = "INSERT INTO reviews (review_id, comment, stars, reviewer_app_user_id, room_id, date, reviewer_visited_room) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values = (review_id, comment, stars, reviewer_app_user_id, room_id, date, reviwer_visited_room)

            try:
                cursor.execute(insert_query, values)
            except mysql.connector.Error as e:
                print(f"Error inserting review with id {review_id}: {e}")
                connection.rollback()

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
        delete_users(connection)
        delete_reviews(connection)
        connection.cursor().execute("SET AUTOCOMMIT = 0;")
        connection.cursor().execute("set global innodb_flush_log_at_trx_commit=2;")

        insert_users_from_csv(connection, 'reviews.csv')
        insert_host_users(connection)
        insert_reviews(connection, 'reviews.csv')
        enable_foreign_key_checks(connection)
        connection.close()
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
import pandas as pd
import mysql.connector

# Credentials
MYSQL_HOST = 'localhost'
MYSQL_DATABASE = 'db_bookify'
MYSQL_USER = 'admin'
MYSQL_PASSWORD = '1234'

def insert_room_data_to_db(room_data):
    # Establish a connection to the MySQL database
    con = mysql.connector.connect(
        host=MYSQL_HOST,
        database=MYSQL_DATABASE,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )
    cursor = con.cursor()

    try:
        for _, row in room_data.iterrows():
            # Extract data from CSV
            num_of_beds = row['beds']
            num_of_baths = row['bathrooms']
            num_of_bedrooms = row['bedrooms']
            surface_area = 35
            description = row['description']

            # TODO: Add code to insert other attributes like amenities, photos, etc.

            insert_query = (
                "INSERT INTO rooms (num_of_beds, num_of_baths, num_of_bedrooms, surface_area, description) "
                "VALUES (%s, %s, %s, %s, %s)"
            )
            data = (num_of_beds, num_of_baths, num_of_bedrooms, surface_area, description)
            cursor.execute(insert_query, data)

        con.commit()
        print("Data insertion completed.")
    except Exception as e:
        print("Error:", e)
        con.rollback()
    finally:
        con.close()

def main():
    csv_file = 'listings.csv'
    room_data = pd.read_csv(csv_file)
    insert_room_data_to_db(room_data)

if __name__ == "__main__":
    main()
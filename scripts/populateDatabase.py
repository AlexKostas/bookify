import mysql.connector
from setup import delete_users, delete_reviews, get_role_ids, insert_users_from_csv, insert_host_users, insert_reviews
from setupRooms import delete_rooms, delete_availability, load_location_data, insert_listings

def disable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    connection.commit()

def enable_foreign_key_checks(connection):
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    connection.commit()


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
        delete_availability(connection)
        delete_rooms(connection)

        load_location_data()

        connection.cursor().execute("SET AUTOCOMMIT = 0;")
        connection.cursor().execute("set global innodb_flush_log_at_trx_commit=2;")

        tenant_role_id, host_role_id = get_role_ids(connection)
        insert_users_from_csv(connection, tenant_role_id, 'reviews.csv')
        insert_host_users(connection, host_role_id)
        insert_reviews(connection, 'reviews.csv')

        insert_listings(connection, 'listings.csv')

        enable_foreign_key_checks(connection)
        connection.close()
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
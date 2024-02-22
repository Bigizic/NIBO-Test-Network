#!/bin/bash
# bash script to create mysql database 'NIBO_TEST_NETWORK' for user entered by client

DB_HOST="localhost"

read -p "Enter MYSQL user: " DB_USER
read -sp "Enter MYSQL user password: " TEMP_PASS
echo

read -sp "confirm password: " DB_PASS
echo

count=3
while true; do
    if [ "$TEMP_PASS" != "$DB_PASS" ]; then
        echo "Wrong password. You have $count tries remaining."
        count=$((count - 1))
        if [ $count -eq 0 ]; then
            echo "Maximum attempts reached. Exiting..."
            exit 1
        fi
        read -sp "Enter MySQL user password: " DB_PASS
        echo
    fi
    if [ "$TEMP_PASS" == "$DB_PASS" ]; then
        break
    fi
done

DB_NAME="NIBO_TEST_NETWORK"

mysql -h $DB_HOST -u $DB_USER -p$DB_PASS <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
EOF

if [ $? -eq 0 ]; then
    echo "Database '$DB_NAME' created successfully."
else
    echo "Failed to create database '$DB_NAME'."
fi

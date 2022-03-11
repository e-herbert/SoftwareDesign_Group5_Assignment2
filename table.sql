DROP TABLE IF EXISTS userdata CASCADE;
DROP TABLE IF EXISTS userProfile CASCADE;
DROP TABLE IF EXISTS history CASCADE;

CREATE TABLE userdata (
    username VARCHAR(32) NOT NULL,
    pass VARCHAR(32) NOT NULL,
    PRIMARY KEY(username)
);

CREATE TABLE userProfile (
    username VARCHAR(32) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    address1 VARCHAR(100) NOT NULL,
    address2 VARCHAR(50) NOT NULL,
    city VARCHAR(20) NOT NULL,
    state VARCHAR(20) NOT NULL,
    zipcode INTEGER NOT NULL,
    CONSTRAINT "userProfile_username_fkey" FOREIGN KEY (username) REFERENCES userdata(username)
);

CREATE TABLE history (
    username VARCHAR(32) NOT NULL,
    date VARCHAR(10) NOT NULL,
    gallons numeric(4,2) NOT NULL,
    suggested_price numeric(6,2) NOT NULL,
    CONSTRAINT "history_username_fkey" FOREIGN KEY (username) REFERENCES userdata(username)
);

INSERT INTO userdata VALUES('admin', 'admin');
CREATE TABLE Users(id int AUTO_INCREMENT, email VARCHAR(255), username VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id));
CREATE TABLE Invites(code VARCHAR(255), createdBy INT, used BOOL, PRIMARY KEY(code), FOREIGN KEY(createdBy) REFERENCES Users(id));


ALTER TABLE Users AUTO_INCREMENT = 1

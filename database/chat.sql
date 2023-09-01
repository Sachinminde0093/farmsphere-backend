-- drop table messages;

-- drop table conversations;

-- CREATE TABLE UserRelations
-- (
    
--     RelationshipID  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     SenderUserID  uuid NOT NULL,
--     ReceiverUserID  uuid NOT NULL,
--     RelationshipType  character varying(20) NOT NULL,
--     CreatedAt  date NOT NULL,
--     Status  boolean NOT NULL,
--     FOREIGN KEY (SenderUserID) REFERENCES users (user_id),
--     FOREIGN KEY (ReceiverUserID) REFERENCES users (user_id)
-- );

-- CREATE TABLE Conversations (
--     ConversationID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     User1ID uuid NOT NULL,
--     User2ID uuid NOT NULL,
--     CreatedAt DATE,
--     UNIQUE (User1ID, User2ID),
--     FOREIGN KEY (User1ID) REFERENCES users (User_id),
--     FOREIGN KEY (User2ID) REFERENCES users (User_id)
-- );

-- CREATE TABLE Messages (
--     MessageID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     ConversationID UUID,
--     SenderUserID UUID,
--     ReceiverUserID UUID,
--     Content TEXT,
--     CreatedAt DATE,
--     FOREIGN KEY (ConversationID) REFERENCES Conversations 	(ConversationID),
--     FOREIGN KEY (SenderUserID) REFERENCES users (user_id),
--     FOREIGN KEY (ReceiverUserID) REFERENCES users (user_id)
-- );

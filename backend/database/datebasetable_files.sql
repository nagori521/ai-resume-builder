create database ai_resume_builder;

#creating table of admin

create table admin (
admin_id INT auto_increment primary key,
admin_name varchar(50) NOT null,
admin_email varchar(50) NOT NULL unique,
admin_password varchar (255) NOT NULL,
admin_phone varchar(15) NOT NULL,
admin_role varchar(30) NOT NULL,
last_login datetime
);

#create user table 

create table user (
user_id INT auto_increment primary Key,
user_fname varchar (50) NOT NULL,
user_lname varchar (50) NOT NULL,
email varchar(50) NOT NULL unique,
user_password varchar(255) NOT NULL,
user_phone varchar(15) NOT NULl,
user_status varchar(20) NOT NULL,
crated_at DATETIME default current_timestamp
 
);

#Creating a TAMPLATE 

create table templates(
template_id INT auto_increment primary key,
template_name varchar (50) NOT NULL,
template_layout TEXT NOT NULL,
template_status varchar (50) NOT NULL 
);


#create resume table 

create table resume (
resume_id INT auto_increment primary key,
user_id INT,
education text,
skill text,
experience text,
project Text,
ai_content text,
template_id INT ,
created_at DATETIME default current_timestamp,
foreign key (user_id) references user (user_id),
foreign key (template_id) references templates (template_id)
);


# creating a AI Config table

create table ai_config(
config_id INT auto_increment primary key,
keyword TEXT,
prompt_rules TEXT,
updated_at DATETIME default current_timestamp
);

#creating Payment Table	

create Table payment (
payment_id INT auto_increment primary key,
user_id INT,
amount decimal(10,2) NOT null,
payment_method varchar(50) NOT NULL,
payment_status varchar(30) NOT NULL,
payment_date datetime default current_timestamp,
foreign key (user_id) references user(user_id)
);


#Creating a Feedback Table

create Table feedback(
feedback_id INT auto_increment primary key,
user_id INT,
rating INT NOT NULL,
comments TEXT NOT null, 
feedback_date DATETIME default current_timestamp,
foreign key (user_id) references user (user_id)
);



#Creating reports Tables

create table report(
report_id INT auto_increment primary key,
report_type varchar(50) NOT NULL,
generated_by INT,
report_date DATETIME default current_timestamp,
foreign key (generated_by) references admin (admin_id)
);


#Creating System log Table

create table system_logs(
log_id INT auto_increment primary key,
user_type varchar(50) NOT NULL,
user_id INT not null,
action varchar(100) NOT NULL,
log_time datetime default current_timestamp
);


#creating offer table 

create table offers (
offer_id INT auto_increment primary key,
promo_code varchar(20) unique,
discount INT NOT NULL,
start_date DATETIME NOT NULL,
expiry_date DATETIME NOT NULL
);
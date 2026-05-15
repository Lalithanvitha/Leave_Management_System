--create table employees
CREATE TABLE employees(
id SERIAL PRIMARY KEY,
name VARCHAR(20) ,
role VARCHAR(20),
email VARCHAR(30) UNIQUE
);
--Insert values into employees
INSERT INTO employees(name,role,email)
VALUES
(	'qwe'	'Dev'	'abc@gmail.com'),
(   'Xyz'	'QA'	'xyz@gmail.com'),
(	'Pqr'	'UI'	'pqr@gmail.com'),
(	'Lmn'	'HR'	'lmn@gmail.com'),
(	'efg'	'Dev'	'efg@gmail.com'),
(	'asd'	'QA'	'asd@gmail.com'),
(	'dfg'	'Dev'	'dfg@gmail.com'),
(	'qwe'	'Dev'	'qwe@gmail.com');

SELECT * FROM employees;
ALTER TABLE employees DROP COLUMN role;

--create table roles
CREATE TABLE roles(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
emp_id INT ,
CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES employees(id)
);

SELECT * FROM roles;

--Insert values into roles
INSERT INTO roles(name,emp_id)
VALUES
('QA',2),
('QA',8),
('UI',3),
('UI',14),
('HR',4),
('HR',13),
('DEV',5),
('DEV',10),
('DEV',12),
('DEV',1),
('MANAGER',13);

--create table leaves
CREATE TABLE leaves(
id SERIAL PRIMARY KEY,
emp_id INT ,
leaveReason TEXT not null,
CONSTRAINT FK FOREIGN KEY(emp_id) REFERENCES employees(id)
);

SELECT * FROM leaves;

--Insert values into leaves
INSERT INTO leaves(emp_id,leaveReason)
VALUES
(8,'Sick Leave'),
(1,'Emergency Leave');

--drop fk constraint
alter table leaves drop constraint fk;

--add fk constraint with on delete cascade
alter table leaves
add constraint fk_id foreign key(emp_id) references employees(id) on delete cascade;

--add column status with default value 'pending'
alter table leaves add column status varchar(20) default 'pending';

--join employees and leaves table
select * from employees e 
join leaves l on e.id = l.emp_id;

--drop column leaves
ALTER TABLE employees
DROP COLUMN leaves ;

SELECT * FROM employees;
SELECT * FROM leaves;
SELECT * FROM roles;


--joining three tables (getting status of a leave request with id = 3)
SELECT status FROM roles r
JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id
GROUP BY status,l.id
HAVING l.id = 3;

--join three tables
SELECT * FROM roles r
JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id;

--select all column values with id = idl 
select * from leaves where id = idl

--update status to approved where id = 4
alter table leaves 
update leaves 
set status='Approved' where id =4;


select * from roles

--add column from_date with default value to leaves
alter table leaves
add column from_date date default '5/14/26'
--add column to_date with default value to leaves
alter table leaves
add column to_date date default '5/16/26';

--add column created_at with current time stamp to employees
alter table employees 
add column created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
--add column updated_at with current time stamp to employees
alter table employees
add column updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

select * from employees;

--get emp id , role name , emp name where role = QA
select e.id,r.name,e.name from employees e
join roles r on e.id = r.emp_id
group by r.name,e.id having r.name = 'QA';

--get emp id , emp name where role = QA
select e.id,e.name from roles r
join employees e on r.emp_id = e.id
group by e.name,e.id,r.name having r.name = 'QA';

--creating enumeration for column status in table leaves
CREATE TYPE leave_status as ENUM(
'PENDING',
'APPROVED',
'REJECTED'
);

--update status values to upper case
UPDATE leaves
SET status = UPPER(status);

--drop default value for status column
ALTER TABLE leaves
ALTER COLUMN status DROP DEFAULT;

--changing the type of status to leave_status
ALTER TABLE leaves
ALTER COLUMN status TYPE leave_status
USING status::leave_status;

--set default value of status to 'pending'
ALTER TABLE leaves
ALTER COLUMN status SET DEFAULT 'PENDING';

SELECT * FROM leaves;

--create composite index for leaves(emp_id,status);
CREATE INDEX idx_leave_emp_status
ON leaves(emp_id,status);

--select all column values from leaves where status = 'pending' emp_id = 12
select * from leaves
where status = 'PENDING' AND emp_id = 12;

--checks indexing exist on leaves table
select indexname, indexdef from pg_indexes
where tablename = 'leaves';

--checks how PostgreSQL executes this query internally
EXPLAIN ANALYZE
SELECT * FROM leaves
where status = 'PENDING';

--create indexing for status column in leaves table
CREATE INDEX idx_leave_status
ON leaves(status);

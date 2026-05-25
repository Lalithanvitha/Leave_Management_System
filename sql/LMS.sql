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

--add fk con
alter table leaves
add constraint fk_id foreign key(emp_id) references employees(id) on delete cascade;

alter table leaves add column status varchar(20) default 'pending';

select * from employees e 
join leaves l on e.id = l.emp_id;


ALTER TABLE employees
DROP COLUMN leaves ;

SELECT * FROM employees;
SELECT * FROM leaves;
SELECT * FROM roles;

SELECT * FROM employees e
JOIN roles r ON e.id = r.emp_id 
group by e.id , r.id
having r.name='QA';

SELECT status FROM roles r
JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id
GROUP BY status,l.id
HAVING l.id = 3;

SELECT * FROM roles r
RIGHT JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id;

select * from leaves where id = idl

alter table leaves 
update leaves 
set status='Approved' where id =4;
select * from roles

alter table leaves
add column from_date date default '5/14/26'
alter table leaves
add column to_date date default '5/16/26';

alter table employees 
add column created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
alter table employees
add column updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
select * from employees;

alter table employees drop column updated_at;

select e.id,r.name,e.name from employees e
join roles r on e.id = r.emp_id
group by r.name,e.id having r.name = 'QA';

select e.id,e.name from roles r
join employees e on r.emp_id = e.id
group by e.name,e.id,r.name having r.name = 'QA';

CREATE TYPE leave_status as ENUM(
'PENDING',
'APPROVED',
'REJECTED'
);

UPDATE leaves
SET status = UPPER(status);

ALTER TABLE leaves
ALTER COLUMN status DROP DEFAULT;

ALTER TABLE leaves
ALTER COLUMN status TYPE leave_status
USING status::leave_status;

ALTER TABLE leaves
ALTER COLUMN status SET DEFAULT 'PENDING';

SELECT * FROM leaves;

CREATE INDEX idx_leave_emp_status
ON leaves(emp_id,status);

select * from leaves
where status = 'PENDING' AND emp_id = 12;

--checks indexes exist on leaves table
select indexname, indexdef from pg_indexes
where tablename = 'leaves';

--checks how PostgreSQL executes this query internally
EXPLAIN ANALYZE
SELECT * FROM leaves
where status = 'PENDING';

CREATE INDEX idx_leave_status
ON leaves(status);

--add column days to leaves table
alter table leaves add column days integer default 3;
alter table leaves drop column days ;
--add column leave_balance to employees table
alter table employees add column leave_balance integer default 10;

SELECT id, leave_balance
FROM employees
WHERE id = 4;

alter table employees
truncate table employees,leaves,roles;

INSERT INTO roles(name,emp_id)
VALUES
('QA',22),
('MANAGER',24);
select * from roles;
select * from leaves;

INSERT INTO leaves(emp_id,leavereason,from_date,to_date,days)
VALUES
(22,'Sick leave','2026-05-24','2026-05-25',2),
(24,'Casual leave','2026-05-25','2026-05-26',2);

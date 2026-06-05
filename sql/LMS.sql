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
LEFT JOIN roles r ON e.id = r.emp_id 
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

ALTER TABLE employees 
ADD COLUMN password VARCHAR(225);

--Create Sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    emp_id INT ,
    CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES employees(id),
    session_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from sessions;
truncate tablesessions
select name,email,leave_balance,password,manager_id from employees;
select * from leaves;
select id,emp_id,leavereason,status,email_sent from leaves;
select * from ROLES;

INSERT INTO EMPLOYEES(id,manager_id)
VALUES
(25,24);
('QA',34),
('UI',46),
('UI',40),
('HR',37),
('HR',55),
('DEV',38),
('DEV',48),
('DEV',42),
('PM',41),
('DA',54),
('DA',44),
('BA',49),
('BA',45),
('QA',43);


SELECT E.ID, R.NAME,E.MANAGER_ID FROM employees e
LEFT JOIN roles r ON e.id = r.emp_id;

ALTER TABLE employees  ADD COLUMN manager_id INT;

update employees set manager_id = 37 where id =55;

SELECT
    TO_CHAR(from_date, 'YYYY-MM') AS month,
    COUNT(*) AS total_leaves
FROM leaves
where emp_id = 24
GROUP BY TO_CHAR(from_date, 'YYYY-MM')
ORDER BY month;

SELECT
	e.name as employee_name,
    TO_CHAR(from_date, 'YYYY-MM') AS month,
    COUNT(*) AS total_leaves
FROM employees e
left join leaves l on e.id = l.emp_id
and TO_CHAR(from_date, 'YYYY-MM') = '2026-05'
GROUP BY e.name
ORDER BY e.name;

SELECT
    '2026-01' AS month,
    e.name,
    COUNT(l.id) AS total_leaves
FROM employees e
LEFT JOIN leaves l
    ON e.id = l.emp_id
    AND l.from_date >= '2026-05-01'
    AND l.from_date < '2026-06-01'
GROUP BY e.id, e.name
ORDER BY e.name;

ALTER TABLE leaves
ADD COLUMN email_sent BOOLEAN DEFAULT FALSE;

select * from leaves l
join employees e on l.emp_id = e.id;

SELECT id, status, email_sent
FROM leaves
WHERE id = 53;

create table months(
month_name varchar(20),
month_num integer
);
select * from months;
insert into months(month_num,month_name)
values
(1,'January'),
(2,'February'),
(3,'March'),
(4,'April'),
(5,'May'),
(6,'June'),
(7,'July'),
(8,'August'),
(9,'September'),
(10,'October'),
(11,'November'),
(12,'December');
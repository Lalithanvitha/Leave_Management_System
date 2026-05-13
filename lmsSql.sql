CREATE TABLE employees(
id SERIAL PRIMARY KEY,
name VARCHAR(20) ,
role VARCHAR(20),
email VARCHAR(30) UNIQUE
);
SELECT * FROM employees;
ALTER TABLE employees DROP COLUMN role;

CREATE TABLE roles(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
emp_id INT ,
CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES employees(id)
);
SELECT * FROM roles;

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


INSERT INTO employees(name,role,email)
VALUES
(	'qwe'	'Dev'	'abc@gmail.com'
    'Xyz'	'QA'	'xyz@gmail.com'
	'Pqr'	'UI'	'pqr@gmail.com'
	'Lmn'	'HR'	'lmn@gmail.com'
	'efg'	'Dev'	'efg@gmail.com'
	'asd'	'QA'	'asd@gmail.com'
	'dfg'	'Dev'	'dfg@gmail.com'
	'qwe'	'Dev'	'qwe@gmail.com'
);

CREATE TABLE leaves(
id SERIAL PRIMARY KEY,
emp_id INT ,
leaveReason TEXT not null,
CONSTRAINT FK FOREIGN KEY(emp_id) REFERENCES employees(id)
);
alter table leaves drop constraint fk;

alter table leaves
add constraint fk_id foreign key(emp_id) references employees(id) on delete cascade;

alter table leaves add column status varchar(20) default 'pending';



SELECT * FROM leaves;
INSERT INTO leaves(emp_id,leaveReason)
VALUES
(8,'Sick Leave'),
(1,'Emergency Leave');

select * from employees e 
join leaves l on e.id = l.emp_id;


ALTER TABLE employees
DROP COLUMN leaves ;

SELECT * FROM employees;
SELECT * FROM leaves;
SELECT * FROM roles;



SELECT status FROM roles r
JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id
GROUP BY status,l.id
HAVING l.id = 3;

SELECT * FROM roles r
JOIN employees e ON r.emp_id = e.id
JOIN leaves l ON e.id = l.emp_id;

select * from leaves where id = idl

alter table leaves 
update leaves 
set status='Approved' where id =4;
select * from roles

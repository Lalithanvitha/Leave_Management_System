CREATE TABLE employees(
id SERIAL PRIMARY KEY,
name VARCHAR(20) ,
role VARCHAR(20),
email VARCHAR(30) UNIQUE
);
SELECT * FROM employees;

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
/*alter table leaves update foreign key on delete(cascade);*/
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

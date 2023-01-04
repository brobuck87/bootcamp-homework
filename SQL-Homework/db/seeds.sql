INSERT INTO departments (name)
VALUES ("Legal"),
("Finance"),
("Engineering"),
("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 125000, 2),
("Lawyer", 200000, 1),
("Software Engineer", 120000, 3),
("Salesperson", 120000, 4),
("Lead Engineer", 150000,3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Newhart", 1),
("John", "Smith", 2, 1),
("Dave", "Grohl", 3),
("Omar", "Rodriguez-Lopez", 4),
("Thom", "Yorke", 5);


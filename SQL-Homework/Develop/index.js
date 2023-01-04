// Imported required packages
import pkg from "inquirer";
const { prompt } = pkg;
import "console.table";
import db from "./db/sql-connection.js";
import Prompt from "inquirer/lib/prompts/base.js";
// const { db } = database;

init();

function init() {
  mainMenu();
  // console.table([
  //   {
  //     name: "foo",
  //     age: 10,
  //   },
  //   {
  //     name: "bar",
  //     age: 20,
  //   },
  // ]);
}

function mainMenu() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View All Departments", value: "VIEW_ALL_DEPARTMENTS" },
        { name: "View All Roles", value: "VIEW_ALL_ROLES" },
        { name: "View All Employees", value: "VIEW_ALL_EMPLOYEES" },
        { name: "Add a Department", value: "ADD_A_DEPARTMENT" },
        { name: "Add a Role", value: "ADD_A_ROLE" },
        { name: "Add an Employee", value: "ADD_AN_EMPLOYEE" },
        { name: "Update an Employees Role", value: "UPDATE_ROLE" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case "VIEW_ALL_DEPARTMENTS":
        viewAllDepartments();
        break;
      case "VIEW_ALL_ROLES":
        viewAllRoles();
        break;
      case "VIEW_ALL_EMPLOYEES":
        viewAllEmployees();
        break;
      case "ADD_A_DEPARTMENT":
        addDepartment();
        break;
      case "ADD_A_ROLE":
        addRole();
        break;
      case "ADD_AN_EMPLOYEE":
        addEmployee();
        break;
      case "UPDATE_ROLE":
        updateEmployeeRole();
        break;
      default:
        quit();
        break;
    }
  });
}

function viewAllDepartments() {
  db.query(
    "SELECT id AS Department_ID, name AS Department_Name FROM departments",
    function (err, results) {
      if (err?.sqlMessage) {
        console.log(err.sqlMessage);
        mainMenu();
      } else if (err) {
        throw err;
      } else {
        console.table(results);
        mainMenu();
      }
    }
  );
}

function viewAllRoles() {
  db.query(
    `SELECT roles.title AS job_title, roles.id AS role_id, salary, departments.name AS department_name FROM roles JOIN departments ON roles.department_id  = departments.id ORDER BY salary ASC;`,
    function (err, results) {
      if (err?.sqlMessage) {
        console.log(err.sqlMessage);
        mainMenu();
      } else if (err) {
        throw err;
      } else {
        console.table(results);
        mainMenu();
      }
    }
  );
}

function viewAllEmployees() {
  // employee ids, first names, last names, job titles, departments, salaries, and managers
  db.query(
    `SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.salary, roles.title AS job_title, departments.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name FROM employees LEFT JOIN employees managers ON employees.manager_id = managers.id JOIN roles ON roles.id = employees.role_id JOIN departments ON departments.id = roles.department_id;`,
    function (err, results) {
      if (err?.sqlMessage) {
        console.log(err.sqlMessage);
        mainMenu();
      } else if (err) {
        throw err;
      } else {
        console.table(results);
        mainMenu();
      }
    }
  );
}

function addDepartment() {
  prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the name of the department?",
    },
  ]).then((res) => {
    db.query(
      `INSERT INTO departments (name) VALUES ("${res.department_name}");`,
      function (err, results) {
        if (err?.sqlMessage) {
          console.log(err.sqlMessage);
          mainMenu();
        } else if (err) {
          throw err;
        } else {
          console.log("Department added to database");
          mainMenu();
        }
      }
    );
  });
}

function addRole() {
  db.query("SELECT * FROM departments;", function (err, results) {
    if (err?.sqlMessage) {
      console.log(err.sqlMessage);
      mainMenu();
    } else if (err) {
      console.log(err);
      throw err;
    } else {
      // console.log(results);
      const departmentsList = results.map((department) => {
        return { name: department.name, value: department.id };
      });
      prompt([
        {
          type: "input",
          name: "role_title",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is salary for the role?",
        },
        {
          type: "list",
          name: "department_id",
          message: "What is the name of the department?",
          choices: departmentsList,
        },
      ]).then((res) => {
        // console.log(res);
        db.query(
          `INSERT INTO roles (title, salary, department_id) VALUES ("${res.role_title}", "${res.salary}", "${res.department_id}");`,
          function (err, results) {
            if (err?.sqlMessage) {
              console.log(err.sqlMessage);
              mainMenu();
            } else if (err) {
              throw err;
            } else {
              console.log("Role added to database");
              mainMenu();
            }
          }
        );
      });
    }
  });
}

function addEmployee() {
  db.query("SELECT id, title FROM roles;", function (err, results) {
    if (err?.sqlMessage) {
      console.log(err.sqlMessage);
      mainMenu();
    } else if (err) {
      console.log(err);
      throw err;
    } else {
      const rolesList = results.map((roles) => {
        return { name: roles.title, value: roles.id };
      });
      db.query(
        `SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS single_name FROM employees ORDER BY employees.id ASC;`,
        function (err, results) {
          if (err?.sqlMessage) {
            console.log(err.sqlMessage);
            mainMenu();
          } else if (err) {
            throw err;
          } else {
            const employeesList = results.map((employees) => {
              return { name: employees.single_name, value: employees.id };
            });
            prompt([
              {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
              },
              {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
              },
              {
                type: "list",
                name: "employee_role",
                message: "What is the employee's role?",
                choices: rolesList,
              },
              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employeesList,
              },
            ]).then((res) => {
              db.query(
                `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", "${res.employee_role}", "${res.manager}");`,
                function (err, results) {
                  if (err?.sqlMessage) {
                    console.log(err.sqlMessage);
                    mainMenu();
                  } else if (err) {
                    throw err;
                  } else {
                    console.log("Employee added to database");
                    mainMenu();
                  }
                }
              );
            });
          }
        }
      );
    }
  });
}

function updateEmployeeRole() {
  db.query(
    `SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name FROM employees;`,
    function (err, results) {
      if (err?.sqlMessage) {
        console.log(err.sqlMessage);
        mainMenu();
      } else if (err) {
        throw err;
      } else {
        const employeesList = results.map((employees) => {
          return { name: employees.employee_name, value: employees.id };
        });
        db.query(
          `SELECT DISTINCT roles.title, employees.role_id FROM employees JOIN roles ON employees.role_id  = roles.id;`,
          function (err, results) {
            if (err?.sqlMessage) {
              console.log(err.sqlMessage);
              mainMenu();
            } else if (err) {
              throw err;
            } else {
              const rolesList = results.map((roles) => {
                return { name: roles.title, value: roles.role_id };
              });
              prompt([
                {
                  type: "list",
                  name: "employee_id",
                  message: "Which employee would you like to update?",
                  choices: employeesList,
                },
                {
                  type: "list",
                  name: "role_id",
                  message: "Which role would you like to update to",
                  choices: rolesList,
                },
              ]).then((res) => {
                db.query(
                  `UPDATE employees 
                  SET role_id = "${res.role_id}"
                  WHERE id = "${res.employee_id}"`,
                  function (err, results) {
                    if (err?.sqlMessage) {
                      console.log(err.sqlMessage);
                      mainMenu();
                    } else if (err) {
                      throw err;
                    } else {
                      console.log("Employee role updated");
                      mainMenu();
                    }
                  }
                );
              });
            }
          }
        );
      }
    }
  );
}

function quit() {
  console.log("Exiting the program");
  process.exit();
}

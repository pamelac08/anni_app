/* eslint-disable prettier/prettier */
var db = require("../models");
var passport = require("../config/passport");


module.exports = function (app) {
  // Gets all employees.
  app.get("/api/employeeList", function (req, res) {
    db.Employee.findAll({}).then(function (employees) {
      res.json(employees);
    });
  });

  
  app.get("/api/sortFirstNameUp", function (req, res) {
    db.Employee.findAll({
      order: [
        ["firstName", "ASC"],
        ["lastName", "ASC"],
      ]
    }).then(function (employees) {
      res.json(employees);
    });
  });

  app.get("/api/sortFirstNameDown", function (req, res) {
    db.Employee.findAll({
      order: [
        ["firstName", "DESC"],
        ["lastName", "ASC"],
      ]
    }).then(function (employees) {
      res.json(employees);
    });
  });


  app.get("/api/userList", function (req, res) {
    db.User.findAll({}).then(function (employees) {
      res.json(employees);
    });
  });

  // Gets all employees records ordered by hire date.
  app.get("/api/employees/anniversary", function (req, res) {
    db.Employee.findAll({
      order: [
        ["hireDateMonth", "ASC"],
        ["hireDateDay", "ASC"],
        ["lastName", "ASC"],
        ["firstName", "ASC"]
      ]
    }).then(function (employees) {
      for (let i = 0; i < employees.length; i++) {
      }
      res.json(employees);
    });
  });

  // Gets all employees records ordered by Birthday.
  app.get("/api/employees/birthday", function (req, res) {
    db.Employee.findAll({
      order: [
        ["birthdayMonth", "ASC"],
        ["birthdayDay", "ASC"],
        ["lastName", "ASC"],
        ["firstName", "ASC"]
      ]
    }).then(function (employees) {
      for (let i = 0; i < employees.length; i++) {
      }
      res.json(employees);
    });
  });

  // Creates a new employee.
  app.post("/api/employees", function (req, res) {
    db.Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      hireDateYear: req.body.hireDateYear,
      hireDateMonth: req.body.hireDateMonth,
      hireDateDay: req.body.hireDateDay,
      birthdayYear: req.body.birthdayYear,
      birthdayMonth: req.body.birthdayMonth,
      birthdayDay: req.body.birthdayDay,
      department: req.body.department,
      pay: req.body.pay,
      comments: req.body.comments
    }).then(function (record) {
      res.json(record);
    });
  });

  // Deletes an employee by id.
  app.delete("/api/employees/:id", function (req, res) {
    db.Employee.destroy({ where: { id: req.params.id } }).then(function (record) {
      res.json(record);
    });
  });

  app.put("/api/employeeUpdate/:id", function (req, res) {
    var newHireDateYear;
    var newHireDateMonth;
    var newHireDateDay;
    var newBirthdayYear;
    var newBirthdayMonth;
    var newBirthdayDay;
    var newDepartment;
    var newPay;
    var newComments;
    // gets all current database data.
    db.Employee.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (currentEmployeeRecord) {

      // If the new inputs are not blank, new value is added to sent object
      if (req.body.hireDateYear !== "") {
        newHireDateYear = req.body.hireDateYear
      }
      if (req.body.hireDateMonth !== "") {
        newHireDateMonth = req.body.hireDateMonth
      }
      if (req.body.hireDateDay !== "") {
        newHireDateDay = req.body.hireDateDay
      }
      if (req.body.birthdayYear !== "") {
        newBirthdayYear = req.body.birthdayYear
      }
      if (req.body.birthdayMonth !== "") {
        newBirthdayMonth = req.body.birthdayMonth
      }
      if (req.body.birthdayDay !== "") {
        newBirthdayDay = req.body.birthdayDay
      }
      if (req.body.department !== "") {
        newDepartment = req.body.department
      }
      if (req.body.pay !== "NaN") {
        newPay = req.body.pay
      }
      if (req.body.comments !== "") {
        newComments = req.body.comments
      }

      db.Employee.update({
        hireDateYear: newHireDateYear,
        hireDateMonth: newHireDateMonth,
        hireDateDay: newHireDateDay,
        birthdayYear: newBirthdayYear,
        birthdayMonth: newBirthdayMonth,
        birthdayDay: newBirthdayDay,
        department: newDepartment,
        pay: newPay,
        comments: newComments
      }, {
        where: {
          id: req.params.id
        }
      })
        .then(function (dbPost) {
          res.json(dbPost);
        });
    });
  });

  // Sending login form to database for checking if the user already has an account and the correct corresponding password 
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.redirect("/members");
  });

  // Sending user email and password from register form to create a new user in the database
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      res.json(err);
    });
  });

  // Logging out of the application.
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};

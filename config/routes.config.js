const express = require('express');
const router = express.Router();
const request = require('supertest');
const app = require('../app');
const employees = require('../controllers/employees.controller');

router.get("/employees", employees.list);
router.post("/employees", employees.doList);
router.get("/employees/oldest", employees.oldest);
router.get("/employees/:name", employees.name);

module.exports = router;

const request = require('supertest');
const app = require('../app');
const employeesJson = require('../models/employees.json');

// 1
describe('GET /api/employees', () => {
  it('responds with JSON containing a list of employees', (done) => {
    request(app)
      .get('/api/employees')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(employeesJson, done);
  });
});

// 2
describe('GET /api/employees?page=1', () => {
  it('returns the first 2 employees', (done) => {
    request(app)
      .get('/api/employees?page=1') 
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const employees = res.body;
        const expectedEmployees = employeesJson.slice(0, 2); 
        if (JSON.stringify(employees) !== JSON.stringify(expectedEmployees)) {
          throw new Error('Response does not contain the first 2 employees');
        }
      })
      .end(done);
  });
});

// 3
describe('GET /api/employees?page=2', () => {
  it('Return from item 2 to item 3 of the list.', (done) => {
    request(app)
      .get('/api/employees?page=2') 
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const employees = res.body;
        const expectedEmployees = employeesJson.slice(2, 4); 
        if (JSON.stringify(employees) !== JSON.stringify(expectedEmployees)) {
          throw new Error('Response does not contain the item 2 and 3 of the list');
        }
      })
      .end(done);
  });
});

// 4
describe('GET /api/employees?page=4', () => {
  it('return the element (2 * (N - 1)) al (2 * (N - 1)) + 1.', (done) => {
    request(app)
      .get('/api/employees?page=4') 
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const employees = res.body;
        const page = 4
        const startIndex = 2 * (page - 1);
        const endIndex = startIndex + 1;
        const expectedEmployees = employeesJson.slice(startIndex, endIndex + 1); 
        if (JSON.stringify(employees) !== JSON.stringify(expectedEmployees)) {
          throw new Error('Response does not give back the expected items');
        }
      })
      .end(done);
  });
});

//5
describe('GET /api/employees/oldest', () => {
  it('returns the oldest employee', (done) => {
    request(app)
      .get('/api/employees/oldest')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const oldestEmployee = employeesJson.reduce((oldest, current) => {
          return (oldest.age > current.age) ? oldest : current;
        });
        if (JSON.stringify(res.body) !== JSON.stringify(oldestEmployee)) {
          throw new Error('Response does not contain the oldest employee');
        }
      })
      .end(done);
  });
});

//6
describe('GET /api/employees?user=true', () => {
  it('returns a list of employees with privileges set to "user"', (done) => {
    request(app)
      .get('/api/employees?user=true')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const userEmployees = employeesJson.filter(employee => employee.privileges === "user");
        if (JSON.stringify(res.body) !== JSON.stringify(userEmployees)) {
          throw new Error('Response does not contain the expected user employees');
        }
      })
      .end(done);
  });
});

//7
describe('POST /api/employees', () => {
  it('adds an employee to the list with valid JSON format', (done) => {
    const newEmployee = {
      name: 'John Doe',
      age: 30,
      phone: '555-123-123',
      privileges: 'user',
      favorites: ['Picasso', 'pizza'],
      finished: [17, 3],
      badges: ['blue', 'black'],
      points: [{ points: 85, bonus: 20 }, { points: 85, bonus: 10 }]
    };

    request(app)
      .post('/api/employees')
      .send(newEmployee)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const employeeAdded = res.body.find(employee => employee.name === newEmployee.name);
        if (!employeeAdded) {
          throw new Error('Employee was not added to the list');
        }
      })
      .end(done);
  });

  it('returns status 400 if request body does not have the correct JSON format', (done) => {
    const invalidEmployee = {
      // Invalid format, missing required properties
      age: 30,
      phone: '123456789'
    };

    request(app)
      .post('/api/employees')
      .send(invalidEmployee)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({ "code": "bad_request" })
      .end(done);
  });
});

//8
describe('GET /api/employees?badges=black', () => {
  it('returns a list of employees with privileges set to "user"', (done) => {
    request(app)
      .get('/api/employees?badges=black')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const userEmployees = employeesJson.filter(employee => employee.badges.includes("black"));
        if (JSON.stringify(res.body) !== JSON.stringify(userEmployees)) {
          throw new Error('Response does not contain the expected user employees');
        }
      })
      .end(done);
  });
});

//9
describe('GET /api/employees/Sue', () => {
  it('returns a list of employees with privileges set to "user"', (done) => {
    request(app)
      .get('/api/employees/Sue')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const name = "Sue";
        const nameFilter = employeesJson.filter(element => element.name.toLowerCase() === name.toLowerCase());
        if (JSON.stringify(res.body) !== JSON.stringify(nameFilter)) {
          throw new Error('Response does not contain the expected user employees');
        }
      })
      .end(done);
  });
});
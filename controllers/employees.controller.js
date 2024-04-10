const employeesJson = require('../models/employees.json');

module.exports.list = (req, res, next) => {
  const page = req.query.page;
  const user = req.query.user;
  const badgesBlack = req.query.badges;
  if (page) {
    const startIndex = 2 * (page - 1);
    const endIndex = (2 * (page - 1)) + 1;
    const employeesJsonSlice = employeesJson.slice(startIndex, endIndex + 1);
    res.json(employeesJsonSlice);
  } else if (user) {
    const userFilter = employeesJson.filter(employee => employee.privileges === "user");
    res.json(userFilter);
  } else if (badgesBlack) {
    const badgesFilter = employeesJson.filter(employee => employee.badges.includes(badgesBlack))
    res.json(badgesFilter)
  } else {
    res.json(employeesJson);
  }
}

module.exports.oldest = (req, res, next) => {
  const sortEmployee = employeesJson.sort((a, b) => b.age - a.age);
  res.json(sortEmployee[0]);
}

module.exports.doList = (req, res, next) => {
  const { name, age, phone, privileges, favorites, finished, badges, points } = req.body
  
  if (
    name && age && 
    phone && privileges && 
    favorites && finished && 
    badges && points
  ) {
    const newEmployee = {
      name,
      age,
      phone,
      privileges,
      favorites,
      finished,
      badges,
      points
    };

    employeesJson.push(newEmployee);
    res.json(employeesJson);
  } else {
    res.status(400).json({"code": "bad_request"})
  }  
}

module.exports.name = (req, res, next) => {
  const { name } = req.params;
  const nameFilter = employeesJson.filter(element => element.name.toLowerCase() === name.toLowerCase());
  if (nameFilter.length > 0) {
    res.json(nameFilter);
  } else {
    res.status(404).json({"code": "not_found"})
  }
  
}

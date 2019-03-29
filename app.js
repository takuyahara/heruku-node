const express = require('express');
const app = express();

const server = app.listen(3000, () => {
  console.log("Node.js is listening to PORT:" + server.address().port);
});
app.get('/api/sonarcloud', function(req, res) {
  const fetch = require("node-fetch");
  const API_ENDPOINT =
    "https://sonarcloud.io/api/measures/component?metricKeys=new_bugs,new_vulnerabilities,new_technical_debt,new_code_smells,new_coverage,coverage,new_duplicated_lines_density,new_duplicated_blocks";
  const component = req.query.component;
  const api = `${API_ENDPOINT}&component=${component}`;
  fetch(api)
    .then(response => response.json())
    .then(data => {
      const newData = {};
      data.component.measures.forEach(obj => {
        newData[obj.metric] = obj.periods ? obj.periods[0].value : obj.value;
      });
      res.send(`${JSON.stringify(newData)}`);
    })
    .catch(error => {
      res.status(401).send(String(error));
    });
});
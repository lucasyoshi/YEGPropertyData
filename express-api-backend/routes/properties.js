var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sql = require("mssql");

// Create a configuration object
const config = {
  user: "user2015",
  password: "Password2015",
  server: "localhost", // You can use a domain name or IP address
  database: "DMIT2015CourseDB",
  options: {
    encrypt: true,
    trustServerCertificate: true, // Use this if you're on Windows Azure
  },
};

router.get('/getTestData', function(req, res, next) {
    var data = {
        houseNumber: "10205",
        streetName: "120 Street NW",
        suite: "3202"
    }

    res.json(data);
});

router.get('/query', function(req, res, next) {
    console.log("Query start:", req.query);
    let { houseNumber, streetName, suite } = req.query;
    console.log("House Number:", houseNumber)
    // Check if suite is empty or blank, if so, set it to null
    if (!suite || suite.trim() === '') {
        suite = null;
    }

    // Modify the query to handle null suite
    let query = suite === null 
        ? `SELECT TOP 1 * FROM lhashimoto2EdmontonPropertyAssessmentData WHERE houseNumber = @houseNumber AND streetName = @streetName AND suite IS NULL`
        : `SELECT TOP 1 * FROM lhashimoto2EdmontonPropertyAssessmentData WHERE houseNumber = @houseNumber AND streetName = @streetName AND suite = @suite`;

    sql.connect(config).then(pool => {
        let request = pool.request();
        request.input('houseNumber', sql.VarChar, houseNumber);
        request.input('streetName', sql.VarChar, streetName);
        if(suite !== null) {
            request.input('suite', sql.VarChar, suite);
        }

        console.log("Query:", query);

        return request.query(query);
    }).then(result => {
        console.log(result);
        res.json(result.recordset[0]); // send the first record as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});

router.get('/assessedValue', function(req, res, next) {
    let { neighbourhood, minValue, maxValue } = req.query;

    let query = `SELECT * FROM lhashimoto2EdmontonPropertyAssessmentData WHERE neighbourhood = @neighbourhood AND assessedValue BETWEEN @minValue AND @maxValue`;

    sql.connect(config).then(pool => {
        let request = pool.request();
        request.input('neighbourhood', sql.VarChar, neighbourhood);
        request.input('minValue', sql.Int, minValue);
        request.input('maxValue', sql.Int, maxValue);

        return request.query(query);
    }).then(result => {
        res.json(result.recordset); // send the result as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});


router.get('/allRecords', verifyToken, function(req, res, next) {
    let query = `SELECT top 100 * FROM lhashimoto2EdmontonPropertyAssessmentData ORDER BY accountNumber DESC`;
    console.log("Query:", query);
    sql.connect(config).then(pool => {
        return pool.request().query(query);
    }).then(result => {
        res.json(result.recordset); // send the result as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});
// Endpoint to create a record
router.post('/addProperty', verifyToken, function(req, res, next) {
    let pointLocation = `POINT (${req.body.longitude} ${req.body.latitude})`;

    let query = `INSERT INTO lhashimoto2EdmontonPropertyAssessmentData (suite, houseNumber, streetName, garage, neighbourhoodId, neighbourhood, ward, assessedValue, latitude, longitude, assessmentClass1, point_location) VALUES (@suite, @houseNumber, @streetName, @garage, @neighbourhoodId, @neighbourhood, @ward, @assessedValue, @latitude, @longitude, @assessmentClass1, geometry::STPointFromText(@point_location, 4326))`;

    sql.connect(config).then(pool => {
        let request = pool.request();
        request.input('suite', sql.NVarChar, req.body.suite);
        request.input('houseNumber', sql.NVarChar, req.body.houseNumber);
        request.input('streetName', sql.NVarChar, req.body.streetName);
        request.input('garage', sql.Bit, req.body.garage);
        request.input('neighbourhoodId', sql.Int, req.body.neighbourhoodId);
        request.input('neighbourhood', sql.NVarChar, req.body.neighbourhood);
        request.input('ward', sql.NVarChar, req.body.ward);
        request.input('assessedValue', sql.Float, req.body.assessedValue);
        request.input('latitude', sql.Float, req.body.latitude);
        request.input('longitude', sql.Float, req.body.longitude);
        request.input('assessmentClass1', sql.NVarChar, req.body.assessmentClass1);
        request.input('point_location', sql.NVarChar, pointLocation);
        console.log(query);
        return request.query(query);
    }).then(result => {
        res.json({message: "Record created successfully"}); // send the result as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});

// Endpoint to delete a record
router.delete('/deleteProperty/:id', verifyToken, function(req, res, next) {
    let query = `DELETE FROM lhashimoto2EdmontonPropertyAssessmentData WHERE accountNumber = ${req.params.id}`;

    sql.connect(config).then(pool => {
        return pool.request().query(query);
    }).then(result => {
        res.json({message: "Record deleted successfully"}); // send the result as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});
router.put('/updateProperty/:id', verifyToken, function(req, res, next) {
    let pointLocation = `POINT (${req.body.longitude} ${req.body.latitude})`;

    let query = `UPDATE lhashimoto2EdmontonPropertyAssessmentData SET suite = @suite, houseNumber = @houseNumber, streetName = @streetName, garage = @garage, neighbourhoodId = @neighbourhoodId, neighbourhood = @neighbourhood, ward = @ward, assessedValue = @assessedValue, latitude = @latitude, longitude = @longitude, assessmentClass1 = @assessmentClass1, point_location = geometry::STPointFromText(@point_location, 4326) WHERE accountNumber = @id`;

    sql.connect(config).then(pool => {
        let request = pool.request();
        request.input('suite', sql.NVarChar, req.body.suite);
        request.input('houseNumber', sql.NVarChar, req.body.houseNumber);
        request.input('streetName', sql.NVarChar, req.body.streetName);
        request.input('garage', sql.Bit, req.body.garage);
        request.input('neighbourhoodId', sql.Int, req.body.neighbourhoodId);
        request.input('neighbourhood', sql.NVarChar, req.body.neighbourhood);
        request.input('ward', sql.NVarChar, req.body.ward);
        request.input('assessedValue', sql.Float, req.body.assessedValue);
        request.input('latitude', sql.Float, req.body.latitude);
        request.input('longitude', sql.Float, req.body.longitude);
        request.input('assessmentClass1', sql.NVarChar, req.body.assessmentClass1);
        request.input('point_location', sql.NVarChar, pointLocation);
        request.input('id', sql.Int, req.params.id);
        return request.query(query);
    }).then(result => {
        res.json({message: "Record updated successfully"}); // send the result as response
    }).catch(err => {
        console.error(err);
        return next(err);
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log("bearerHeader:", bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.userData = data;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}


module.exports = router;
var expect = require("chai").expect;
//var controller = require("../controllers/bestShipment");
var request = require("request");

describe("Best Shipment App Test", function() {

    describe("Connection to Boxknight API", function() {
        let url = "https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/rates/H2G1L7";
        it("get rate - returns status 200", function() {
            request(url, function(error, response, body) {
              expect(response.statusCode).to.equal(200);
            });
          });
        it("get rate - returns 2 result with H2G1L7", function() {
            request(url, function(error, response, body) {
              expect(response.body.length).to.equal(2);
            });
          });



        let url2 = "https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/shipments";
        it("ship post - returns status 200", function() {
                const params = {
                    rate_id : "bd039d0a-990e-11e9-a2a3-2a2ae2dbcce4",
                    destination : {
                        address_line_one : "4455 Boul. Poirier",
                        address_line_two : "201",
                        city : "Montréal",
                        province : "Québec",
                        postalCode : "H4R2A4",
                        country : "Canada",
                    }
                };
                request.post({url : url2, formData: JSON.stringify(params)}, (err, response, body) => {
                    expect(response.statusCode).to.equal(200);
                })
            });
    });

    describe("Connection to CanadaPost API", function() {
        let url = "https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/rates/H2G1L7";
        it("get rate - returns status 200", function() {
            request(url, function(error, response, body) {
              expect(response.statusCode).to.equal(200);
            });
          });
        it("get rate - returns 2 result with H2G1L7", function() {
            request(url, function(error, response, body) {
              expect(response.body.length).to.equal(2);
            });
          });


        let url2 = "https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/shipments";
        it("ship post - returns status 200", function() {
            const params = {
                rate_id : "bd039d0a-990e-11e9-a2a3-2a2ae2dbcce4",
                destination : {
                    address_line_one : "4455 Boul. Poirier",
                    address_line_two : "201",
                    city : "Montréal",
                    province : "Québec",
                    postalCode : "H4R2A4",
                    country : "Canada",
                }
            };
            request.post({url : url2, formData: JSON.stringify(params)}, (err, response, body) => {
                expect(response.statusCode).to.equal(200);
            })
        });
    });
})
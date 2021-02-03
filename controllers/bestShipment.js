
const axios = require('axios');

const index = (request, response, next) => {
    const params = {
        title: "Best Shipment",
        pageName : "Find the best shipment for your address",
        pageDescription: "Please enter your postal code to find the best shipment method"
    }
    response.render('index', params);    
}

const find = (request, response, next) => {
    const postalCode = request.body.postalCode;
    let options = [];

    /**
     * Find available options using boxknight api + add the options in $options arr
     */ 
    const boxknightCall =
        axios.get(`https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/rates/${postalCode}`)
        .then(res => {
            const result_boxknight = res.data;
            result_boxknight.forEach(elem => {
                options.push({
                    id : elem.id,
                    name : elem.description,
                    rate : elem.price,
                    estimate_days : elem.estimate_days,
                    type: "BoxKnight"
                });                
            });
        });

    /**
     * Find available options using canada post api + add the options in $options arr
     */
    const canadapostCall = 
        axios.get(`https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/rates/${postalCode}`)
        .then(res => {
            const result_canadapost = res.data;
            result_canadapost.forEach(elem => {
                options.push({
                    id : elem.id,
                    name : elem.description,
                    rate : elem.price,
                    estimate_days : elem.estimate_days,
                    type: "Canada Post"
                });                
            });
        });
        
    Promise.all([boxknightCall, canadapostCall]).then((responses) => {
        /**
         * send 404 when the resource is not found
         */
        if(options.length < 1 ) 
        {
            return response.json(404);
        }
        else
        {
            /**
             * Find the lowest price
             */
            const min_rate = options.reduce((prev, curr) => {
                return prev.rate < curr.rate ? prev : curr;
            }).rate;


            /**
             * Find the items with the lowest price
             */    
            let min_rates_result = [];
            options.forEach((obj) => {
                if (obj.rate === min_rate) min_rates_result.push(obj);
            });
            
            /**
             * Find the items with the shortest estimate days (when there's only one item, the only item is rendered in view)
             */
            if (min_rates_result.length === 1)
            {
                const params = {
                    shipment : min_rates_result[0]
                };
                response.render('find', params);
            }
            else
            {
                const min_days = min_rates_result.reduce((prev, curr) => {
                    return prev.estimate_days < curr.estimate_days ? prev : curr;
                });
                const params ={
                    shipment : min_days,
                    title : "The best shipment search result",
                    pageName : "Best shipment search result"
                };
                response.render('find', params);
            }
        }
    });
}

async function ship (request, response, next)
{
    /**
     * Get all the params from request.body 
     */
    const AddressLine1 = request.body.AddressLine;
    const AddressLine2 = request.body.AddressLine2;
    const City = request.body.City;
    const Province = request.body.Province;
    const PostalCode = request.body.PostalCode;
    const Country = request.body.Country;
    var shipmentInfo = request.body.ShipmentID.split("|");
    const ShipmentID = shipmentInfo[0];
    const Type = shipmentInfo[1];


    /**
     * Set $params in expected format
     */
    const params = {
        rate_id : ShipmentID,
        destination : {
            address_line_one : AddressLine1,
            address_line_two : AddressLine2,
            city : City,
            province : Province,
            postalCode : PostalCode,
            country : Country,
        }
    };

    /**
     * Call API for shipment + render returned order ID
     */
    const url = Type === "BoxKnight" ? 'https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/shipments' : 'https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/shipments';
    const shipmentCall =
        axios.post(url, params)
        .then(res => {
            const result_shipment = res.data;
            response.render('shipResult', {orderid : result_shipment.order_id});
        }, err => {
            console.log(err);
        });
}


module.exports.ship = ship;
module.exports.index = index;
module.exports.find = find;

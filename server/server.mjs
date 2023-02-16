/* eslint-disable no-undef */
// eslint-disable-next-line import/order
import fs from 'fs';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import  JSONStream from  'JSONStream';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
const server = express();

server.use(express.json());
dotenv.config();

const MongoClient = mongodb.MongoClient;
const username = encodeURIComponent(process.env.USERNAME);
const password = encodeURIComponent(process.env.PASSWORD);
const cluster = process.env.CLAUSTER;
const dbName = process.env.DATABASENAME;
const collectionName = process.env.COLLECTIONNAME;
let uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?w=majority`;


server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,OPTIONS,POST,PUT,DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

server.use(cors());

server.get('/api/data/:duration', async (req, res) => {
    const client = new MongoClient(uri);
    
    async function run() {
        try {
            const {duration} = req.params;
            const {date} = req.query;
            console.log('duration ==> ', duration);
            console.log('date ==> ', date);
            await client.connect();
            const database = client.db(dbName);
            const collection  = database.collection(collectionName);
            const data = await  collection.aggregate([
                {
                    $match:
                    {
                        // _id: {
                        //     $in: [
                        //         new ObjectId('631dad359fbc895818809423'),
                        //         new ObjectId('631dad359fbc895818809424'),
                        //         new ObjectId('631dad359fbc895818809425'),
                        //     ],
                        // },
                    },
                },
                {
                    $addFields:
                    {
                        newTime: new Date(date),
                    },
                },
                {
                    $match:
              
                    {
                        $expr: {
                            $gt: [
                                '$timestamp',
                                {
                                    $subtract: [
                                        '$newTime',
                                        parseInt(duration) * 60 * 60 * 1000,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $match: {
                        'instances': { $exists: true } // Match documents that have the "instances" property
                    }
                },
                {
                    
                    $project:{newTime: 0}
                    
                },
                {
                    $addFields: {
                        'num_instance_properties': { $size: { $objectToArray: '$instances' } } // Add a field to count the number of properties in the "instances" object
                    }
                },
                {
                    $match: {
                        'num_instance_properties': { $gt: 5 } // Match documents where the "instances" object has more than 5 properties
                    }
                },
                {
                    $project: {
                        'num_instance_properties': 0 // Remove the "num_instance_properties" field from the output
                    }
                }
            ]).limit(10).toArray();

            res.status(200).json(data);
        } finally {
            await client.close();
        }
    }
    run().catch(error  => {
        res.status(404).json({err: error.message});
    });
});

server.post('/update', async (req, res) => {
    let client = new MongoClient(uri, { useNewUrlParser: true });

    try{

        const data = [];
        // Create a read stream from the file
        const stream = fs.createReadStream(process.env.DATAFILE);
            
        // Pipe the stream through the JSONStream module to parse the JSON objects
        const jsonStream = stream.pipe(JSONStream.parse('*'));
            
        // Listen for the data event to be emitted from the JSON stream
        jsonStream.on('data', object => {
            // Do something with the object
            data.push(object);
        });
            
        // Listen for the end event to be emitted from the JSON stream
        jsonStream.on('end', async () => {
            
  
            await  client.connect();
            data.map( async  (document) => {
                const timestamp =  new Date(Number(document.timestamp['$date']['$numberLong']));
                let collection = client.db(dbName).collection(collectionName);
                const query = { _id : new ObjectId(document._id['$oid']) };
                const update = { $set: { instances : document.instances , timestamp  }};
                const options = { upsert: true };
                const response  =  await  collection.updateOne(query, update, options);
                return response;

                      
            });
            
            res.status(200).json({message :'data is here ', data  });
        });
        client.close();
    }catch(err){
        console.log('err in reading the file ', err.message);
        res.status(401).json({ err: err.message});
        client.close();
    }
     
    
});


server.listen(9000, ()=> {

    console.log('==  server is running on port 9000 ====');


});

// eslint-disable-next-line import/order
import fs from 'fs';

import cors from 'cors';
import express from 'express';
import  JSONStream from  'JSONStream';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
const server = express();

server.use(express.json());


const   MongoClient = mongodb.MongoClient;
const username = encodeURIComponent('hilalaissani');
const password = encodeURIComponent('password200');
const cluster = 'cluster0.oe5ry.mongodb.net';


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

server.get('/api/data', async (req, res) => {
    const dbName = 'humanDb';
    const collectionName = 'datahuman';
    let uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?w=majority`;

    const client = new MongoClient(uri);
    async function run() {
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection  = database.collection(collectionName);
            const data = await collection.find({}).limit(30).toArray();
            res.status(200).json(data);
        } finally {
            await client.close();
        }
    }
    run().catch(error  => {
        res.status(404).json({err: error.message});
    });
});


server.get('/books',async  (req, res)=> {
    const dbName = 'test';
    const collectionName = 'books';
    let uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?w=majority`;

    const client = new MongoClient(uri);
    async function run() {
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection  = database.collection(collectionName);
            const data = await collection.find({}).toArray();
            res.status(200).json({data});
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
      
        const session = client.startSession();
        session.startTransaction();
   
        const data = [];
        // Create a read stream from the file
        const stream = fs.createReadStream('smallFile.json');
            
        // Pipe the stream through the JSONStream module to parse the JSON objects
        const jsonStream = stream.pipe(JSONStream.parse('*'));
            
        // Listen for the data event to be emitted from the JSON stream
        jsonStream.on('data', object => {
            // Do something with the object
            data.push(object);
        });
            
        // Listen for the end event to be emitted from the JSON stream
        jsonStream.on('end', async () => {
            
  
            await  client.connect((err)=> {
                if(err) console.log('==== connection error ====>', err.message);
                console.log('connected ====> ');

                data.map( (document) => {
                    const timestamp =  new Date(Number(document.timestamp['$date']['$numberLong']));
                    const date = timestamp.toISOString().substring(0,10);
                    let collection = client.db('humanDb').collection('datahuman');
                    collection.aggregate(
                        [
                            {
                                $match:
                        /**
                         * query: The query in MQL.
                         */
                        {
                            _id: new ObjectId(document._id['$oid']),
                        },
                            },
                            {
                                $project:
                        /**
                         * specifications: The fields to
                         *   include or exclude.
                         */
                        {
                            dateOnly: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$timestamp',
                                },
                            },
                            timestamp: 1,
                            instances: '$instances',
                        },
                            },
                            {
                                $addFields:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                            newDateOne: {
                                $split: ['$dateOnly', '-'],
                            },
                            newDateTwo: {
                                $split: [date, '-'],
                            },
                        },
                            },
                            {
                                $addFields:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                            stringOne: {
                                $reduce: {
                                    input: '$newDateOne',
                                    initialValue: '',
                                    in: {
                                        $concat: [
                                            '$$value',
                                            {
                                                $cond: [
                                                    {
                                                        $eq: ['$$this', ','],
                                                    },
                                                    '',
                                                    '$$this',
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            stringTwo: {
                                $reduce: {
                                    input: '$newDateTwo',
                                    initialValue: '',
                                    in: {
                                        $concat: [
                                            '$$value',
                                            {
                                                $cond: [
                                                    {
                                                        $eq: ['$$this', ','],
                                                    },
                                                    '',
                                                    '$$this',
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                            },
                            {
                                $addFields:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                            result: {
                                $eq: [
                                    {
                                        $toInt: '$stringOne',
                                    },
                                    {
                                        $toInt: '$stringTwo',
                                    },
                                ],
                            },
                        },
                            },
                            {
                                $addFields:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                            timestamp: {
                                $cond: [
                                    '$result',
                                    '$timestamp',
                                    new Date(date),
                                ],
                            },
                            instances: {
                                $cond: ['$result', '$intances', document.toString().instances]
                            }
                        },
                            },
                            {
                                $project:
                        /**
                         * newField: The new field name.
                         * expression: The new field expression.
                         */
                        {
                            dateOnly: 0,
                            newDateOne: 0,
                            newDateTwo: 0,
                            result: 0,
                            stringOne: 0,
                            stringTwo: 0,
                        },
                            },
                        ]
                    ).toArray();
                      
                });
            });
            
            console.log('data2 ==> ', data );
            console.log('All objects have been processed');

            res.status(200).json({message :'data is here ', data});
            session.commitTransaction();
            client.close();
        });
           
         
    }catch(err){
        console.log('err in reading the file ', err.message);
        res.status(401).json({ err: err.message});
        client.close();
    }
     
    
});


server.listen(9000, ()=> {

    console.log('==  server is running on port 9000 ====');


});

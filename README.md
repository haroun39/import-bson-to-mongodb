in folder databases put "database_name"/"collection_name"<br></br>
ex:<br></br>
    databases:<br></br>
        -database1:<br></br>
            --collection1.bson<br></br>
            --collection2.bson<br></br>
            --collection3.bson<br></br>
        -database2:<br></br>
            --collection1.bson<br></br>
            --collection2.bson<br></br>
            --collection3.bson<br></br>
result<br></br>
    databases_for_mongo:<br></br>
        -database1:<br></br>
            --collection1.json<br></br>
            --collection2.json<br></br>
            --collection3.json<br></br>
        -database2:<br></br>
            --collection1.json<br></br>
            --collection2.json<br></br>
            --collection3.json<br></br>

and uplode in your mongodb server 

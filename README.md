in folder databases put "database_name"/"collection_name"<br>
ex:<br>
    databases:<br>
        -database1:<br>
            --collection1.bson<br>
            --collection2.bson<br>
            --collection3.bson<br>
        -database2:<br>
            --collection1.bson<br>
            --collection2.bson<br>
            --collection3.bson<br>
result<br></br>
    databases_for_mongo:<br>
        -database1:<br>
            --collection1.json<br>
            --collection2.json<br>
            --collection3.json<br>
        -database2:<br>
            --collection1.json<br>
            --collection2.json<br>
            --collection3.json<br>

then it'll be uploaded in your mongodb server 

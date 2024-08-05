in folder databases put "database_name"/"collection_name"
ex:
    databases:
        -database1:
            --collection1.bson
            --collection2.bson
            --collection3.bson
        -database2:
            --collection1.bson
            --collection2.bson
            --collection3.bson
result
    databases_for_mongo:
        -database1:
            --collection1.json
            --collection2.json
            --collection3.json
        -database2:
            --collection1.json
            --collection2.json
            --collection3.json

and uplode in your mongodb server 

const express = require('express');  
const router = express.Router(); 
const connectData = require('../crowdfunding_db');
const e = require('express');

async function getAllData(req, res) {
    try{
        const connect = await connectData();
        const [rows, fields] = await connect.execute('SELECT * FROM fundraiser')
        console.log(rows)
        res.send({
            code: 200,
            data: rows
        })
    } catch (e) {
        console.log(e)
    }
}

async function getAllTypeData(req, res) {
    try{
        const connect = await connectData();
        const [rows, fields] = await connect.execute('SELECT * FROM category')
        console.log(rows)
        res.send({
            code: 200,
            data: rows
        })
    } catch (e) {
        console.log(e)
    }
}
async function getProgress(req, res) {
    try{
        const connect = await connectData();
        const [rows, fields] = await connect.execute('SELECT * FROM fundraiser WHERE ACTIVE_CATEGORY_ID = 1')
        console.log(rows)
        res.send({
            code: 200,
            data: rows
        })
    } catch (e) {
        console.log(e)}
}

async function getTypeData(req, res) {
    try{
        const connect = await connectData();
        let conditions = [];
        let params = [];
        const {type, CAPTION, CITY } = req.query
        if (type !== null && type !== undefined && type !== '') {
            conditions.push('ACTIVE_CATEGORY_ID = ?');
            params.push(type);
        }
        if (CAPTION !== null && CAPTION !== undefined && CAPTION !== '') {
            conditions.push('CAPTION = ?');
            params.push(CAPTION);
        }
        if (CITY !== null && CITY !== undefined && CITY !== '') {
            conditions.push('CITY = ?');
            params.push(CITY);
        }
        let whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        console.log(whereClause)
        const [rows, fields] = await connect.execute(`SELECT * FROM fundraiser ${whereClause}`,params)
        console.log(rows)
        res.send({
            code: 200,
            data: rows
        })
    } catch (e) {
        console.log(e)
    }
}

async function getDataInfo(req, res) {
    try{
        const connect = await connectData();
       
        const userId = req.query.userId
        console.log(userId)
        if (userId) {
            const [rows, fields] = await connect.execute('SELECT * FROM fundraiser WHERE FUNDRAISER_ID = ?',[userId])
            console.log(rows)
            res.send({
                code: 200,
                data: rows
            })
        } else {
            res.send({
                code: 400,
                msg: 'Missing UserID'
            })
        }

    } catch (e) {
        console.log(e)
    }
}



router.get('/allData', getAllData); 
router.get('/allTypeData', getAllTypeData); 
router.get('/getProgress', getProgress);
router.get('/getTypeData', getTypeData);
router.get('/getDataInfo', getDataInfo);

module.exports = router;
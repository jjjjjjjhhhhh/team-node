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
// add fundraiser data
async function addFundraiserData(req, res) {
    try{
        const connect = await connectData();
        console.log(req.body)
        const {VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID,Active} = req.body
        const [rows, fields] = await connect.execute('INSERT INTO fundraiser (VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID,Active) VALUES (?,?,?,?,?,?,?,?)',[VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID,Active])
        res.send({
            code: 200,
            data: 'success'
        })
    } catch (e) {
        console.log(e)
        res.send({
            code: 500,
            data: 'missing parameter'
        })
    }
}
// update fundraiser data
async function updateFundraiserData(req, res) {
    try{
        console.log(req.body,'----')

        const connect = await connectData();
        const {VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID,Active} = req.body
        const FUNDRAISER_ID = req.body.FUNDRAISER_ID
        console.log(VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID)
        const [rows, fields] = await connect.execute('UPDATE fundraiser SET VALUE =?, ORGANIZER =?, CAPTION =?, TARGET_FUNDING =?, CURRENT_FUNDING =?, CITY =?, ACTIVE_CATEGORY_ID =?,Active=? WHERE FUNDRAISER_ID =?',
            [VALUE, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE_CATEGORY_ID,Active,FUNDRAISER_ID])
        res.send({
                code: 200,
                data: 'success'
        })    
    }catch (e) {
        console.log(e)
        res.send({
            code: 500,
            data: 'missing parameter'
        })
    }
}
// delete fundraiser data

async function deleteFundraiserData(req, res) {
    try{
        const connect = await connectData();
        const FUNDRAISER_ID = req.query.FUNDRAISER_ID
        const ACTIVE_CATEGORY_ID = req.query.ACTIVE_CATEGORY_ID
        console.log(FUNDRAISER_ID)
        if (ACTIVE_CATEGORY_ID == 0) {
            const [rows, fields] = await connect.execute('DELETE FROM fundraiser WHERE FUNDRAISER_ID =?',[FUNDRAISER_ID])
            res.send({
                code: 200,
                data: 'success'
            })
        } else {
            res.send({
                code: 400,
                data: 'ACTIVE_CATEGORY_ID !== 0'
            })
        }
 
    } catch(e) {
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
        const [rows, fields] = await connect.execute('SELECT * FROM fundraiser WHERE Active = 0')
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
        const {type, CAPTION, CITY,ORGANIZER,CURRENT_FUNDING,VALUE,ACTIVE_CATEGORY_ID} = req.query
        if (ACTIVE_CATEGORY_ID !== null && ACTIVE_CATEGORY_ID !== undefined && ACTIVE_CATEGORY_ID !== '') {
            conditions.push('ACTIVE_CATEGORY_ID = ?');
            params.push(type);
        }
        if (type !== null && type !== undefined && type !== '') {
            conditions.push('Active = ?');
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
        if (ORGANIZER !== null && ORGANIZER !== undefined && ORGANIZER !== '') {
            conditions.push('ORGANIZER = ?');
            params.push(ORGANIZER);
        }
        if (CURRENT_FUNDING !== null && CURRENT_FUNDING !== undefined && CURRENT_FUNDING !== '') {
            conditions.push('CURRENT_FUNDING = ?');
            params.push(CURRENT_FUNDING);
        }
        if (VALUE !== null && VALUE !== undefined && VALUE !== '') {
            conditions.push('VALUE = ?');
            params.push(VALUE);
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
// get donation data
async function getDonationData(req, res) {
    try{
        const connect = await connectData();
        const FUNDRAISER_ID = req.query.FUNDRAISER_ID
        if (FUNDRAISER_ID) {
            const [rows, fields] = await connect.execute('SELECT * FROM donation WHERE FUNDRAISER_ID =? ORDER BY DATE DESC',[FUNDRAISER_ID])
            console.log(rows)
            res.send({
                code: 200,
                data: rows
            })
        } else {
            res.send({
                code: 400,
                msg: 'Missing FUNDRAISER_ID'
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            code: 500,
            msg: e
        })
    }
}
// add donation data
async function addDonationData(req,res) {
    const {DATE, AMOUNT, GIVER, FUNDRAISER_ID} = req.body
    const connect = await connectData();
    await connect.beginTransaction();  
    try{

        const [rows1,fields1] = await connect.execute('UPDATE fundraiser SET CURRENT_FUNDING = CURRENT_FUNDING +? WHERE FUNDRAISER_ID =?',[AMOUNT, FUNDRAISER_ID])
        const [rows, fields] = await connect.execute('INSERT INTO donation (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?,?,?,?)',[DATE, AMOUNT, GIVER, FUNDRAISER_ID])
        // 提交事务  
        await connect.commit();  
  
        res.send({
            code: 200,
            data:'success'
        })
    } catch(e) {
        await connect.rollback();  
        res.send({
            code: 500,
            data: 'missing parameter'
        })
    }
}





router.get('/allData', getAllData); 
router.post('/addFundraiserData', addFundraiserData);
router.put('/updateFundraiserData', updateFundraiserData);
router.delete('/deleteFundraiserData', deleteFundraiserData);

router.get('/allTypeData', getAllTypeData); 
router.get('/getProgress', getProgress);
router.get('/getTypeData', getTypeData);
router.get('/getDataInfo', getDataInfo);


router.get('/getDonationData', getDonationData);
router.post('/addDonationData', addDonationData);

module.exports = router;
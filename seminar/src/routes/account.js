const express = require('express');
const AccountModel = require('../models/account');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    //#total = 10000;

    constructor() { console.log("[Bank-DB] DB Init Completed"); }

    getBalance = async ( username ) => {
        try {
            const UsernameFilter = { username: username };
            const res = await AccountModel.findOne(UsernameFilter);
            return { success: true, data: res.balance };
        } catch (e) {
            console.log(`[Bank-DB] Find Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    transaction = async ( username, amount ) => {
        try {
            const UsernameFilter = { username: username };
            const updateOption = { returnDocument: "after" };
            const before = await AccountModel.findOne(UsernameFilter);
            const after = await AccountModel.findOneAndUpdate(UsernameFilter, { $inc: { balance: amount } }, updateOption);

            return { success: true, data: { old: before.balance, new: after.balance } };
        } catch (e) {
            console.log(`[Bank-DB] Update Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }
}

const bankDBInst = BankDB.getInst();

router.post('/getInfo', authMiddleware, async (req, res) => {
    try {
        const { username } = req.body.credential;

        const { success, data } = await bankDBInst.getBalance(username);

        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, async (req, res) => {
    try {
        const { username } = req.body.credential;
        const { amount } = req.body;

        const { success, data } = await bankDBInst.transaction( username, parseInt(amount) );

        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;
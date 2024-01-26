import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');

const createNewTable = (tableName: string) => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY NOT NULL, value TEXT);`,
            [],
            (tx, results) => {
                console.log('Table created successfully');
            },
            (_, error) => {
                console.log(error);
                return true;
            }
        );
    });
};

const insertIntoTable = (tableName: string, value: string) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO ${tableName} (value) VALUES (?)`,
            [value],
            (tx, results) => {
                console.log('Inserted successfully');
            },
            (_, error) => {
                console.log(error);
                return true;
            }
        );
    });
};


const getTableData = (tableName: string) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM ${tableName}`,
            [],
            (tx, results) => {
                console.log('Selected successfully');
                console.log('Selected successfully',results.rows);
            },
            (_, error) => {
                console.log(error);
                return true;
            }
        );
    });
};


export {
    createNewTable,
    insertIntoTable,
    getTableData
};

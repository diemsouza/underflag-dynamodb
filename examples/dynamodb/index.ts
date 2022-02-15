import { Underflag } from 'underflag';
import { DynamodbDataProvider } from '../../src/providers';
import config from './config.json';

/*
 * default tableName is features
 * the table need two columns key (primary key) and value (BOOL, N, S...)
*/

const print = async (underflag: Underflag, key: string) => {
    const data = await underflag.getFeature(key);
    return {
        key,
        status: data?.isOn() ? 'on' : 'off',
        value: data?.value,
        origin: data?.origin
    };
};

(async () => {
    // config data provider
    // const client = new DynamoDBClient({ region: "us-east-1" });
    // const client = new DynamoDB({ region: "us-east-1" });
    const client = { region: "us-east-1" };

    // use data privider
    const dataProvider = new DynamodbDataProvider({ client });
    const underflag = new Underflag({ dataProvider });
    await underflag.getAllFeatures()
    // check flags
    const list: any[] = [];
    for (const key of config.features) {
        list.push(await print(underflag, key));
    }
    list.push(await print(underflag, 'other'));
    console.table(list);
})();
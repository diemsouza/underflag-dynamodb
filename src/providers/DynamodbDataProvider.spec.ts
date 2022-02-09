import { DynamodbDataProvider } from '.';
import { Underflag } from 'underflag';
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { V3 } from 'jest-aws-simple-mock';

describe('Data Provider', () => {
    describe('Dynamodb', () => {

        test('should return feature test-a on', async () => {
            const spy = V3.mockDynamoDB.send({
                Item: { key: { S: 'test-a' }, value: { BOOL: true } }
            });
            const client = new DynamoDB({ region: "us-east-1" });
            const dataProvider = new DynamodbDataProvider({ client });
            const underflag = new Underflag({ dataProvider });
            await expect(underflag.isOn('test-a')).resolves.toBeTruthy();
        });

        test('should return feature test-b off', async () => {
            const spy = V3.mockDynamoDB.send({
                Item: { key: { S: 'test-b' }, value: { BOOL: false } }
            });
            const client = new DynamoDB({ region: "us-east-1" });
            const dataProvider = new DynamodbDataProvider({ client });
            const underflag = new Underflag({ dataProvider });
            await expect(underflag.isOff('test-b')).resolves.toBeTruthy();
        });

        test('should return two features', async () => {
            const spy = V3.mockDynamoDB.send({
                Count: 2,
                Items: [
                    { key: { S: 'test-a' }, value: { BOOL: true } },
                    { key: { S: 'test-b' }, value: { BOOL: false } }
                ]
            });
            const client = new DynamoDB({ region: "us-east-1" });
            const dataProvider = new DynamodbDataProvider({ client });
            const underflag = new Underflag({ dataProvider });
            const res = await underflag.getAllFeatures();
            expect(res).toBeInstanceOf(Array);
            expect(res.length).toEqual(2);
        });
    });
});
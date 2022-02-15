import { IDataProvider, BaseFeature } from 'underflag';
import { DynamoDB, DynamoDBClient, GetItemCommand, ScanCommand, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const DEFAULT_TABLE = 'features';

interface Options {
    /** Table name of data. Default: 'features' */
    tableName?: string,
    /** An instance or config to dynamodb */
    client: DynamoDB | DynamoDBClient | DynamoDBClientConfig
}

export class DynamodbDataProvider implements IDataProvider {
    private client: DynamoDB | DynamoDBClient;
    private tableName: string;

    constructor(options: Options) {
        if (options.client instanceof DynamoDBClient) {
            this.client = options.client as DynamoDBClient;
        } else if (options.client instanceof DynamoDB) {
            this.client = options.client as DynamoDB;
        } else {
            this.client = new DynamoDBClient(options.client as DynamoDBClientConfig);
        }
        this.tableName = options.tableName || DEFAULT_TABLE;
    }

    async getAll(): Promise<BaseFeature[]> {
        const params = {
            TableName: this.tableName
        };
        const { Items, Count } = await this.client.send(new ScanCommand(params));
        if (!Items || !Count) return [];
        return Items.map(a => unmarshall(a)) as BaseFeature[];
    }

    async get(key: string): Promise<BaseFeature | undefined> {
        const params = {
            TableName: this.tableName,
            Key: marshall({ key })
        };
        const { Item } = await this.client.send(new GetItemCommand(params));
        if (!Item) return undefined;
        const item = unmarshall(Item);
        return {
            key: item.key,
            value: item.value
        }
    }
}
import { Connection, ConnectionOptions } from '@kifly/monsel/src/core/connection/connection';
import { AbstractDocument } from "@kifly/monsel/src/core/document/abstract.document";
import { DynamicModule, Global, Inject, Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

export interface MonselCoreModuleForRootOptions extends ConnectionOptions {
}

export interface MonselCoreModuleForRootAsyncOptions {
    inject: any[];
    useFactory: (...args: any) => MonselCoreModuleForRootOptions;
}

@Global()
@Module({})
export class MonselCoreModule implements OnApplicationBootstrap, OnApplicationShutdown {
    public static readonly DATABASE_MODULE_OPTIONS = randomStringGenerator();
    public static readonly DOCUMENTS = new Map<string, typeof AbstractDocument>();

    public static forRoot(options: MonselCoreModuleForRootOptions): DynamicModule {
        return {
            module: MonselCoreModule,
            providers: [
                {
                    provide: MonselCoreModule.DATABASE_MODULE_OPTIONS,
                    useValue: options
                }
            ]
        };
    }

    public static forRootAsync(options: MonselCoreModuleForRootAsyncOptions): DynamicModule {
        return {
            module: MonselCoreModule,
            providers: [
                {
                    provide: MonselCoreModule.DATABASE_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject
                }
            ]
        };
    }

    @Inject(MonselCoreModule.DATABASE_MODULE_OPTIONS)
    protected options: MonselCoreModuleForRootOptions;

    protected connection: Connection;

    public async onApplicationBootstrap() {
        const documents = [
            ...this.options.documents || [],
            ...MonselCoreModule.DOCUMENTS.values()
        ];

        this.connection = new Connection({
            ...this.options,
            documents
        });

        await this.connection.connect();
        await this.connection.syncIndexes();
        await this.connection.createIndexes();
    }

    public async onApplicationShutdown() {
        await this.connection.disconnect();
    }
}

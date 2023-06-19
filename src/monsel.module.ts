import { AbstractDocument } from "@kifly/monsel/src/core/document/abstract.document";
import { DynamicModule, Module } from "@nestjs/common";
import { MonselCoreModule, MonselCoreModuleForRootAsyncOptions, MonselCoreModuleForRootOptions } from "./monsel-core.module";

@Module({})
export class MonselModule {
    public static forRoot(options: MonselCoreModuleForRootOptions): DynamicModule {
        return {
            module: MonselModule,
            imports: [
                MonselCoreModule.forRoot(options)
            ]
        };
    }

    public static forRootAsync(options: MonselCoreModuleForRootAsyncOptions): DynamicModule {
        return {
            module: MonselModule,
            imports: [
                MonselCoreModule.forRootAsync(options)
            ]
        };
    }

    public static forFeature(documents: Array<typeof AbstractDocument>): DynamicModule {
        for (const document of documents) {
            MonselCoreModule.DOCUMENTS.set(document.getModelName(), document);
        }

        return {
            module: MonselModule
        };
    }
}

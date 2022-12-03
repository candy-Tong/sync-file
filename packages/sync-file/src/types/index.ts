export interface FileConfig {
    source: string,
    destDir?: string
    name: string
}

export interface SyncConfig{
    fileList: FileConfig[]
}

export type UserSyncConfig = SyncConfig | FileConfig[]

export interface MetaData{
    fileList?: FileConfig[]
}

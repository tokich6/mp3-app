export interface FileUploadInDto {
    filename: string;
    mimetype: string;
    size?: number;
    path: string;
}

export interface FileUploadOutDto {
    frameCount: number;
}
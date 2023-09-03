import { Request, Response } from "express";
import FileService from "../service/FileService";
import { errorResponse } from "../utils/writer";

export default class FileController {
    /**
     * Get File
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getFile(req: Request, res: Response) {
        try {
            if (!req.params.filename) {
                return errorResponse(res, 400, 'BAD_REQUEST', 'Filename is required');
            }

            const fileService = new FileService();
            const file = await fileService.getFile(req.params.filename);

            if (!file) {
                return errorResponse(res, 404, 'NOT_FOUND', 'File Not Found');
            }
            res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
            res.setHeader('Content-Type', file.ContentType ?? 'application/octet-stream');
            const stream = file.Body as NodeJS.ReadableStream;
            return stream.pipe(res);

        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}